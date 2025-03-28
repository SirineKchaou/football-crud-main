export interface User {
  id?: number;
  email: string;
  roles: string[];
  password?: string;
  username?: string | null;
}
