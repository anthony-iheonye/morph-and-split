import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { FaPlay } from "react-icons/fa6";
import AugmentResponse from "../entities/AugmentResponse";
import APIClient from "../services/api-client";
import useAugConfigStore from "../store/augConfigStore";
import BoundingBox from "./BoundingBox";
import IconHeadingDescriptionCombo from "./IconHeadingDescriptionCombo";
import useAugResponseStore from "../store/augResponseStore";

const Augment = () => {
  const AugmentationAPI = new APIClient<AugmentResponse>("/augment");

  const [isLoading, setIsLoading] = useState(false);
  const { augmentedResponse, setAugmentedResponse } = useAugResponseStore();
  const { augConfig } = useAugConfigStore();

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

      <BoundingBox>
        {augmentedResponse && (
          <div>
            <h3>Augmented Images</h3>
            <ul>
              {augmentedResponse.images?.map((img, idx) => (
                <li key={idx}>
                  <img
                    src={`data:image/${img.filename.split(".").pop()};base64,${
                      img.data
                    }`}
                    alt={`Augmented Image ${idx + 1}`}
                    style={{
                      maxWidth: "300px",
                      display: "block",
                      margin: "10px 0",
                    }}
                  />
                  <a
                    href={`http://127.0.0.1:5000/${img.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {img.filename}
                  </a>
                </li>
              ))}
            </ul>
            <h3>Augmented Masks</h3>
            <ul>
              {augmentedResponse.masks?.map((mask, idx) => (
                <li key={idx}>
                  <img
                    src={`data:image/${mask.filename.split(".").pop()};base64,${
                      mask.data
                    }`}
                    alt={`Augmented Mask ${idx + 1}`}
                    style={{
                      maxWidth: "300px",
                      display: "block",
                      margin: "10px 0",
                    }}
                  />
                  <a
                    href={`http://127.0.0.1:5000/${mask.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {mask.filename}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </BoundingBox>
    </>
  );
};

export default Augment;
