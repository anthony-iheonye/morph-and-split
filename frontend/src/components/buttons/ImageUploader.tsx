import {
  Button,
  Input,
  Spinner,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { BackendResponse, CustomError, SignedUploadUrls } from "../../entities";
import { useBackendResponse, useFileUploader } from "../../hooks";
import { APIClient } from "../../services";
import invalidateQueries from "../../services/invalidateQueries";
import { bucketFolders } from "../../store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const ImageUploader = () => {
  const uploadClient = new APIClient<SignedUploadUrls>(
    "/generate-signed-upload-url"
  );

  const imageTransferClient = new APIClient<BackendResponse>(
    "/gcs/transfer_images_to_backend"
  );

  const resizeClient = new APIClient<BackendResponse>(
    "/resize-uploaded-images"
  );

  const buttonText = useBreakpointValue({
    base: "Select",
    md: "Select Images",
  });

  const { setBackendResponseLog } = useBackendResponse();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { isUploading, handleFileChange } = useFileUploader<File>(
    async (files) => {
      try {
        // Trigger the upload process
        const response = await uploadClient.uploadToGoogleCloudBucket(
          files,
          bucketFolders.images
        );

        if (!response.success) {
          throw new CustomError(
            "Upload Failed",
            "Failed to upload images to Google Cloud."
          );
        }

        const imagesTransfered = await imageTransferClient.processFiles();
        if (!imagesTransfered.success) {
          throw new CustomError(
            "Transfer Failed",
            "Failed to transfer images to the backend"
          );
        }

        const resized = await resizeClient.processFiles();
        if (!resized.success) {
          throw new CustomError(
            "Resize Failed",
            "Failed to resize uploaded images."
          );
        } else {
          // Invalidate uploaded image names, uploaded image and mask metadata, and image upload status.
          invalidateQueries(queryClient, [
            "imageNames",
            "metadata",
            "imageUploadStatus",
          ]);
        }
      } catch (error: any) {
        toast({
          title: error.title || "Unexpected Error",
          description: error.message || "An unexpected error occurred.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  );

  useEffect(() => {
    setBackendResponseLog("imageIsUploading", isUploading);
  }, [isUploading]);

  return (
    <Button
      as="label"
      variant="outline"
      cursor="pointer"
      isDisabled={isUploading}
      width="auto"
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

export default ImageUploader;
