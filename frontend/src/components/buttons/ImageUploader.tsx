import {
  Button,
  Input,
  Spinner,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { BackendResponse, CustomError, SignedUrls } from "../../entities";
import {
  useBackendResponse,
  useButtonThemedColor,
  useFileUploader,
} from "../../hooks";
import { APIClient } from "../../services";
import invalidateQueries from "../../services/invalidateQueries";
import { bucketFolders } from "../../store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const ImageUploader = () => {
  const uploadClient = new APIClient<SignedUrls>("/generate-signed-upload-url");

  const imageTransferClient = new APIClient<BackendResponse>(
    "/gcs/transfer_images_to_backend"
  );

  const resizeClient = new APIClient<BackendResponse>(
    "/resize-uploaded-images"
  );

  const resizedImageTransferClient = new APIClient<BackendResponse>(
    "/gcs/transfer_resized_original_images_to_gcs"
  );

  const deleteStratificationFileClient = new APIClient(
    "/stratification_data_file/delete"
  );

  const buttonText = useBreakpointValue({
    base: "Select",
    md: "Select Images",
  });

  const {
    backgroundColor,
    borderColor,
    hoverBorder,
    textColor,
    hoverBackgroundColor,
  } = useButtonThemedColor();

  const { setBackendResponseLog } = useBackendResponse();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { isUploading, handleFileChange } = useFileUploader<File>(
    async (files) => {
      try {
        // Trigger the upload process
        const uploaded = await uploadClient.uploadToGoogleCloudBucket(
          files,
          bucketFolders.images
        );

        if (!uploaded.success) {
          throw new CustomError(
            "Upload Failed",
            "Failed to upload images to Google Cloud."
          );
        }

        const imagesTransfered = await imageTransferClient.postData();
        if (!imagesTransfered.success) {
          throw new CustomError(
            "Transfer Failed",
            "Failed to transfer images to the backend"
          );
        }

        const resized = await resizeClient.postData();
        if (!resized.success) {
          throw new CustomError(
            "Resize Failed",
            "Failed to resize uploaded images."
          );
        }

        const resizedImagesTransfered =
          await resizedImageTransferClient.postData();
        if (!resizedImagesTransfered.success) {
          throw new CustomError(
            "Resized Image Transfer Failed.",
            "Failed to transfer resized images."
          );
        }

        // Delete stratification data file from backend storage
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
          // Invalidate uploaded image names, uploaded image and mask metadata, and image upload status.
          invalidateQueries(queryClient, [
            "imageNames",
            "metadata",
            "imageUploadStatus",
            "imageMaskBalanceStatus",
            "stratificationFileName",
            "strafied_split_parameters",
          ]);
        }
      } catch (error: any) {
        toast({
          title: error.title || "Unexpected Error",
          description: error.message || "An unexpected error occurred.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    toast
  );

  const resetInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value = ""; // Reset the file input's value so the previous file can be reuploaded, if we choose to.
  };

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
      borderRadius={10}
      leftIcon={isUploading ? <Spinner size="md" color="white" /> : undefined}
      bg={backgroundColor}
      border={`1px solid ${borderColor}`}
      color={textColor}
      transition="background-color 0.2s ease-in-out, border-color 0.2s ease-in-out" //Smooth transitions
      _hover={{
        border: `2px solid ${hoverBorder}`,
        boxShadow: `0 0 0 2px ${hoverBorder}`,
        bg: hoverBackgroundColor,
      }}
      size="md"
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

export default ImageUploader;
