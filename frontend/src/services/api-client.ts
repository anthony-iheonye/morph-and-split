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

  fetchAugmentResults = (
    id: string | number,
    requestConfig?: AxiosRequestConfig
  ) =>
    axiosInstance
      .get<T>(`${this.endpoint}/${id}`, requestConfig)
      .then((res) => res.data);
}

export default APIClient;
