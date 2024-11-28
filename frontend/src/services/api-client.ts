import axios, { AxiosRequestConfig } from "axios";

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
      // wrap the file content in a Blob, so its treated a downloadable file
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
}

export default APIClient;
