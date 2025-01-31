import {
  Box,
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import StartSession from "../components/buttons/StartSession";

const WelcomePage = () => {
  return (
    <Box
      textAlign="center"
      p={8}
      maxW="900px"
      mx="auto"
      backgroundColor="gray.700"
      minHeight="100vh"
    >
      {/* Title */}
      <Heading as="h1" size="2xl" mb={2}>
        Welcome to{" "}
        <Text as="span" color="teal.200">
          Morph & Split
        </Text>
      </Heading>

      {/* Subtitle */}
      <Text fontSize="lg" color="gray.400" mb={6}>
        Enhance, Transform, and Organize Your Image-Mask Datasets with Ease!
      </Text>

      {/* Introduction */}
      <Text fontSize="md" color="gray.400" mb={6}>
        Take full control of your image-mask datasets with Morph & Split — an
        intuitive web app designed to streamline data preparation for machine
        learning and computer vision. Whether refining original images or
        generating augmented datasets, we've got you covered.
      </Text>

      {/* Key Features Section */}
      {/* Key Features Section */}
      <VStack spacing={4} align="start" textAlign="left" mb={6}>
        <Heading as="h2" size="lg" color="teal.500">
          What Makes Morph & Split Stand Out?
        </Heading>
        <List spacing={3}>
          <ListItem display="flex" alignItems="start">
            <ListIcon as={FaCheckCircle} color="teal.500" mt={1} />
            <Box flex="1">
              <b>Resize & Crop with Precision</b> – Adjust image sizes and crop
              masks before augmentation.
            </Box>
          </ListItem>
          <ListItem display="flex" alignItems="start">
            <ListIcon as={FaCheckCircle} color="teal.500" mt={1} />
            <Box flex="1">
              <b>Powerful Augmentation Tools</b> – Apply transformations like
              flips, rotations, and color adjustments.
            </Box>
          </ListItem>
          <ListItem display="flex" alignItems="start">
            <ListIcon as={FaCheckCircle} color="teal.500" mt={1} />
            <Box flex="1">
              <b>Stratified Dataset Splitting</b> – Maintain class balance when
              splitting into train, validation, and test sets.
            </Box>
          </ListItem>
          <ListItem display="flex" alignItems="start">
            <ListIcon as={FaCheckCircle} color="teal.500" mt={1} />
            <Box flex="1">
              <b>Built for Performance & Simplicity</b> – A sleek, no-code UI to
              manage dataset preparation effortlessly.
            </Box>
          </ListItem>
        </List>
      </VStack>

      {/* Benefits Section */}
      <VStack spacing={4} align="start" textAlign="left" mb={6}>
        <Heading as="h2" size="lg" color="teal.500">
          Why Use Morph & Split?
        </Heading>
        <List spacing={3}>
          <ListItem display="flex" alignItems="start">
            <ListIcon as={FaCheckCircle} color="teal.500" mt={1} />
            <Box flex="1">
              <b>Save Time:</b> Automate tedious preprocessing tasks with just a
              few clicks.
            </Box>
          </ListItem>
          <ListItem display="flex" alignItems="start">
            <ListIcon as={FaCheckCircle} color="teal.500" mt={1} />
            <Box flex="1">
              <b>Enhance Your Data:</b> Increase dataset diversity and quality
              through augmentation.
            </Box>
          </ListItem>
          <ListItem display="flex" alignItems="start">
            <ListIcon as={FaCheckCircle} color="teal.500" mt={1} />
            <Box flex="1">
              <b>Boost Model Performance:</b> Well-prepared datasets lead to
              more accurate AI models.
            </Box>
          </ListItem>
        </List>
      </VStack>

      {/* Start Session Button */}
      <StartSession to="/upload_data/images" label="Start New Session" />
    </Box>
  );
};

export default WelcomePage;
