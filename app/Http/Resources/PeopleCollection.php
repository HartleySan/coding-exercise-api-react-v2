<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class PeopleCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
     public function toArray($request)
     {
        $this->collection = $this->collection->map(function ($person) {
            $person->status_name = $person->status_name;
            $person->group_name = $person->group_name;

            return $person;
        });

         return [
             'success' => true,
             'data' => $this->collection
         ];
     }
}
