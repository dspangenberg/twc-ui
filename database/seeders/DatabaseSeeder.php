<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\Country as CountryModel;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Rinvex\Country\Country;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Contact::factory(10)->create();

        $countries = countries();
        foreach ($countries as $country) {
            dump($country);
            $c = new CountryModel;
            $c->name = $country['name'];
            $c->iso_code = $country['iso_3166_1_alpha2'];
            $c->data = $egypt = country($country['iso_3166_1_alpha2'])->getAttributes();
            $c->save();
        }
    }
}
