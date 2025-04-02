export interface Metadata {
  name: string;
  url: string;
}

export default interface UploadedImageMask {
  image: Metadata;
  mask: Metadata;
}
