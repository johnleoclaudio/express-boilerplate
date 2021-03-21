export default interface Otp {
  id: number;
  otp: string;
  otpExpiresAt: Date;
  ownerType: string;
  ownerId: number;
  transactionType: string;
  verifiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
