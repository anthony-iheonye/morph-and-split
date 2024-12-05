import { Button, Input } from "@chakra-ui/react";
import useFileUploader from "../hooks/useFileUploader";
import APIClient from "../services/api-client";
import { useQueryClient } from "@tanstack/react-query";

const ImageUploader = () => {
  const queryClient = useQueryClient();
  const uploadClient = new APIClient<string[]>("/upload/images");

  const { error, isUploading, handleFileChange } = useFileUploader<File>(
    async (files) => {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      try {
        await uploadClient.uploadFiles(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Invalidate the 'image_names' query to refresh the updated list
        queryClient.invalidateQueries(["image_names"]);
      } catch (err) {
        console.log("Upload failed: ", err);
      }
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
