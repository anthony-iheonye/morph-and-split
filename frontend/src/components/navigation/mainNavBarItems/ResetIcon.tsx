import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  IconButton,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { VscDebugRestart } from "react-icons/vsc";
import { useAugConfigAndSetter, useNavIconColor } from "../../../hooks";
import { APIClient } from "../../../services";
import invalidateQueries from "../../../services/invalidateQueries";

const ResetIcon = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { augConfig, setAugConfig, resetAugConfig } = useAugConfigAndSetter();

  const toast = useToast();
  const backgroundColor = useNavIconColor();
  // Query client for reseting queries
  const queryClient = useQueryClient();

  const cancelRef = useRef<HTMLButtonElement>(null);

  // Create API client for resetting session
  const resetClient = new APIClient("/reset_session");

  const handleReset = async (key: keyof typeof augConfig) => {
    try {
      // Call reset API
      const response = await resetClient.executeAction();

      if (response.success) {
        toast({
          title: "Session reset successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Reset local configurations
        resetAugConfig();
        setAugConfig(key, !augConfig[key]);

        // Reset queries.
        invalidateQueries(queryClient, [
          "imageNames",
          "maskNames",
          "metadata",
          "trainingSet",
          "validationSet",
          "testingSet",
        ]);
      } else {
        throw new Error(response.error || "Unknown error");
      }
    } catch (error) {
      toast({
        title: "Failed to reset session",
        description: "An unknown error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const confirmReset = () => {
    handleReset("reset");
    onClose();
  };

  return (
    <>
      <Box width="auto" alignSelf="center">
        <Tooltip label="Reset Session" placement="top-start">
          <IconButton
            aria-label="Upload Image and segmentation mask"
            icon={<VscDebugRestart />}
            variant="ghost"
            size="lg"
            fontSize="1.5rem"
            colorScheme={backgroundColor}
            onClick={onOpen}
          />
        </Tooltip>
      </Box>

      {/* Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        motionPreset="slideInTop"
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Reset
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to reset the session? All settings will
              revert to their defaults, and any uploaded images and masks will
              be permanently deleted. This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmReset} ml={3}>
                Reset
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ResetIcon;
