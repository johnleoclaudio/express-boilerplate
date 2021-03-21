export default interface ClientKey {
  ownerId: number;
  unqiueIdentifier: string;
  logo: string;
  clientId: string;
  secretKey: string;
  description?: string;
  redirectUrls: any; // JSON
}
