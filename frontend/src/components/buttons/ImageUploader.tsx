import {
  Button,
  Input,
  Spinner,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { BackendResponse, CustomError, SignedUrls } from "../../entities";
import {
  useBackendResponse,
  useButtonThemedColor,
  useFileUploader,
} from "../../hooks";
import { APIClient } from "../../services";
import invalidateQueries from "../../services/invalidateQueries";
import { bucketFolders } from "../../store";

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

  const signedUrlResetClient = new APIClient<BackendResponse>(
    "/reset-signed-urls-for-resized-images-and-masks"
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

  const { imageIsUploading, setBackendResponseLog } = useBackendResponse();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { handleFileChange } = useFileUploader<File>(
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

        // Reset the Signed urls
        const signedUrlsReset = await signedUrlResetClient.executeAction();
        if (!signedUrlsReset.success) {
          throw new CustomError(
            "Reset Signed URLs",
            "Failed to reset signed urls for uploaded images."
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
            "imageMaskDimension",
          ]);
        }

        // Show toast if only everything above succeeded.
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
          duration: 3000,
          isClosable: true,
        });
      }
    },
    toast,
    setBackendResponseLog,
    "imageIsUploading"
  );

  const resetInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value = ""; // Reset the file input's value so the previous file can be reuploaded, if we choose to.
  };

  return (
    <Button
      as="label"
      variant="outline"
      cursor="pointer"
      isDisabled={imageIsUploading}
      width="auto"
      borderRadius={10}
      leftIcon={
        imageIsUploading ? <Spinner size="md" color="black" /> : undefined
      }
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
      {imageIsUploading ? "Uploading" : buttonText}
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
