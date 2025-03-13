import {
  Grid,
  GridItem,
  HStack,
  Image,
  SimpleGrid,
  Switch,
} from "@chakra-ui/react";
import { GiResize } from "react-icons/gi";
import { PiResizeFill } from "react-icons/pi";
import { RiCropFill } from "react-icons/ri";
import { TbArrowAutofitHeight, TbArrowAutofitWidth } from "react-icons/tb";
import { ContinueBtn, PreviousBtn } from "../components/buttons";
import { BoundingBox } from "../components/display";
import {
  HeightOffsetInput,
  ResizeHeightInput,
  ResizeWidthInput,
  TargetHeightInput,
  TargetWidthInput,
  WidthOffsetInput,
} from "../components/inputFields";
import {
  CopyrightBar,
  IconComboControl,
  PageTitle,
} from "../components/miscellaneous";
import { useAugConfigAndSetter } from "../hooks";
import cropGuide from "../assets/crop_guide.svg";

const PreProcessing = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  const handleCheckBoxChange = (key: keyof typeof augConfig) => {
    setAugConfig(key, !augConfig[key]);
  };

  return (
    <Grid
      templateAreas={{
        base: `"title"
               "cropData"
               "resizeData"
               "navBtn"
               "copyright"`,
      }}
      templateColumns={{ base: "1fr" }}
      templateRows={{ base: "auto 1fr auto auto auto" }}
      overflow="hidden"
      maxHeight="100%"
    >
      <GridItem area="title">
        <PageTitle title="Pre-Procesing" />
      </GridItem>

      <BoundingBox
        transparent={true}
        padding="0"
        overflowY="auto"
        marginLeft={0}
        marginRight={0}
      >
        <GridItem area="cropData">
          <BoundingBox>
            <IconComboControl
              icon={RiCropFill}
              title="Crop Original Data"
              description="Crop the original image and mask to a specified size before applying augmentation"
              controlElement={
                <Switch
                  id="crop"
                  colorScheme="teal"
                  isChecked={augConfig.crop}
                  onChange={() => handleCheckBoxChange("crop")}
                />
              }
            />
            {augConfig.crop ? <Image src={cropGuide} boxSize="300px" /> : null}
            {augConfig.crop ? (
              <BoundingBox
                maxWidth={"600px"}
                padding={{ base: "0", md: "6" }}
                paddingTop={{ base: "3", md: "3" }}
                paddingBottom={{ base: "0", md: "0" }}
              >
                <SimpleGrid columns={{ base: 1 }} spacing={{ base: 4, md: 8 }}>
                  <IconComboControl
                    icon={PiResizeFill}
                    title="Height Offset (a)"
                    description="Adjusts the vertical position of the cropping area within the image."
                    controlElement={<HeightOffsetInput />}
                    controlElementWidth={"100px"}
                  />

                  <IconComboControl
                    icon={PiResizeFill}
                    title="Width Offset (b)"
                    description="Adjusts the horizontal position of the cropping area within the image."
                    controlElement={<WidthOffsetInput />}
                    controlElementWidth={"100px"}
                  />

                  <IconComboControl
                    icon={TbArrowAutofitWidth}
                    title="Target Width (c)"
                    description="The width of the image/mask after cropping."
                    controlElement={<TargetWidthInput />}
                    controlElementWidth={"100px"}
                  />
                  <IconComboControl
                    icon={TbArrowAutofitHeight}
                    title="Target Height (d)"
                    description="The height of the image/mask after cropping."
                    controlElement={<TargetHeightInput />}
                    controlElementWidth={"100px"}
                  />
                </SimpleGrid>
              </BoundingBox>
            ) : null}
          </BoundingBox>
        </GridItem>

        <GridItem area="resizeData">
          <BoundingBox>
            <IconComboControl
              icon={GiResize}
              title="Resize Data"
              description="Resize images and masks to specified dimensions before augmentation. If cropping is selected, the images and masks will be cropped first, then resized."
              controlElement={
                <Switch
                  id="crop"
                  colorScheme="teal"
                  isChecked={augConfig.resizeAugImage}
                  onChange={() => handleCheckBoxChange("resizeAugImage")}
                />
              }
            />
            {augConfig.resizeAugImage ? (
              <BoundingBox maxWidth={"600px"} padding={{ base: "0", md: "6" }}>
                <SimpleGrid columns={{ base: 1 }} spacing={{ base: 8, md: 8 }}>
                  <IconComboControl
                    icon={TbArrowAutofitHeight}
                    title="Image Height"
                    description="The height of the image/mask after resizing."
                    controlElement={<ResizeHeightInput />}
                    controlElementWidth={"100px"}
                  />
                  <IconComboControl
                    icon={TbArrowAutofitWidth}
                    title="Image Width"
                    description="The width of the image/mask after resizing."
                    controlElement={<ResizeWidthInput />}
                    controlElementWidth={"100px"}
                  />
                </SimpleGrid>
              </BoundingBox>
            ) : null}
          </BoundingBox>
        </GridItem>
      </BoundingBox>

      <GridItem area="navBtn">
        <BoundingBox transparent padding={0} mt={0}>
          <HStack justifyContent={{ base: "center", md: "start" }}>
            <PreviousBtn to="/settings/select_transformation" />
            <ContinueBtn to="/augment/start_augmentation" />
          </HStack>
        </BoundingBox>
      </GridItem>

      <GridItem area="copyright">
        <CopyrightBar />
      </GridItem>
    </Grid>
  );
};

export default PreProcessing;
