import ImgDimension from "./ImgDimension";

/**
 * Represents a standard response structure returned by the backend.
 *
 * This interface accommodates flexible payloads depending on the type of request,
 * including success status, optional error messages, dimensions, and data results.
 */
export default interface BackendResponse {
  /** Indicates if the request was successful */
  success: boolean;
  /** Indicates if a backend session or service is currently running */
  isRunning?: boolean;
  /** Optional numeric result (e.g., item count) */
  count?: number;
  /** Optional short error title or code */
  error?: string;
  /** Detailed error or success message */
  message?: string;
  /** Result data from the backend, typically a string array */
  results?: string[] | null;
  /** Classifier for the error type (e.g., validation, server) */
  errorType?: string;
  /** Optional image or mask dimension metadata */
  dimension?: ImgDimension;
}
