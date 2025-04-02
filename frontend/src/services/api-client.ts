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

export const baseURL = "http://127.0.0.1:5000"; // Local backend base URL

// export const baseURL =
//   "https://morph-and-split-backend-470140954383.us-south1.run.app"; // Google cloud run backend base URL

// export const baseURL =
//   "https://morph-and-split-backend-533716684084.us-south1.run.app"; // Google cloud run backend base URL

const axiosInstance = axios.create({
  baseURL: baseURL,
});

// Interceptor to inject sessionId into all requests
axiosInstance.interceptors.request.use((config) => {
  const sessionId = getSessionId();

  if (!config.params) {
    config.params = {};
  }
  config.params.sessionId = sessionId;
  return config;
});

class APIClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  executeAction = async (
    data?: Object,
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
      if (axios.isAxiosError(error))
        return { success: false, error: error.message };
      else return { success: false, error: "An unexpected error occured." };
    }
  };

  fetchAugmentedResults = (
    id: string | number,
    requestConfig?: AxiosRequestConfig
  ) =>
    axiosInstance
      .get<T>(`${this.endpoint}/${id}`, requestConfig)
      .then((res) => res.data);

  downloadLocalFiles = async (
    filenames: string[],
    requestConfig?: AxiosRequestConfig
  ) => {
    try {
      // Create an array of promises for parallel execution
      const downloadPromises = filenames.map(async (filename) => {
        const response = await axiosInstance.get(
          `${this.endpoint}/${encodeURIComponent(filename)}`,
          { responseType: "blob", ...requestConfig }
        );
        console.log(`Downloaded: ${filename}`);
        this.handleDownloadBlob(response.data, filename);
      });

      // Wait for all downloads to finish
      await Promise.all(downloadPromises);
      console.log("All files downloaded successfully!");
    } catch (error: any) {
      console.error("Failed to download files: ", error.message);
    }
  };
  handleDownloadBlob = (data: Blob, filename: string) => {
    const blob = new Blob([data]);
    // create temporary url pointing to the blob
    const url = window.URL.createObjectURL(blob);
    // Create a link element
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  handleError = (error: any) => {
    if (axios.isAxiosError(error)) {
      console.error("Axios error: ", error.message);
      return { success: false, error: error.message };
    } else {
      console.error("Unexpected error: ", error);
      return { success: false, error: "An unexpected error occurred." };
    }
  };

  getAll = (requestConfig?: AxiosRequestConfig) =>
    axiosInstance
      .get<FetchResponse<T>>(this.endpoint, requestConfig)
      .then((res) => res.data);

  getStatus = (requestConfig?: AxiosRequestConfig) =>
    axiosInstance
      .get<BackendResponse>(this.endpoint, requestConfig)
      .then((res) => res.data);

  getSignedUploadUrls = async <U = T>(
    filenames: string[],
    contentTypes: string[],
    folder_path: string = "",
    requestConfig?: AxiosRequestConfig
  ): Promise<FetchResponse<U>> => {
    try {
      const response = await axiosInstance.post<FetchResponse<U>>(
        this.endpoint,
        { filenames, folder_path: folder_path, content_types: contentTypes },
        requestConfig
      );
      return response.data;
    } catch (err) {
      if (err instanceof Error)
        console.error("Error fetching signed upload URLs. ", err.message);
      throw err;
    }
  };

  /**
   * Fetch signed download URLs for given filenames.
   * @param filename Name of file to get signed URL for.
   * @param requestConfig Optional request configurations.
   * @returns Signed URL for downloading file from GCS.
   */
  getSignedDownloadUrls = async (
    filenames: string[]
  ): Promise<SignedUrls[]> => {
    try {
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
    } catch (err) {
      if (err instanceof Error)
        console.error("Error fetching signed download URLs. ", err.message);
      throw err;
    }
  };

  uploadToGoogleCloudBucket = async (
    files: File[],
    folder_path: string = ""
  ): Promise<{ success: boolean; failedFiles: string[] }> => {
    const filenames = files.map((file) => file.name);
    const contentTypes = files.map((file) => file.type);

    try {
      // step 1: Get signed URLs
      const { results: signedUrlsObjs } =
        await this.getSignedUploadUrls<SignedUrls>(
          filenames,
          contentTypes,
          folder_path
        );

      // upload files in parallel using signed URLs
      const failedFiles: string[] = [];

      const uploadPromises = files.map(async (file) => {
        const signedUrl = signedUrlsObjs.find(
          (urlObj) => urlObj.filename === file.name
        )?.url;

        if (!signedUrl) {
          console.warn(`No Signed URL found for file ${file.name}`);
          failedFiles.push(file.name); // record missing url
          return; // Skip this file if no signed URL is found
        }

        try {
          // Upload file to Google Cloud Storage using the signed URL.
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

      // Wait for all the upload to complete
      await Promise.all(uploadPromises);

      console.log("All files uploaded succesfully!");
      return { success: failedFiles.length === 0, failedFiles };
    } catch (error) {
      if (axios.isAxiosError(error))
        console.error(
          "Error upoloading files to Google Cloud Bucket",
          error.message
        );
      throw error;
    }
  };

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

        // Fetch the file from the signed URL
        const response = await fetch(fileObj.url);
        if (!response.ok)
          throw new Error(`Failed to fetch file: ${fileObj.filename}`);

        // Convert response to Blob
        const blob = await response.blob();

        // Trigger download
        this.handleDownloadBlob(blob, fileObj.filename);
      }
    } catch (error) {
      console.error(`Failed to download file ${filenames[0]}: `, error);
    } finally {
      setBackendResponseLog("isDownloading", false);
    }
  };

  /**
   * Request to trigger backend processing.
   * @param data Optional data to be sent to the backend.
   * @param requestConfig Configuration
   * @returns
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
