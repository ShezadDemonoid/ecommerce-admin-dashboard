export interface Geo {
  lat: number;
  lng: number;
}

export interface Address {
  geo: Geo;
  city: string;
  street: string;
  suite: string;
  zipcode: string;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  phone: string;
  website: string;
  address: Address;
  company: Company;
  __v: number;
}
