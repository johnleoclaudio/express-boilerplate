export default interface IInfoEditRequest {
  id: number;
  ownerId: number;
  ownerType: string;
  editedCategory: string;
  editedField: string;
  editedFieldPreviousInfo: string;
  editedFieldNewInfo: string;
  editedAt: Date;
  editedBy: number;
  editReason: string;
  approvedAt: Date;
  approvedBy: number;
  approvalComment: string;
  declinedAt: Date;
  declinedBy: number;
  denialComment: string;
  details: any;
}
