<?php

/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\Contact;

use App\Data\ContactData;
use App\Data\CountryData;
use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Country;
use Inertia\Inertia;

class DialogContactCreateController extends Controller
{
    public function __invoke()
    {

        $contact = Contact::query()->first();

        return Inertia::render('demos/dialog/with-confirmation', [
            'contact' => ContactData::from($contact),
            'countries' => CountryData::collect(Country::query()->orderBy('name')->get())
        ]);
    }
}
