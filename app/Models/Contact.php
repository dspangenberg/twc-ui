<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $attributes = [
        'first_name' => '',
        'last_name' => '',
        'email' => '',
        'gender' => 'f',
        'is_vip' => false,
        'dob' => null
    ];
}
