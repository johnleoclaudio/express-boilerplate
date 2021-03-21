export default interface AdminManageRequest {
  id: number;
  scope: string;
  type: string;
  details: any;
  requestedAt: Date;
  requestedBy: number;
  requestReason: string;
  approvedAt: Date;
  approvedBy: number;
  approvalComment: string;
  rejectedAt: Date;
  rejectedBy: number;
  rejectionComment: string;
  createdAt: Date;
  updatedAt: Date;
}
