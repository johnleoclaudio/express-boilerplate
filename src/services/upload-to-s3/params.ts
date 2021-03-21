export default interface IParams {
  userType: string; // bond user
  dataType: string; // kyc
  category: string; // proofOfIncome, proofOfResidence
  data: any; // base64
  fileName: string; // file, tin/file, passport/file, bill/file
  overwrite: boolean;
  secureId: string;
}
