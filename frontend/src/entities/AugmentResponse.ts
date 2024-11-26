interface AugmentedData {
  filename: string;
  path: string;
  data: BinaryData;
}

export default interface AugmentResponse {
  images: AugmentedData[];
  masks: AugmentedData[];
  config: string[];
}
