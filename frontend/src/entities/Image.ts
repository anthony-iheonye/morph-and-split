export default interface Image {
  id: number | string;
  name: string;
  extension: "jpg" | "png" | "jpeg";
  url: string;
}
