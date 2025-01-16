import { Button, Input, Spinner, useBreakpointValue } from "@chakra-ui/react";
import { BackendResponse, SignedUploadUrls } from "../../entities";
import { useFileUploader } from "../../hooks";
import { APIClient } from "../../services";
import invalidateQueries from "../../services/invalidateQueries";
import { bucketFolders } from "../../store";

const ImageUploader = () => {
  const uploadClient = new APIClient<SignedUploadUrls>(
    "/generate-signed-upload-url"
  );
  const imageTransferClient = new APIClient<BackendResponse>(
    "/transfer_images_to_backend"
  );
  const resizeClient = new APIClient<BackendResponse>(
    "/resize-uploaded-images"
  );

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
          try {
            const imagesTransfered = await imageTransferClient.processFiles();
            console.log(`download response:`, imagesTransfered);

            if (imagesTransfered.success) {
              // produce resized version of uploaded images
              const resized = await resizeClient.processFiles();

              if (resized) {
                // Invalidate the 'image_names' query to refresh the updated list, and 'metadata' query to refresh the  image and mask preview grid
                invalidateQueries([
                  "imageNames",
                  "metadata",
                  "imageUploadStatus",
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
