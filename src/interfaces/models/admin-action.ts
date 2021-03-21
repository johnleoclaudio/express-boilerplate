import Admin from './admin';

export default interface AdminAction {
  recordType: string;
  adminType: string;
  adminId: number;
  details: any;
  ownerId: number;
  ownerType: string;
  action: string;
  admin: Admin;
  createdAt: Date;
}
