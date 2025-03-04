export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  userId: string;
}

export interface BirthdayMessage {
  id: string;
  clientId: string;
  sentDate: string;
  viewed: boolean;
  clicked: boolean;
  userId: string;
}