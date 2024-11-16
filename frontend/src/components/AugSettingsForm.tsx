import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Tooltip,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  VStack,
  Switch,
  Select,
  HStack,
} from "@chakra-ui/react";
import useAugConfigStore from "../store";

const AugSettingsForm = () => {
  const { augConfig, setAugConfig, setImages, setMasks } = useAugConfigStore(
    (store) => ({
      augConfig: store.augConfig,
      setAugConfig: store.setAugConfig,
      setImages: store.setImages,
      setMasks: store.setMasks,
    })
  );

  return (
    <VStack>
      //save directory
      <FormControl isRequired>
        <FormLabel>Save directory</FormLabel>
        <Input
          placeholder="Directory where augmentation results will be saved"
          value={augConfig.saveDirectory}
          onChange={(e) => setAugConfig("saveDirectory", e.target.value)}
        />
        <FormErrorMessage>Save directory is required.</FormErrorMessage>
      </FormControl>
      // Taining data start index
      <FormControl>
        <FormLabel> Taining data start index </FormLabel>
        <NumberInput
          defaultValue={1}
          min={1}
          max={1000000}
          allowMouseWheel
          value={augConfig.initialTrainSaveId}
          onChange={(value) =>
            setAugConfig("initialTrainSaveId", parseInt(value))
          }
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      // Validation data start index
      <FormControl>
        <FormLabel> Validation data start index </FormLabel>
        <NumberInput
          defaultValue={1}
          min={1}
          max={1000000}
          allowMouseWheel
          value={augConfig.initialValSaveId}
          onChange={(value) =>
            setAugConfig("initialValSaveId", parseInt(value))
          }
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      // Testing data start index
      <FormControl>
        <FormLabel> Testing data start index </FormLabel>
        <NumberInput
          defaultValue={1}
          min={1}
          max={1000000}
          allowMouseWheel
          value={augConfig.initialTestSaveId}
          onChange={(value) =>
            setAugConfig("initialTestSaveId", parseInt(value))
          }
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      // Visual attribute file
      <FormControl>
        <FormLabel> Visual attribute file (.json) </FormLabel>
      </FormControl>
      // Number of channels
      <VStack>
        <FormControl>
          <FormLabel> Number of channels </FormLabel>
          <HStack>
            <VStack align="start">
              <FormLabel margin={0} fontWeight="bold" fontSize="sm">
                Image
              </FormLabel>
              <Select
                placeholder="Select image channels"
                defaultValue={3}
                value={augConfig.imageMaskChannels?.imgChannels}
                // onChange={(e) => handleImageChannelChange(e.target.value)}
              >
                <option value={1}>1 - Binary/Grayscale</option>
                <option value={3}>3 - RGB</option>
              </Select>
            </VStack>
            <VStack align="start">
              <FormLabel margin={0} fontWeight="bold" fontSize="sm">
                Mask
              </FormLabel>
              <Select
                placeholder="Select mask channels"
                defaultValue={1}
                value={augConfig.imageMaskChannels?.maskChannels}
                // onChange={(e) => handleMaskChannelChange(e.target.value)}
              >
                <option value={1}>1 - Binary/Grayscale</option>
                <option value={3}>3 - RGB</option>
              </Select>
            </VStack>
          </HStack>
        </FormControl>
      </VStack>
      <FormControl>
        <FormLabel> Start id for </FormLabel>
      </FormControl>
      <FormControl>
        <FormLabel> Start id for </FormLabel>
      </FormControl>
      <FormControl>
        <FormLabel> Start id for </FormLabel>
      </FormControl>
      <FormControl>
        <FormLabel> Start id for </FormLabel>
      </FormControl>
      <FormControl>
        <FormLabel> Start id for </FormLabel>
      </FormControl>
      <FormControl>
        <FormLabel> Start id for </FormLabel>
      </FormControl>
      <FormControl>
        <FormLabel> Start id for </FormLabel>
      </FormControl>
      <FormControl>
        <FormLabel> Start id for </FormLabel>
      </FormControl>
      <FormControl>
        <FormLabel> Start id for </FormLabel>
      </FormControl>
      <FormControl>
        <FormLabel> Start id for </FormLabel>
      </FormControl>
      <FormControl>
        <FormLabel> Start id for </FormLabel>
      </FormControl>
    </VStack>
  );
};

export default AugSettingsForm;
