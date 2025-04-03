import { Button, Spinner, useToast } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { TbTransform } from "react-icons/tb";
import { useBackendResponse } from "../../hooks";
import { handleAugment } from "../../services";
import { useAugConfigStore } from "../../store";

/**
 * The Augment component handles the process of augmenting data. It includes a button
 * that users can click to initiate the augmentation process. The button displays a
 * loading spinner and updates text to reflect the current state.
 *
 * When clicked, the button triggers the augmentation process, and once completed,
 * the user receives feedback through a toast message. The button is disabled while
 * the augmentation is running to prevent multiple submissions.
 */
const Augment = () => {
  const { augConfig } = useAugConfigStore(); // Holds the current augmentation configuration
  const [, setIsLoading] = useState(false); // State to track if augmentation is in progress
  const toast = useToast();
  const queryClient = useQueryClient();
  const { augmentationIsRunning, setBackendResponseLog } = useBackendResponse();

  return (
    <Button
      type="submit"
      colorScheme="teal"
      size="sm"
      borderRadius={20}
      justifySelf="center"
      _hover={{ bg: "teal" }}
      onClick={() =>
        handleAugment({
          queryClient, // Used to invalidate relevant queries after augmentation
          augConfig, // Configuration details for the augmentation process
          setBackendResponseLog, // To set the log states for backend response
          setIsLoading, // Sets loading state to true while the process is running
          toast, // Displays toast notifications to inform the user of progress
        })
      }
      disabled={augmentationIsRunning} // Disables the button when augmentation is running
      leftIcon={
        augmentationIsRunning ? ( // Shows a spinner while the process is ongoing
          <Spinner size="md" color="black" />
        ) : (
          <TbTransform />
        )
      }
    >
      {augmentationIsRunning ? "Processing" : "Augment Data"}{" "}
      {/* Button text changes based on state */}
    </Button>
  );
};

export default Augment;
