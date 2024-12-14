import { HStack, Text, VStack } from "@chakra-ui/react";
import { TbNumbers } from "react-icons/tb";
import Augment from "../components/buttons/Augment";
import BoundingBox from "../components/BoundingBox";
import IconHeadingDescriptionCombo from "../components/IconHeadingDescriptionCombo";
import PageTitle from "../components/PageTitle";
import TestStartIndex from "../components/inputFields/TestStartIndex";
import TrainStartIndex from "../components/inputFields/TrainStartIndex";
import ValStartIndex from "../components/inputFields/ValStartIndex";

const StartAugmentation = () => {
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
      <Augment />
    </>
  );
};

export default StartAugmentation;
