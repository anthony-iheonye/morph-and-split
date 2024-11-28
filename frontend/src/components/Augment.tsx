import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { FaPlay } from "react-icons/fa6";
import APIClient from "../services/api-client";
import useAugConfigStore from "../store/augConfigStore";
import useAugResponseStore, {
  AugmentedResponse,
} from "../store/augResponseStore";
import BoundingBox from "./BoundingBox";
import DownloadButton from "./DownloadButton";
import IconHeadingDescriptionCombo from "./IconHeadingDescriptionCombo";

const Augment = () => {
  const AugmentationAPI = new APIClient<AugmentedResponse>("/augment");
  const DownloadAPI = new APIClient<Blob>("/download");

  const { augConfig } = useAugConfigStore();
  const [isLoading, setIsLoading] = useState(false);

  const { augmentedResponse, setAugmentedResponse } = useAugResponseStore(
    (store) => ({
      setAugmentedResponse: store.setAugmentedResponse,
      augmentedResponse: store.augmentedResponse,
    })
  );

  const handleAugment = async () => {
    setIsLoading(true);

    // Prepare FormData
    const formData = new FormData();
    augConfig.images?.forEach((image) => {
      formData.append("images", image.file);
    });
    augConfig.masks?.forEach((mask) => {
      formData.append("masks", mask.file);
    });

    // Exclude images and masks form config and add reduced config
    const { images, masks, ...reducedConfig } = augConfig; // Destruture to exclude
    formData.append("config", JSON.stringify(reducedConfig)); // Add only the reduced

    try {
      const response = await AugmentationAPI.uploadFiles(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAugmentedResponse(response);
    } catch (error) {
      console.error("Error during augmentation:", error);
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
        padding={3}
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
            fontSize={30}
            title={isLoading ? "Processing" : "Augment Images"}
            description={
              isLoading
                ? "Images and Masks are augmenting."
                : "Augment the selected images and segmentation masks."
            }
          />
        </Button>
      </BoundingBox>

      {augmentedResponse && (
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
