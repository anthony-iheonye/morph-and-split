import axios, { AxiosRequestConfig } from "axios";
import { BackendResponse, SignedUrls } from "../entities";
import { BackendResponseLog } from "../store";
import { getSessionId } from "./session";

export interface FetchResponse<T> {
  count: number;
  next: string | null;
  results: T[];
  success?: boolean;
}

// // Uncomment to use the Local backend base URL
// export const baseURL = "http://127.0.0.1:5000";

// The deployed backend on Google Cloud Run (comment to use the local backend base URL)

export const baseURL =
  "https://morph-and-split-backend-166007833561.us-south1.run.app"; // Google cloud run backend base URL

const axiosInstance = axios.create({ baseURL: baseURL });

/**
 * Axios interceptor that automatically injects the sessionId into all outgoing requests.
 * Ensures that each client session is uniquely identified by the backend.
 */
axiosInstance.interceptors.request.use((config) => {
  const sessionId = getSessionId();
  if (!config.params) {
    config.params = {};
  }
  config.params.sessionId = sessionId;
  return config;
});

/**
 * A reusable API client class for interacting with backend endpoints using Axios.
 * Provides methods for data fetching, uploading, downloading, and error handling.
 */
class APIClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  /**
   * Generic method to send POST requests to trigger backend actions.
   */
  executeAction = async (
    data?: object,
    requestConfig?: AxiosRequestConfig
  ): Promise<BackendResponse> => {
    try {
      const response = await axiosInstance.post<BackendResponse>(
        this.endpoint,
        data || {},
        requestConfig
      );
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  };

  /**
   * Fetches a single augmented result by ID.
   */
  fetchAugmentedResults = (
    id: string | number,
    requestConfig?: AxiosRequestConfig
  ) =>
    axiosInstance
      .get<T>(`${this.endpoint}/${id}`, requestConfig)
      .then((res) => res.data);

  /**
   * Downloads multiple files in parallel from the local backend.
   */
  downloadLocalFiles = async (
    filenames: string[],
    requestConfig?: AxiosRequestConfig
  ) => {
    try {
      const downloadPromises = filenames.map(async (filename) => {
        const response = await axiosInstance.get(
          `${this.endpoint}/${encodeURIComponent(filename)}`,
          { responseType: "blob", ...requestConfig }
        );
        console.log(`Downloaded: ${filename}`);
        this.handleDownloadBlob(response.data, filename);
      });

      await Promise.all(downloadPromises);
      console.log("All files downloaded successfully!");
    } catch (error: any) {
      console.error("Failed to download files: ", error.message);
    }
  };

  /**
   * Creates a downloadable link from a Blob and triggers browser download.
   */
  handleDownloadBlob = (data: Blob, filename: string) => {
    const blob = new Blob([data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  /**
   * Standardized error handler for API responses.
   */
  handleError = (error: any): BackendResponse => {
    if (axios.isAxiosError(error)) {
      console.error("Axios error: ", error.message);
      return { success: false, error: error.message };
    } else {
      console.error("Unexpected error: ", error);
      return { success: false, error: "An unexpected error occurred." };
    }
  };

  /**
   * Fetches all resources from a paginated backend endpoint.
   */
  getAll = (requestConfig?: AxiosRequestConfig) =>
    axiosInstance
      .get<FetchResponse<T>>(this.endpoint, requestConfig)
      .then((res) => res.data);

  /**
   * Fetches a backend status response from an endpoint.
   */
  getStatus = (requestConfig?: AxiosRequestConfig) =>
    axiosInstance
      .get<BackendResponse>(this.endpoint, requestConfig)
      .then((res) => res.data);

  /**
   * Retrieves signed upload URLs for multiple files.
   */
  getSignedUploadUrls = async <U = T>(
    filenames: string[],
    contentTypes: string[],
    folder_path: string = "",
    requestConfig?: AxiosRequestConfig
  ): Promise<FetchResponse<U>> => {
    const response = await axiosInstance.post<FetchResponse<U>>(
      this.endpoint,
      { filenames, folder_path, content_types: contentTypes },
      requestConfig
    );
    return response.data;
  };

  /**
   * Retrieves signed download URLs from the backend for specified files.
   */
  getSignedDownloadUrls = async (
    filenames: string[]
  ): Promise<SignedUrls[]> => {
    const response = await axiosInstance.get<{
      success: boolean;
      results: SignedUrls[];
    }>(
      `${this.endpoint}?${filenames
        .map((f) => `filenames=${encodeURIComponent(f)}`)
        .join("&")}`
    );

    if (response.data.success) {
      return response.data.results;
    } else {
      throw new Error("Failed to get signed download URLs");
    }
  };

  /**
   * Uploads files to a Google Cloud Storage bucket using signed URLs.
   */
  uploadToGoogleCloudBucket = async (
    files: File[],
    folder_path: string = ""
  ): Promise<{ success: boolean; failedFiles: string[] }> => {
    const filenames = files.map((file) => file.name);
    const contentTypes = files.map((file) => file.type);

    try {
      const { results: signedUrlsObjs } =
        await this.getSignedUploadUrls<SignedUrls>(
          filenames,
          contentTypes,
          folder_path
        );

      const failedFiles: string[] = [];

      const uploadPromises = files.map(async (file) => {
        const signedUrl = signedUrlsObjs.find(
          (urlObj) => urlObj.filename === file.name
        )?.url;

        if (!signedUrl) {
          console.warn(`No Signed URL found for file ${file.name}`);
          failedFiles.push(file.name);
          return;
        }

        try {
          await axios.put(signedUrl, file, {
            headers: {
              "Content-Type": file.type || "application/octet-stream",
            },
          });
          console.log(`Upload successful for ${file.name}`);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error(`Error uploading file ${file.name}: `, error.message);
            failedFiles.push(file.name);
          }
        }
      });

      await Promise.all(uploadPromises);
      console.log("All files uploaded successfully!");

      return { success: failedFiles.length === 0, failedFiles };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error uploading files to Google Cloud Bucket",
          error.message
        );
      }
      throw error;
    }
  };

  /**
   * Downloads files from GCS using signed URLs and triggers client-side download.
   */
  downloadGCSFiles = async (
    filenames: string[],
    setBackendResponseLog: <K extends keyof BackendResponseLog>(
      key: K,
      value: BackendResponseLog[K]
    ) => void
  ) => {
    try {
      setBackendResponseLog("isDownloading", true);

      const signedUrls = await this.getSignedDownloadUrls(filenames);
      if (!signedUrls.length) throw new Error("No signed URLs found");

      for (const fileObj of signedUrls) {
        console.log(`Downloading from: ${fileObj.url}`);
        const response = await fetch(fileObj.url);
        if (!response.ok)
          throw new Error(`Failed to fetch file: ${fileObj.filename}`);
        const blob = await response.blob();
        this.handleDownloadBlob(blob, fileObj.filename);
      }
    } catch (error) {
      console.error(`Failed to download file ${filenames[0]}: `, error);
    } finally {
      setBackendResponseLog("isDownloading", false);
    }
  };

  /**
   * Posts data (FormData or JSON) to the endpoint.
   */
  postData = async (
    data?: FormData | object,
    requestConfig?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response = await axiosInstance.post<T>(
        this.endpoint,
        data || {},
        requestConfig
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error posting data: ", error.message);
      }
      throw error;
    }
  };

  /**
   * Sends a DELETE request to delete a file or directory from the backend.
   */
  deleteFileOrDirectory = async (
    path?: string,
    requestConfig?: AxiosRequestConfig
  ): Promise<BackendResponse> => {
    try {
      const endpoint = path
        ? `${this.endpoint}/${encodeURIComponent(path)}`
        : this.endpoint;

      const response = await axiosInstance.delete<BackendResponse>(
        endpoint,
        requestConfig
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  };
}

export default APIClient;
