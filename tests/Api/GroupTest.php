<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Group;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;

class GroupsControllerTest extends TestCase
{
    use WithFaker;

    public function testGroupImportSuccess()
    {
        $fileName = 'groups.csv';
        $filePath = base_path() . "/csv/$fileName";

        $response = $this->json('POST', '/api/groups', [
            'importFile' => new UploadedFile($filePath, $fileName, 'application/vnd.ms-excel', filesize($filePath), false, true)
        ]);

        $response->assertStatus(200);
    }

    public function testGroupImportSuccessWithMoreData()
    {
        $fileName = 'groups_more.csv';
        $filePath = base_path() . "/csv/$fileName";

        $response = $this->json('POST', '/api/groups', [
            'importFile' => new UploadedFile($filePath, $fileName, 'application/vnd.ms-excel', filesize($filePath), false, true)
        ]);

        $response->assertStatus(200);
    }

    public function testGroupImportEmptyFile()
    {
        $fileName = 'groups_empty.csv';
        $filePath = base_path() . "/csv/$fileName";

        $response = $this->json('POST', '/api/groups', [
            'importFile' => new UploadedFile($filePath, $fileName, 'application/vnd.ms-excel', filesize($filePath), false, true)
        ]);

        $response->assertStatus(400)->
            assertExactJson([
                'error' => true,
                'msg' => 'The CSV file does not contain any data.'
            ]);
    }

    public function testGroupImportInvalidCsvFormat()
    {
        $fileName = 'groups_invalid_csv_format.csv';
        $filePath = base_path() . "/csv/$fileName";

        $response = $this->json('POST', '/api/groups', [
            'importFile' => new UploadedFile($filePath, $fileName, 'application/vnd.ms-excel', filesize($filePath), false, true)
        ]);

        $response->assertStatus(400)->
            assertExactJson([
                'error' => true,
                'msg' => 'The CSV file is not properly formatted. Please try again.'
            ]);
    }

    public function testPersonImportMissingData()
    {
        $fileName = 'groups_missing_data.csv';
        $filePath = base_path() . "/csv/$fileName";

        $response = $this->json('POST', '/api/groups', [
            'importFile' => new UploadedFile($filePath, $fileName, 'application/vnd.ms-excel', filesize($filePath), false, true)
        ]);

        $response->assertStatus(400)->
            assertExactJson([
                'error' => true,
                'msg' => 'The following errors have occurred with trying to import the uploaded file: The group name field is required.'
            ]);
    }

    public function testGroupRetrieved()
    {
        $group = factory('App\Models\Group')->create();

        $response = $this->json('GET', '/api/groups/' . $group->id);
        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'group_name',
                    'created_at',
                    'updated_at'
                ]
            ]);
    }

    public function testAllGroupsRetrieved()
    {
        $group = factory('App\Models\Group', 25)->create();

        $response = $this->json('GET', '/api/groups');
        $response
            ->assertStatus(200)
            ->assertJsonCount(25, 'data');
    }

    public function testNoGroupRetrieved()
    {
        $group = factory('App\Models\Group')->create();
        Group::destroy($group->id);

        $response = $this->json('GET', '/api/groups/' . $group->id);
        $response->assertStatus(404);
    }

    public function testGroupUpdated()
    {
        $group = factory('App\Models\Group')->create();

        $updatedGroupName = $this->faker->name();
        $response = $this->json('PUT', '/api/groups/' . $group->id, [
            'group_name' => $updatedGroupName
        ]);
        $response->assertStatus(200);

        $updatedGroup = Group::find($group->id);
        $this->assertEquals($updatedGroupName, $updatedGroup->group_name);
    }

    public function testGroupDeleted()
    {
        $group = factory('App\Models\Group')->create();

        $deleteResponse = $this->json('DELETE', '/api/groups/' . $group->id);
        $deleteResponse->assertStatus(200);

        $response = $this->json('GET', '/api/groups/' . $group->id);
        $response->assertStatus(404);

    }
}
