<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class GroupsCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
     public function toArray($request)
     {
        $this->collection = $this->collection->map(function ($group) {
            $group->active_people_string = $group->active_people_string;

            return $group;
        });

         return [
             'success' => true,
             'data' => $this->collection
         ];
     }
}
