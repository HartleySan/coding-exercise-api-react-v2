<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\SystemList;

class Person extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'email_address',
        'status',
        'group_id'
    ];

    public function getFullNameAttribute() {
        return "{$this->first_name} {$this->last_name}";
    }

    public function group() {
        return $this->belongsTo('App\Models\Group');
    }

    public function getGroupNameAttribute() {
        return isset($this->group) ? $this->group->group_name : null;
    }

    public function getStatusNameAttribute() {
        $listItem = SystemList::where('list_name', 'person_status')->
            where('list_item_namespace', $this->status)->
            first();

        return isset($listItem) ? $listItem->list_item_label : null;
    }
}
