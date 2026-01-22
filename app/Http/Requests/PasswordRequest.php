<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class PasswordRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'current_password' => [
                'required', 'current_password:web',
            ],
            'password' => [
                'required', Password::min(12)->mixedCase()->numbers()->symbols()->uncompromised(), 'confirmed',
            ]
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
