import { Button, Input, useBreakpointValue } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import BackendResponse from "../../entities/BackendResponse";
import useBackendResponse from "../../hooks/useBackendResponse";
import useFileUploader from "../../hooks/useFileUploader";
import APIClient from "../../services/api-client";
import SignedUploadUrls from "../../entities/SignedUploadUrls";
import bucketFolders from "../../store/googleCloudStore";

const MaskUploader = () => {
  const queryClient = useQueryClient();
  const uploadClient = new APIClient<SignedUploadUrls>(
    "/generate-signed-upload-url"
  );

  const { setBackendResponseLog } = useBackendResponse();

  const buttonText = useBreakpointValue({
    base: "Select",
    md: "Select Images",
  });

  const { isUploading, handleFileChange } = useFileUploader<File>(
    async (files) => {
      try {
        // Trigger the upload process
        const response = await uploadClient.uploadToGoogleCloudBucket(
          files,
          bucketFolders.masks
        );

        if (response.success) {
          setBackendResponseLog("augmentationIsComplete", false);
          // Invalidate the 'image_names' query to refresh the updated list
          queryClient.invalidateQueries(["mask_names"]);
          // invaliate the 'metadata' query to refresh the  image and mask preview grid
          queryClient.invalidateQueries(["metadata"]);
        }
      } catch (error) {
        console.error("Error uploading images to Google Cloud storage");
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
