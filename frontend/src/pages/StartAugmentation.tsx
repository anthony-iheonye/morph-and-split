import { VStack, HStack, Text } from "@chakra-ui/react";
import { TbNumbers } from "react-icons/tb";
import { Augment } from "../components/buttons";
import { BoundingBox } from "../components/display";
import IconHeadingDescriptionCombo from "../components/IconHeadingDescriptionCombo";
import {
  TrainStartIndex,
  ValStartIndex,
  TestStartIndex,
} from "../components/inputFields";
import PageTitle from "../components/PageTitle";
import ContinueBtn from "../components/buttons/ContinueBtn";
import PreviousBtn from "../components/buttons/PreviousBtn";

const StartAugmentation = () => {
  return (
    <>
      <PageTitle title="Start Augmentation" />
      <BoundingBox>
        <Text color={"gray.400"} mb={4} fontSize="sm">
          Enter numerical suffices for naming the first augmented training,
          validaiton, and test data (eg. img-1.jpg, mask-1.jpg).
        </Text>

        <VStack spacing={{ base: 5, md: 4, lg: 8 }}>
          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={TbNumbers}
              title={{
                base: "Train save suffix",
                md: "Training Set Initial Save Suffix",
              }}
              description={{
                base: "Number to append to the file name of first augmented training data. (eg. img-1.jpg, mask-1.jpg)",
              }}
            />
            <TrainStartIndex />
          </HStack>

          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={TbNumbers}
              title={{
                base: "Val save suffix",
                md: "Validation Set Initial Save Suffix",
              }}
              description="Number to append to the file name of the first augmented validation data. (eg. img-1.jpg, mask-1.jpg)"
            />
            <ValStartIndex />
          </HStack>

          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={TbNumbers}
              title={{
                base: "Test save suffix",
                md: "Test Set Initial Save Suffix",
              }}
              description="A number to append to the file name of first augmented test data. (eg. img-1.jpg, mask-1.jpg)"
            />
            <TestStartIndex />
          </HStack>
        </VStack>
      </BoundingBox>

      <BoundingBox transparent padding={0}>
        <HStack>
          <PreviousBtn to="/settings/pre_processing" />
          <Augment />
          <ContinueBtn to="/augment/preview" label="Preview result" />
        </HStack>
      </BoundingBox>
    </>
  );
};

export default StartAugmentation;
