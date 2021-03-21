export default interface Admin {
  id: number;
  username: string;
  password: string;
  type: string;
  role: string;
  twoFaSecret: string | null;
  twoFaVerified: boolean;
  accessLevel: number;
  loginRetry: number;
  blockLogin: boolean;
  passwordUpdatedAt: Date;
  lastLoginAt: Date;
}
