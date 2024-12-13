import axios, { AxiosRequestConfig } from "axios";
import BackendResponse from "../entities/BackendResponse";

export interface FetchResponse<T> {
  count: number;
  results: T[];
}

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5000", // Backend base URL
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
        return { success: false, error: err.messsage };
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
}

export default APIClient;
