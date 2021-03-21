export default interface Session {
  id: number;
  accessToken: string;
  refreshToken: string;
  ownerId: number;
  ownerType: string;
  scope: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  refreshedAt: Date;
}
