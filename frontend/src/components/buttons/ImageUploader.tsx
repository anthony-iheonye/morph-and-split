import { Button, Input, useBreakpointValue } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useBackendResponse, useFileUploader } from "../../hooks";
import APIClient from "../../services/api-client";
import bucketFolders from "../../store/googleCloudStore";
import SignedUploadUrls from "../../entities/SignedUploadUrls";

const ImageUploader = () => {
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
          bucketFolders.images
        );

        if (response.success) {
          setBackendResponseLog("augmentationIsComplete", false);
          // Invalidate the 'image_names' query to refresh the updated list
          queryClient.invalidateQueries(["image_names"]);
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
      width="auto"
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

export default ImageUploader;
