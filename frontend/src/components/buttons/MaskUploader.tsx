import { Button, Input, useBreakpointValue } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import BackendResponse from "../../entities/BackendResponse";
import useBackendResponse from "../../hooks/useBackendResponse";
import useFileUploader from "../../hooks/useFileUploader";
import APIClient from "../../services/api-client";

const MaskUploader = () => {
  const queryClient = useQueryClient();
  const uploadClient = new APIClient<BackendResponse>("/upload/masks");
  const { setBackedResponseLog } = useBackendResponse();

  const { isUploading, handleFileChange } = useFileUploader<File>(
    async (files) => {
      const formData = new FormData();
      files.forEach((file) => formData.append("masks", file));

      try {
        const response = await uploadClient.uploadFiles(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.success)
          setBackedResponseLog("augmentationIsComplete", false);
        // Invalidate the 'image_names' query to refresh the updated list
        queryClient.invalidateQueries(["mask_names"]);
        // Invalidate the 'metadata' query to refresh image-mask preview
        queryClient.invalidateQueries(["metadata"]);
      } catch (err) {
        console.log("Upload failed: ", err);
      }
    }
  );

  const buttonText = useBreakpointValue({
    base: "Select",
    md: "Select Mask",
  });

  return (
    <Button
      as="label"
      variant="outline"
      cursor="pointer"
      isDisabled={isUploading}
    >
      {isUploading ? "Uploading" : buttonText}
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

export default MaskUploader;
