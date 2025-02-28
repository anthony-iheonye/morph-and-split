export default interface BackendResponse {
  success: boolean;
  isRunning?: boolean;
  count?: number;
  error?: string;
  message?: string;
  results?: string[] | null;
}
