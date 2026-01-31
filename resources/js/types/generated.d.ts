declare namespace App.Data {
  export type ContactData = {
    id: number | null
    first_name: string
    last_name: string
    email: string
    gender: string
    note: string | null
    is_vip: boolean
    hourly: number
    country_id: number | null
    dob: any | null
  }
  export type CountryData = {
    id: number | null
    name: string
    iso_code: string
  }
}
