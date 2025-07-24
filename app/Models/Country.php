<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected function casts(): array
    {
        return [
            'data' => 'array',
        ];
    }
}
