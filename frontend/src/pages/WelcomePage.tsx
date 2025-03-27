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
import { CopyrightBar, ThemedText } from "../components/miscellaneous";

const WelcomePage = () => {
  return (
    <Grid
      templateAreas={{
        base: `"heading"
                "features"
                "startSession"
                "copyright"`,
      }}
      textAlign="center"
      p={6}
      maxW="740px"
      mx="auto"
      backgroundColor="gray.650"
      height="100%"
      overflowY="hidden"
    >
      <GridItem area="heading" mb={5}>
        <Heading as="h1" size="2xl" mb={2}>
          Welcome to{" "}
          <Text as="span" color="teal.200">
            Morph & Split
          </Text>
        </Heading>
        <ThemedText fontSize="lg" mb={6}>
          Seamless Image-Mask Processing for Machine Learning & Computer Vision
        </ThemedText>
      </GridItem>

      <GridItem
        area="features"
        display="flex"
        flexDirection="column"
        flex="1"
        overflow="hidden"
        mb={0}
      >
        <BoundingBox
          overflow="auto"
          transparent
          m={{ base: 0, md: 0 }}
          mx={{ base: 0, md: 6 }}
          p={{ base: 0, md: 0 }}
          borderRadius={8}
        >
          <BoundingBox
            display="flex"
            overflow="hidden"
            mt={{ base: 0, md: 0 }}
            mx={{ base: 0, md: 0 }}
            pl={{ md: 6 }}
            borderRadius={8}
          >
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
              <List spacing={3} width="100%">
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="teal.500" />
                  <b>Advanced Augmentation</b>
                  <ThemedText as="span" display="block">
                    Apply flips, rotations, color shifts, and more.
                  </ThemedText>
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="teal.500" />
                  <b>Smart Dataset Splitting</b>
                  <ThemedText as="span" display="block">
                    Maintain class balance across train, validation, and test
                    sets.
                  </ThemedText>
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="teal.500" />
                  <b>Resize & Crop with Precision</b>
                  <ThemedText as="span" display="block">
                    Refine image and mask dimensions effortlessly
                  </ThemedText>
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="teal.500" />
                  <b>Intuitive No-Code Interface</b>
                  <ThemedText as="span" display="block">
                    A sleek UI designed for speed, efficiency, and automation.
                  </ThemedText>
                </ListItem>
              </List>
            </VStack>
          </BoundingBox>

          <BoundingBox
            display="flex"
            overflowY="hidden"
            mb={{ base: 0, md: 0 }}
            mx={{ base: 0, md: 0 }}
            paddingBottom={{ base: 0, md: 0 }}
            pl={{ md: 6 }}
            borderRadius={8}
          >
            <VStack
              display="flex"
              overflow="hidden"
              spacing={4}
              align="start"
              textAlign="left"
              mb={4}
            >
              <Heading as="h2" size="lg" color="teal.500">
                Why Choose Morph & Split
              </Heading>
              <List spacing={3} pr={1}>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="teal.500" />
                  <b>Save Time</b>
                  <ThemedText as="span" display="block">
                    Automate tedious preprocessing tasks in just a few clicks
                    and focus on model development.
                  </ThemedText>
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="teal.500" />
                  <b>Improve Data Quality</b>
                  <ThemedText as="span" display="block">
                    Enhance dataset consistency and variety through structured
                    augmentation techniques.
                  </ThemedText>
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="teal.500" />
                  <b>Boost AI Model Accuracy</b>
                  <ThemedText as="span" display="block">
                    Well-prepared datasets contribute to better model
                    generalization and performance.
                  </ThemedText>
                </ListItem>
              </List>
            </VStack>
          </BoundingBox>
        </BoundingBox>
      </GridItem>

      <GridItem area="startSession" mt={4} mb={2}>
        <StartSession to="/upload_data/images" label="Start New Session" />
      </GridItem>

      <GridItem area="copyright">
        <CopyrightBar />
      </GridItem>
    </Grid>
  );
};

export default WelcomePage;
