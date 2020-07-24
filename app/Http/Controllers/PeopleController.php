<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

use App\Http\Resources\PeopleCollection;
use App\Http\Resources\PersonResource;
use App\Models\Group;
use App\Models\Person;
use App\Models\SystemList;
use App\Utils\CsvUtils;
use App\Utils\ResponseUtils;
use Validator;

class PeopleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return new PeopleCollection(Person::all());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if ($request->hasFile('importFile')) {
            $importFile = request()->file('importFile');

            if (isset($importFile)) {
                $fileData = CsvUtils::getDataFromFilePath($importFile->getRealPath());

                if (count($fileData) > 1) {
                    $headers = array_shift($fileData);

                    if ($headers === ['id', 'first_name', 'last_name', 'email_address', 'status'] ||
                        $headers === ['id', 'first_name', 'last_name', 'email_address', 'status', 'group_name']) {
                        if (CsvUtils::isValidCsvData($headers, $fileData)) {
                            $mappedFileData = CsvUtils::mapDataToHeaders($headers, $fileData);

                            $existingPeopleIds = Person::all()->
                                map(function ($person) {
                                    return (string) $person->id;
                                })->
                                toArray();

                            $groupsMap = Group::all()->
                                mapWithKeys(function ($group) {
                                    return [$group->group_name => $group->id];
                                });

                            foreach ($mappedFileData as $row) {
                                // https://laravel.com/docs/7.x/validation
                                $validator = Validator::make($row, [
                                    'first_name'    => 'required|max:255',
                                    'last_name'     => 'required|max:255',
                                    'email_address' => 'required|email',
                                    'status'        => Rule::in(['active', 'archived']),
                                    'group_name'    => 'nullable'
                                ]);

                                if ($validator->fails()) {
                                    return [
                                        'validationFailure' => true
                                    ];
                                }

                                // Check for a valid group name and map to a group ID.
                                if (isset($row['group_name'])) {
                                    $row['group_id'] = $groupsMap[$row['group_name']] ?? null;
                                }

                                // Update or insert.
                                if (in_array($row['id'], $existingPeopleIds)) {
                                    Person::find($row['id'])->update($row);
                                } else {
                                    Person::create($row);
                                }
                            }

                            return new PeopleCollection(Person::all());
                        }

                        return ResponseUtils::error('The CSV file is not properly formatted. Please try again.');
                    }

                    return ResponseUtils::error('The CSV file headers are not valid. The header row must be one of the following: id, first_name, last_name, email_address, status OR id, first_name, last_name, email_address, status, group_name');
                }

                return ResponseUtils::error('The CSV file does not contain any data.');
            }
        }

        return ResponseUtils::error('The selected file is not a valid CSV file. Please try again.');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return new PersonResource(Person::findOrFail($id));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $statuses = SystemList::where('list_name', 'person_status')->
            get()->
            map(function ($listItem) {
                return [
                    'id' => $listItem->list_item_namespace,
                    'name' => $listItem->list_item_label
                ];
            });

        $groups = Group::select('id', 'group_name AS name')->
            orderBy('name', 'asc')->
            get();

        return [
            'editItem' => new PersonResource(Person::findOrFail($id)),
            'options' => [
                'statuses' => $statuses,
                'groups' => $groups
            ]
        ];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $person = Person::findOrFail($id);
        $person->update($request->all());

        return response()->json(null, 204);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $person = Person::findOrFail($id);
        $person->delete();

        return response()->json(null, 204);
    }
}
