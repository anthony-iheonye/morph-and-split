import axios, { AxiosRequestConfig } from "axios";
import BackendResponse from "../entities/BackendResponse";
import SignedUploadUrls from "../entities/SignedUploadUrls";

export interface FetchResponse<T> {
  success?: Boolean;
  count: number;
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

  uploadFiles = (data: FormData, requestConfig?: AxiosRequestConfig) =>
    axiosInstance
      .post<T>(this.endpoint, data, requestConfig)
      .then((res) => res.data);

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
    // send get request download file from server
    const response = await axiosInstance.get(
      `${this.endpoint}/${encodeURIComponent(filename)}`,
      { responseType: "blob", ...requestConfig }
    );

    // handle file download
    if (response) {
      // wrap the file content in a Blob, so it is treated as a downloadable file
      const blob = new Blob([response.data]);
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
    } else {
      console.error("Failed to dowload file.");
    }
  };

  getAll = (requestConfig?: AxiosRequestConfig) =>
    axiosInstance
      .get<FetchResponse<T>>(this.endpoint, requestConfig)
      .then((res) => res.data);

  resetSession = (
    requestConfig?: AxiosRequestConfig
  ): Promise<BackendResponse> =>
    axiosInstance
      .post<BackendResponse>(this.endpoint, requestConfig)
      .then((res) => res.data)
      .catch((err) => {
        console.error("Error resetting session: ", err.messsage);
        return { success: false, error: err.message };
      });

  resizeImagesMasks = (
    requestConfig?: AxiosRequestConfig
  ): Promise<BackendResponse> =>
    axiosInstance
      .post<BackendResponse>(this.endpoint, requestConfig)
      .then((res) => res.data)
      .catch((err) => {
        console.error("Error resetting data: ", err.messsage);
        return { success: false, error: err.messsage };
      });

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
  ): Promise<{ success: boolean }> => {
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

      // upload files using signed URLs
      const uploadPromises = files.map(async (file) => {
        const signedUrl = signedUrlsObjs.find(
          (urlObj) => urlObj.filename === file.name
        )?.url;

        if (!signedUrl) {
          console.warn(`No Signed URL found for file ${file.name}`);
          return; // Skip this file if no signed URL is found
        }

        try {
          // Upload file to Google Cloud Storage using the signed URL.
          const response = await axios.put(signedUrl, file, {
            headers: {
              "Content-Type": file.type || "application/octet-stream",
            },
          });
          console.log(`Upload successful for ${file.name}`, response.data);
        } catch (error) {
          if (error instanceof Error)
            console.error(`Error uploading file ${file.name}: `, error.message);
        }
      });

      // Wait for all the upload to complete
      await Promise.all(uploadPromises);

      console.log("All files uploaded succesfully!");
      return { success: true };
    } catch (error) {
      if (error instanceof Error)
        console.error(
          "Error upoloading files to Google Cloud Bucket",
          error.message
        );
      throw error;
    }
  };
}

export default APIClient;
