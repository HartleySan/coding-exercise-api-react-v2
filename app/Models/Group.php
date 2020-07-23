<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    protected $fillable = [
        'group_name'
    ];

    public function activePeople() {
        return $this->hasMany('App\Models\Person')->where('status', 'active');
    }

    public function getActivePeopleStringAttribute() {
        return $this->activePeople->
            map(function ($activePerson) {
                return $activePerson->full_name;
            })->
            join("\n");
    }
}
