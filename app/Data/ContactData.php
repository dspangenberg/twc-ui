<?php

/*
 * Beleg-Portal is a twiceware solution
 * Copyright (c) 2025 by Rechtsanwalt Peter Trettin
 *
 */

namespace App\Data;

use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;
use Illuminate\Support\Carbon;

#[TypeScript]
class ContactData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $first_name,
        public readonly string $last_name,
        public readonly string $email,
        public readonly string $gender,
        public readonly ?string $note,
        public readonly bool $is_vip,
        public readonly float $hourly,
        public readonly ?int $country_id,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public readonly ?Carbon
        $dob,
    ) {
    }
}
