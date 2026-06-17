export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
}

export interface UserRegister {
  username: string;
  email: string;
  password: string;
}
