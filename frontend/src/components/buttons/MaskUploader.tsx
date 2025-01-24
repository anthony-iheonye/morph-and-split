import {
  Button,
  Input,
  Spinner,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { BackendResponse, CustomError, SignedUploadUrls } from "../../entities";
import { useBackendResponse, useFileUploader } from "../../hooks";
import { APIClient } from "../../services";
import invalidateQueries from "../../services/invalidateQueries";
import { bucketFolders } from "../../store";

const MaskUploader = () => {
  const uploadClient = new APIClient<SignedUploadUrls>(
    "/generate-signed-upload-url"
  );

  const maskTransferClient = new APIClient<BackendResponse>(
    "/gcs/transfer_masks_to_backend"
  );

  const resizeClient = new APIClient<BackendResponse>("/resize-uploaded-masks");

  const buttonText = useBreakpointValue({
    base: "Select",
    md: "Select Masks",
  });

  const { setBackendResponseLog } = useBackendResponse();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { isUploading, handleFileChange } = useFileUploader<File>(
    async (files) => {
      try {
        // Trigger the upload process
        const uploaded = await uploadClient.uploadToGoogleCloudBucket(
          files,
          bucketFolders.masks
        );

        if (!uploaded.success) {
          throw new CustomError(
            "Upload Failed",
            "Failed to upload masks to Google Cloud."
          );
        }

        const masksTransfered = await maskTransferClient.postData();
        if (!masksTransfered.success) {
          throw new CustomError(
            "Transfer Failed",
            "Failed to transfer masks to the backend"
          );
        }

        const resized = await resizeClient.postData();
        if (!resized.success) {
          throw new CustomError(
            "Resize Failed",
            "Failed to resize uploaded masks."
          );
        } else {
          // Invalidate uploaded image names, uploaded image and mask metadata, and image upload status.
          invalidateQueries(queryClient, [
            "maskNames",
            "metadata",
            "maskUploadStatus",
            "imageMaskBalanceStatus",
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

  const resetInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value = ""; // Reset the file input's value so the previous file can be reuploaded, if we choose to.
  };

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
        onChange={(event) => {
          handleFileChange(event);
          resetInput(event);
        }}
      />
    </Button>
  );
};

export default MaskUploader;
