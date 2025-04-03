import {
  Button,
  Input,
  Spinner,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { BackendResponse, CustomError, SignedUrls } from "../../entities";
import {
  useBackendResponse,
  useButtonThemedColor,
  useFileUploader,
} from "../../hooks";
import { APIClient } from "../../services";
import invalidateQueries from "../../services/invalidateQueries";
import { bucketFolders } from "../../store";

/**
 * MaskUploader component allows users to upload mask files.
 *
 * The upload workflow involves:
 * 1. Uploading masks to Google Cloud Storage using signed URLs.
 * 2. Transferring masks to the backend.
 * 3. Resizing the uploaded masks.
 * 4. Transferring resized masks to GCS.
 * 5. Resetting signed URLs.
 * 6. Deleting stratification metadata if it exists.
 * 7. Invalidating cached queries for updated app state.
 *
 * Displays a button that indicates upload progress and supports file re-selection.
 * Shows toast notifications based on success or failure of the operation.
 */
const MaskUploader = () => {
  const uploadClient = new APIClient<SignedUrls>("/generate-signed-upload-url");
  const maskTransferClient = new APIClient<BackendResponse>(
    "/gcs/transfer_masks_to_backend"
  );
  const resizeClient = new APIClient<BackendResponse>("/resize-uploaded-masks");
  const resizedMasksTransferClient = new APIClient<BackendResponse>(
    "/gcs/transfer_resized_original_masks_to_gcs"
  );
  const signedUrlResetClient = new APIClient<BackendResponse>(
    "/reset-signed-urls-for-resized-images-and-masks"
  );
  const deleteStratificationFileClient = new APIClient(
    "/stratification_data_file/delete"
  );

  const buttonText = useBreakpointValue({
    base: "Select",
    md: "Select Masks",
  });

  const { maskIsUploading, setBackendResponseLog } = useBackendResponse();
  const queryClient = useQueryClient();
  const toast = useToast();

  const {
    backgroundColor,
    borderColor,
    hoverBorder,
    textColor,
    hoverBackgroundColor,
  } = useButtonThemedColor();

  /**
   * Handles mask file uploads and the associated upload pipeline.
   */
  const { handleFileChange } = useFileUploader<File>(
    async (files) => {
      try {
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
        }

        const resizedMasksTransfered =
          await resizedMasksTransferClient.postData();
        if (!resizedMasksTransfered.success) {
          throw new CustomError(
            "Resized Masks Transfer Failed.",
            "Faild to transfer resized masks."
          );
        }

        const signedUrlsReset = await signedUrlResetClient.executeAction();
        if (!signedUrlsReset.success) {
          throw new CustomError(
            "Reset Signed URLs",
            "Failed to reset signed urls for uploaded masks."
          );
        }

        const response =
          await deleteStratificationFileClient.deleteFileOrDirectory();
        if (!response.success) {
          toast({
            title: response.error,
            description: response.message,
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        } else {
          invalidateQueries(queryClient, [
            "maskNames",
            "metadata",
            "maskUploadStatus",
            "imageMaskBalanceStatus",
            "stratificationFileName",
            "strafied_split_parameters",
            "imageMaskDimension",
          ]);
        }

        toast({
          title: "Upload Successful",
          description: `${files.length} file(s) uploaded successfully.`,
          status: "success",
          duration: 1500,
          isClosable: true,
        });
      } catch (error: any) {
        toast({
          title: error.title || "Unexpected Error",
          description: error.message || "An unexpected error occurred.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    toast,
    setBackendResponseLog,
    "maskIsUploading"
  );

  /**
   * Resets the file input so the same file can be re-uploaded if needed.
   */
  const resetInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value = "";
  };

  return (
    <Button
      as="label"
      variant="outline"
      cursor="pointer"
      isDisabled={maskIsUploading}
      leftIcon={
        maskIsUploading ? <Spinner size="md" color="black" /> : undefined
      }
      bg={backgroundColor}
      border={`1px solid ${borderColor}`}
      borderRadius={10}
      color={textColor}
      transition="background-color 0.2s ease-in-out, border-color 0.2s ease-in-out"
      _hover={{
        border: `2px solid ${hoverBorder}`,
        boxShadow: `0 0 0 2px ${hoverBorder}`,
        bg: hoverBackgroundColor,
      }}
      size="md"
    >
      {maskIsUploading ? "Uploading" : buttonText}
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
