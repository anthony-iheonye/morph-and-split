import { Button, Input, Spinner, useBreakpointValue } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { BackendResponse, SignedUploadUrls } from "../../entities";
import { useBackendResponse, useFileUploader } from "../../hooks";
import { APIClient } from "../../services";
import { bucketFolders } from "../../store";

const MaskUploader = () => {
  const queryClient = useQueryClient();
  const uploadClient = new APIClient<SignedUploadUrls>(
    "/generate-signed-upload-url"
  );

  const maskTransferClient = new APIClient<BackendResponse>(
    "/transfer_masks_to_backend"
  );

  const resizeClient = new APIClient<BackendResponse>("/resize-uploaded-masks");

  const { setBackendResponseLog } = useBackendResponse();

  const buttonText = useBreakpointValue({
    base: "Select",
    md: "Select Masks",
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

          // transfer uploaded images from GCS to backend
          try {
            const maskTransferred = await maskTransferClient.processFiles();
            console.log(`download response:`, maskTransferred);

            if (maskTransferred.success) {
              // produce resized version of uploaded masks
              const resized = await resizeClient.processFiles();
              if (resized) {
                // Invalidate the 'image_names' query to refresh the updated list
                queryClient.invalidateQueries(["mask_names"]);
                // invaliate the 'metadata' query to refresh the  image and mask preview grid
                queryClient.invalidateQueries(["metadata"]);
                // invalidate the
              }
            }
          } catch (error) {
            console.error(`Error `);
          }
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
      leftIcon={isUploading ? <Spinner size="md" color="white" /> : undefined}
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
