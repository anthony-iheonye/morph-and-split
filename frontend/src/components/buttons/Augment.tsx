import { useToast, Button } from "@chakra-ui/react";
import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import BackendResponse from "../../entities/BackendResponse";
import { useBackendResponse } from "../../hooks";
import APIClient from "../../services/api-client";
import { useAugConfigStore } from "../../store";
import { BoundingBox } from "../display";
import IconHeadingDescriptionCombo from "../IconHeadingDescriptionCombo";
import DownloadButton from "./DownloadButton";

const Augment = () => {
  const AugmentationAPI = new APIClient<BackendResponse>("/augment");
  const DownloadAPI = new APIClient<Blob>("/download");

  const { augConfig } = useAugConfigStore();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const { augmentationIsComplete, setBackendResponseLog } =
    useBackendResponse();

  const handleAugment = async () => {
    setIsLoading(true);
    setBackendResponseLog("augmentationIsComplete", false);

    // Prepare FormData
    const formData = new FormData();
    if (augConfig.visualAttributesJSONFile?.file)
      formData.append(
        "visualAttributesJSONFile",
        augConfig.visualAttributesJSONFile.file
      );
    // Exclude visual attribute file from config and add reduced config
    const { visualAttributesJSONFile, ...reducedConfig } = augConfig; // Destruture to exclude
    formData.append("config", JSON.stringify(reducedConfig)); // Add only the reduced

    try {
      const response = await AugmentationAPI.uploadFiles(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setBackendResponseLog("augmentationIsComplete", response.success);

      if (response.success) {
        toast({
          title: "Augmentation completed!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error during augmentation:", error);
      toast({
        title: "Failed to complete augmentation.",
        description: "An unknown error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Start Augmentation */}
      <BoundingBox
        maxWidth={"fit-content"}
        justify={"center"}
        padding={1}
        borderRadius={8}
      >
        <Button
          type="submit"
          height="auto"
          padding="4"
          justifySelf="center"
          _hover={{ bg: "teal" }}
          onClick={handleAugment}
          disabled={isLoading}
        >
          <IconHeadingDescriptionCombo
            icon={FaPlay}
            fontSize={25}
            title={isLoading ? "Processing" : "Augment Data"}
            description={
              isLoading
                ? "Images and Masks are augmenting."
                : "Augment the selected images and masks."
            }
          />
        </Button>
      </BoundingBox>

      {augmentationIsComplete && (
        <BoundingBox justify={"center"} transparent={true}>
          <DownloadButton
            filename="augmented_data.zip"
            label="Download augmented data"
            onDownload={DownloadAPI.downloadFile}
          />
        </BoundingBox>
      )}
    </>
  );
};

export default Augment;
