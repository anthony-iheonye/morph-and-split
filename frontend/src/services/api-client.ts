import axios, { AxiosRequestConfig } from "axios";
import { BackendResponse, SignedUploadUrls } from "../entities";

export interface FetchResponse<T> {
  success?: Boolean;
  count: number;
  next: string | null;

  results: T[];
}

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5000", // Local backend base URL
  // baseURL: "https://morph-and-split-backend-1055861427938.us-south1.run.app", // Google cloud run backend base URL
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

  downloadFile = async (
    filename: string,
    requestConfig?: AxiosRequestConfig
  ) => {
    try {
      // send get request download file from server
      const response = await axiosInstance.get(
        `${this.endpoint}/${encodeURIComponent(filename)}`,
        { responseType: "blob", ...requestConfig }
      );
      this.handleDownload(response.data, filename);
    } catch (error: any) {
      console.error("Failed to download file: ", error.message);
    }
  };

  handleDownload = (data: Blob, filename: string) => {
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

  uploadToGoogleCloudBucket = async (
    files: File[],
    folder_path: string = ""
  ): Promise<{ success: boolean; failedFiles: string[] }> => {
    const filenames = files.map((file) => file.name);
    const contentTypes = files.map((file) => file.type);

    try {
      // step 1: Get signed URLs
      const { results: signedUrlsObjs } =
        await this.getSignedUploadUrls<SignedUploadUrls>(
          filenames,
          contentTypes,
          folder_path
        );

      // upload files using signed URLs in parallel
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
}

export default APIClient;
