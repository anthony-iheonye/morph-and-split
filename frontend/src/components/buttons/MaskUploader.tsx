import { Button, Input, Spinner, useBreakpointValue } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { BackendResponse, SignedUploadUrls } from "../../entities";
import { useBackendResponse, useFileUploader } from "../../hooks";
import { APIClient } from "../../services";
import { bucketFolders } from "../../store";
import { useEffect } from "react";
import invalidateQueries from "../../services/invalidateQueries";

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
          try {
            // transfer uploaded images from GCS to backend
            const maskTransferred = await maskTransferClient.processFiles();
            console.log(`download response:`, maskTransferred);

            if (maskTransferred.success) {
              // produce resized version of uploaded masks
              const resized = await resizeClient.processFiles();
              if (resized) {
                invalidateQueries(queryClient, [
                  "maskNames",
                  "metadata",
                  "maskUploadStatus",
                ]);
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

  useEffect(() => {
    setBackendResponseLog("maskIsUploading", isUploading);
  }, [isUploading]);

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
