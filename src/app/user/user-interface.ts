export interface IUser {
  id: number;
  email: string;
  username: number;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
}
