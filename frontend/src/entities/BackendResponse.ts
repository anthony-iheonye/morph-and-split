export default interface BackendResponse {
  success: Boolean;
  count?: number;
  error?: string;
  message?: string;
}
