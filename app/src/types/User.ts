export interface Address {
  street: string;
  city: string;
  zipCode: string;
}

export interface Profile {
  name: string;
  email: string;
  address: Address;
}

export interface Notifications {
  email: boolean;
  push: boolean;
}

export type Theme = "light" | "dark";

export interface Settings {
  theme: Theme;
  notifications: Notifications;
}

export interface User {
  id: number;
  username: string;
  profile: Profile;
  settings: Settings;
  roles: string[];
}
