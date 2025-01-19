import { Button, Spinner, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { TbTransform } from "react-icons/tb";
import { BackendResponse } from "../../entities";
import { APIClient } from "../../services";
import { useAugConfigStore } from "../../store";
import invalidateQueries from "../../services/invalidateQueries";
import { useQueryClient } from "@tanstack/react-query";

const Augment = () => {
  const AugmentationAPI = new APIClient<BackendResponse>("/augment");

  const { augConfig } = useAugConfigStore();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const queryClient = useQueryClient();

  const handleAugment = async () => {
    setIsLoading(true);

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
      const response = await AugmentationAPI.postData(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.success) {
        toast({
          title: "Augmentation completed!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        invalidateQueries(queryClient, ["augmentationIsComplete"]);
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
      <Button
        type="submit"
        colorScheme="teal"
        size="sm"
        borderRadius={20}
        justifySelf="center"
        _hover={{ bg: "teal" }}
        onClick={handleAugment}
        disabled={isLoading}
        leftIcon={
          isLoading ? <Spinner size="md" color="white" /> : <TbTransform />
        }
      >
        {isLoading ? "Processing" : "Augment Data"}
      </Button>
    </>
  );
};

export default Augment;
