export default interface ILoginResponse {
  user: {
    id: string;
    username: string;
    email: string;
    profilePicKey: string | null;
    role: string;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}
