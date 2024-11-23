import {
  Button,
  CircularProgress,
  CircularProgressLabel,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa6";
import { TbNumbers } from "react-icons/tb";
import BoundingBox from "../components/BoundingBox";
import IconHeadingDescriptionCombo from "../components/IconHeadingDescriptionCombo";
import PageTitle from "../components/PageTitle";
import TestStartIndex from "../components/TestStartIndex";
import TrainStartIndex from "../components/TrainStartIndex";
import ValStartIndex from "../components/ValStartIndex";

const StartAugmentation = () => {
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false); // Track if augmentation is running

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const nextProgress = prev + 1;
          if (nextProgress >= 100) {
            clearInterval(interval); // Stop when progress reaches 100
            setIsRunning(false); // Reset the running state
            return 100;
          }
          return nextProgress;
        });
      }, 200);
    }

    return () => clearInterval(interval); // Cleanup on unmount or when isRunning changes
  }, [isRunning]);

  const handleToggle = () => {
    if (isRunning) {
      setIsRunning(false); // Stop the progress
      setProgress(0); // Reset progress
    } else {
      setProgress(0); // Reset progress
      setIsRunning(true); // Start the progress
    }
  };
  return (
    <>
      <PageTitle title="Start Augmentation" />
      <BoundingBox>
        <Text color={"gray.400"} mb={4} fontSize="md">
          Enter a numerical suffix to name the augmented training, validation,
          and test sets.
        </Text>

        <VStack spacing={{ base: 5, md: 4, lg: 8 }}>
          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={TbNumbers}
              title="Training Set Initial Save Index"
              description="A number to append to the file name of first augmented training image. (eg. img-1.jpg, mask-1.jpg)"
            />
            <TrainStartIndex />
          </HStack>

          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={TbNumbers}
              title="Validation Set Initial Save Index"
              description="A number to append to the file name of first augmented training image. (eg. img-1.jpg, mask-1.jpg)"
            />
            <ValStartIndex />
          </HStack>

          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={TbNumbers}
              title="Test Set Initial Save Index"
              description="A number to append to the file name of first augmented training image. (eg. img-1.jpg, mask-1.jpg)"
            />
            <TestStartIndex />
          </HStack>
        </VStack>
      </BoundingBox>

      {/*Start Augmentation */}
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
          onClick={handleToggle}
        >
          <IconHeadingDescriptionCombo
            icon={FaPlay}
            fontSize={30}
            title={isRunning ? "Cancel Augmentation" : "Run Augmentation"}
            description={
              isRunning
                ? "Stop the augmentation process."
                : "Augment the selected images and segmentation masks."
            }
          />
          {isRunning && ( // Show progress bar only when running
            <CircularProgress
              value={progress}
              size="120px"
              color="blue.400"
              mt={4}
            >
              <CircularProgressLabel>{progress}%</CircularProgressLabel>
            </CircularProgress>
          )}
        </Button>
      </BoundingBox>
    </>
  );
};

export default StartAugmentation;
