export default interface Otp {
  id: number;
  otp: string;
  otpExpiresAt: Date;
  ownerType: string;
  ownerId: number;
  deviceId: string;
  verifiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
