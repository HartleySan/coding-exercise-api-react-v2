<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemList extends Model
{
    protected $fillable = [
        'list_name',
        'list_item_namespace',
        'list_item_label'
    ];
}
