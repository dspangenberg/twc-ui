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
        'hourly' => 0,
        'dob' => null
    ];

    protected function casts(): array
    {
        return [
            'dob' => 'date',
        ];
    }
}
