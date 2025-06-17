<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
