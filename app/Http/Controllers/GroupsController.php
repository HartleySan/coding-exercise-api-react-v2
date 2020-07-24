<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

use App\Http\Resources\GroupsCollection;
use App\Http\Resources\GroupResource;
use App\Models\Group;
use App\Utils\CsvUtils;
use App\Utils\ResponseUtils;
use Validator;

class GroupsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return new GroupsCollection(Group::all());
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

                    if ($headers === ['id', 'group_name']) {
                        if (CsvUtils::isValidCsvData($headers, $fileData)) {
                            $mappedFileData = CsvUtils::mapDataToHeaders($headers, $fileData);

                            $existingGroupIds = Group::all()->
                                map(function ($group) {
                                    return (string) $group->id;
                                })->
                                toArray();

                            foreach ($mappedFileData as $row) {
                                $validator = Validator::make($row, [
                                    'group_name' => 'required|max:255'
                                ]);

                                if ($validator->fails()) {
                                    return [
                                        'validationFailure' => true
                                    ];
                                }

                                // Update or insert.
                                if (in_array($row['id'], $existingGroupIds)) {
                                    Group::find($row['id'])->update($row);
                                } else {
                                    Group::create($row);
                                }
                            }

                            return new GroupsCollection(Group::all());
                        }

                        return ResponseUtils::error('The CSV file is not properly formatted. Please try again.');
                    }

                    return ResponseUtils::error('The CSV file headers are not valid. The header row must be the following: id, group_name');
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
        return new GroupResource(Group::findOrFail($id));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        return [
            'editItem' => new GroupResource(Group::findOrFail($id))
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
        $group = Group::findOrFail($id);
        $requestData = $request->all();

        if (isset($requestData['group_name']) &&
            !empty($requestData['group_name'])) {
            $group->update($requestData);

            return ResponseUtils::success();
        }

        return ResponseUtils::error('Please provide a valid value for all fields.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $group = Group::findOrFail($id);
        $group->delete();

        return response()->json(null, 204);
    }
}
