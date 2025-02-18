import {
  Grid,
  GridItem,
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import StartSession from "../components/buttons/StartSession";
import { BoundingBox } from "../components/display";

const WelcomePage = () => {
  return (
    <Grid
      templateAreas={{
        base: `"heading"
                "keyFeatures"
                "benefits"
                "startSession"`,
      }}
      textAlign="center"
      p={6}
      maxW="740px"
      mx="auto"
      backgroundColor="gray.650"
      height="100%"
      overflowY="hidden"
    >
      <GridItem area="heading">
        <Heading as="h1" size="2xl" mb={2}>
          Welcome to{" "}
          <Text as="span" color="teal.200">
            Morph & Split
          </Text>
        </Heading>
        <Text fontSize="lg" color="gray.400" mb={6}>
          Seamless Image-Mask Processing for Machine Learning & Computer Vision
        </Text>
      </GridItem>

      <GridItem
        area="keyFeatures"
        display="flex"
        flexDirection="column"
        flex="1"
        overflow="hidden"
      >
        <BoundingBox display="flex" overflow="hidden" mx={0}>
          <VStack
            display="flex"
            overflow="hidden"
            spacing={4}
            align="start"
            textAlign="left"
            mb={4}
            width="100%"
          >
            <Heading as="h2" size="lg" color="teal.500">
              Key Features
            </Heading>
            <List spacing={3} overflowY="auto" width="100%">
              <ListItem>
                <ListIcon as={FaCheckCircle} color="teal.500" />
                <b>Advanced Augmentation</b>
                <Text as="span" color="gray.300" display="block">
                  Apply flips, rotations, color shifts, and more.
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="teal.500" />
                <b>Smart Dataset Splitting</b>
                <Text as="span" color="gray.300" display="block">
                  Maintain class balance across train, validation, and test
                  sets.
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="teal.500" />
                <b>Resize & Crop with Precision</b>
                <Text as="span" color="gray.300" display="block">
                  Refine image and mask dimensions effortlessly
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="teal.500" />
                <b>Intuitive No-Code Interface</b>
                <Text as="span" color="gray.300" display="block">
                  A sleek UI designed for speed, efficiency, and automation.
                </Text>
              </ListItem>
            </List>
          </VStack>
        </BoundingBox>
      </GridItem>

      <GridItem
        area="benefits"
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        <BoundingBox display="flex" overflowY="hidden" mx={0} mt={0}>
          <VStack
            display="flex"
            overflow="hidden"
            spacing={4}
            align="start"
            textAlign="left"
            mb={6}
          >
            <Heading as="h2" size="lg" color="teal.500">
              Why Choose Morph & Split
            </Heading>
            <List spacing={3} overflow="auto" pr={1}>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="teal.500" />
                <b>Save Time</b>
                <Text as="span" color="gray.300" display="block">
                  Automate tedious preprocessing tasks in just a few clicks and
                  focus on model development.
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="teal.500" />
                <b>Improve Data Quality</b>
                <Text as="span" color="gray.300" display="block">
                  Enhance dataset consistency and variety through structured
                  augmentation techniques.
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="teal.500" />
                <b>Boost AI Model Accuracy</b>
                <Text as="span" color="gray.300" display="block">
                  Well-prepared datasets contribute to better model
                  generalization and performance.
                </Text>
              </ListItem>
            </List>
          </VStack>
        </BoundingBox>
      </GridItem>

      <GridItem area="startSession">
        <StartSession to="/upload_data/images" label="Start New Session" />
      </GridItem>
    </Grid>
  );
};

export default WelcomePage;
