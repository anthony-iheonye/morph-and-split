import { Button, Input } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import BackendResponse from "../entities/BackendResponse";
import useBackendResponse from "../hooks/useBackendResponse";
import useFileUploader from "../hooks/useFileUploader";
import APIClient from "../services/api-client";

const ImageUploader = () => {
  const queryClient = useQueryClient();
  const uploadClient = new APIClient<BackendResponse>("/upload/images");
  const { setBackedResponseLog } = useBackendResponse();

  const { error, isUploading, handleFileChange } = useFileUploader<File>(
    async (files) => {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      try {
        const response = await uploadClient.uploadFiles(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.success) {
          setBackedResponseLog("augmentationIsComplete", false);
          // Invalidate the 'image_names' query to refresh the updated list
          queryClient.invalidateQueries(["image_names"]);
          // invaliate the 'metadata' query to refresh the  image and mask preview grid
          queryClient.invalidateQueries(["metadata"]);
        }
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
