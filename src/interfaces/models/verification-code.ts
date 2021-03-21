export default interface VerificationCode {
  id: number;
  code: string;
  ownerType: string;
  ownerId: number;
  expiresAt: Date;
  verifiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
