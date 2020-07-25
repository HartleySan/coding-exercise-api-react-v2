<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Person;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;

class PeopleControllerTest extends TestCase
{
    use WithFaker;

    public function testPersonImportSuccess()
    {
        $fileName = 'people.csv';
        $filePath = base_path() . "/csv/$fileName";

        $response = $this->json('POST', '/api/people', [
            'importFile' => new UploadedFile($filePath, $fileName, 'application/vnd.ms-excel', filesize($filePath), false, true)
        ]);

        $response->assertStatus(200);
    }

    public function testPersonImportSuccessWithMoreData()
    {
        $fileName = 'people_more.csv';
        $filePath = base_path() . "/csv/$fileName";

        $response = $this->json('POST', '/api/people', [
            'importFile' => new UploadedFile($filePath, $fileName, 'application/vnd.ms-excel', filesize($filePath), false, true)
        ]);

        $response->assertStatus(200);
    }

    public function testPersonImportInvalidHeaders()
    {
        $fileName = 'people_invalid_headers.csv';
        $filePath = base_path() . "/csv/$fileName";

        $response = $this->json('POST', '/api/people', [
            'importFile' => new UploadedFile($filePath, $fileName, 'application/vnd.ms-excel', filesize($filePath), false, true)
        ]);

        $response->assertStatus(400)->
            assertExactJson([
                'error' => true,
                'msg' => 'The CSV file headers are not valid. The header row must be one of the following: id, first_name, last_name, email_address, status OR id, first_name, last_name, email_address, status, group_name'
            ]);
    }

    public function testPersonImportInvalidFileFormat()
    {
        $fileName = 'invalid_file_format.png';
        $filePath = base_path() . "/csv/$fileName";

        $response = $this->json('POST', '/api/people', [
            'importFile' => new UploadedFile($filePath, $fileName, 'image/png', filesize($filePath), false, true)
        ]);

        $response->assertStatus(400)->
            assertExactJson([
                'error' => true,
                'msg' => 'The uploaded file is not a valid CSV file. Please try again.'
            ]);
    }

    public function testPersonImportMissingData()
    {
        $fileName = 'people_missing_data.csv';
        $filePath = base_path() . "/csv/$fileName";

        $response = $this->json('POST', '/api/people', [
            'importFile' => new UploadedFile($filePath, $fileName, 'application/vnd.ms-excel', filesize($filePath), false, true)
        ]);

        $response->assertStatus(400)->
            assertExactJson([
                'error' => true,
                'msg' => 'The following errors have occurred with trying to import the uploaded file: The first name field is required.'
            ]);
    }

    public function testPersonImportFailureNoFile()
    {
        $response = $this->json('POST', '/api/people', []);

        $response->assertStatus(400)->
            assertExactJson([
                'error' => true,
                'msg' => 'Please upload a valid file.'
            ]);
    }

    public function testPersonRetrieved()
    {
        $person = factory('App\Models\Person')->create();

        $response = $this->json('GET', '/api/people/' . $person->id);
        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'first_name',
                    'last_name',
                    'email_address',
                    'status',
                    'created_at',
                    'updated_at'
                ]
            ]);
    }

    public function testAllPeopleRetrieved()
    {
        $person = factory('App\Models\Person', 25)->create();

        $response = $this->json('GET', '/api/people');
        $response
            ->assertStatus(200)
            ->assertJsonCount(25, 'data');
    }

    public function testNoPersonRetrieved()
    {
        $person = factory('App\Models\Person')->create();
        Person::destroy($person->id);

        $response = $this->json('GET', '/api/people/' . $person->id);
        $response->assertStatus(404);
    }

    public function testPersonUpdated()
    {
        $person = factory('App\Models\Person')->create();

        $updatedFirstName = $this->faker->firstName();
        $response = $this->json('PUT', '/api/people/' . $person->id, [
            'first_name' => $updatedFirstName
        ]);
        $response->assertStatus(200);

        $updatedPerson = Person::find($person->id);
        $this->assertEquals($updatedFirstName, $updatedPerson->first_name);
    }

    public function testPersonDeleted()
    {
        $person = factory('App\Models\Person')->create();

        $deleteResponse = $this->json('DELETE', '/api/people/' . $person->id);
        $deleteResponse->assertStatus(200);

        $response = $this->json('GET', '/api/people/' . $person->id);
        $response->assertStatus(404);

    }
}
