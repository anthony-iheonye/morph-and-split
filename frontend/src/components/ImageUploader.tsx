import { Button, Input } from "@chakra-ui/react";
import useFileUploader from "../hooks/useFileUploader";
import APIClient from "../services/api-client";

const ImageUploader = () => {
  const uploadClient = new APIClient("/upload_images");

  const { error, isUploading, handleFileChange } = useFileUploader<File>(
    async (files) => {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      await uploadClient.uploadFiles(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
  );

  return (
    <Button
      as="label"
      variant="outline"
      cursor="pointer"
      isDisabled={isUploading}
    >
      {isUploading ? "Uploading" : "Select Images"}
      <Input
        type="file"
        multiple
        variant="outline"
        padding="0"
        display="None"
        accept=".png, .jpeg, .jpg"
        onChange={handleFileChange}
      />
    </Button>
  );
};

export default ImageUploader;
