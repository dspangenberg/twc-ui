<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class ContactRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'first_name' => ['required'],
            'last_name' => ['required'],
            'email' => ['required', 'email', 'max:254'],
            'gender' => ['required'],
            'is_vip' => ['required'],
            'hourly' => ['required', 'numeric', 'gt:0'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
