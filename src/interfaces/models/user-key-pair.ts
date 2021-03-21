export default interface UserKeyPair {
  id: number;
  deviceId: string;
  apiSecret: string;
  apiKey: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  sessionId: number;
}
