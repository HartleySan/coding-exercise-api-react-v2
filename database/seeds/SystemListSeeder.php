<?php

use Illuminate\Database\Seeder;
use App\Models\SystemList;

class SystemListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        SystemList::insert([
            [
                'list_name' => 'person_status',
                'list_item_namespace' => 'active',
                'list_item_label' => 'Active',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'list_name' => 'person_status',
                'list_item_namespace' => 'archived',
                'list_item_label' => 'Archived',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
