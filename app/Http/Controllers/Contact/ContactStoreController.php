<?php

/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\Contact;

use App\Data\ContactData;
use App\Data\UserData;
use App\Http\Controllers\Controller;
use App\Http\Requests\ContactRequest;
use App\Models\Contact;
use Inertia\Inertia;

class ContactStoreController extends Controller
{
    public function __invoke(ContactRequest $request)
    {
        $contact = new Contact();

        return Inertia::render('Contacts/Create', [
            'client' => ContactData::from($contact),
        ]);
    }
}
