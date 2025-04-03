import {
  Box,
  Button,
  Heading,
  IconButton,
  List,
  ListItem,
  VStack,
  chakra,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaCheckCircle } from "react-icons/fa";

// Create a motion-enhanced Chakra UI Box
const MotionBox = chakra(motion.div);

/**
 * FeatureSwitcher is a UI component that toggles between two informative sections:
 * "Key Features" and "Why Choose Morph & Split".
 *
 * It provides an animated transition between the two sections using Framer Motion,
 * navigated by arrow buttons or a call-to-action (CTA) button.
 */
const FeatureSwitcher = () => {
  const [isFeatures, setIsFeatures] = useState(true);

  /**
   * Toggles between the feature list and the reasons to choose section.
   */
  const toggleSection = () => {
    setIsFeatures((prev) => !prev);
  };

  /**
   * Animation variants for sliding effect between content sections.
   */
  const slideVariants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: { duration: 0.5 },
    }),
  };

  return (
    <Box
      textAlign="center"
      p={6}
      maxW="800px"
      mx="auto"
      backgroundColor="gray.700"
    >
      {/* Title & Navigation Buttons */}
      <VStack mb={4}>
        <Heading as="h2" size="lg" color="teal.500">
          {isFeatures ? "Key Features" : "Why Choose Morph & Split"}
        </Heading>

        {/* Navigation Buttons */}
        <Box>
          <IconButton
            aria-label="Previous"
            icon={<FaArrowLeft />}
            onClick={toggleSection}
            colorScheme="teal"
            mr={2}
          />
          <IconButton
            aria-label="Next"
            icon={<FaArrowRight />}
            onClick={toggleSection}
            colorScheme="teal"
          />
        </Box>
      </VStack>

      {/* Animated Content Switching */}
      <Box position="relative" height="200px" overflow="hidden">
        <AnimatePresence custom={isFeatures ? 1 : -1} mode="wait">
          {isFeatures ? (
            <MotionBox
              key="features"
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              custom={1}
              position="absolute"
              width="100%"
            >
              <List spacing={3} textAlign="left">
                <ListItem>
                  <FaCheckCircle color="teal" /> Resize & Crop with Precision
                </ListItem>
                <ListItem>
                  <FaCheckCircle color="teal" /> Powerful Augmentation Tools
                </ListItem>
                <ListItem>
                  <FaCheckCircle color="teal" /> Stratified Dataset Splitting
                </ListItem>
                <ListItem>
                  <FaCheckCircle color="teal" /> No-Code, Intuitive UI
                </ListItem>
              </List>
            </MotionBox>
          ) : (
            <MotionBox
              key="whyChoose"
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              custom={-1}
              position="absolute"
              width="100%"
            >
              <List spacing={3} textAlign="left">
                <ListItem>
                  <FaCheckCircle color="teal" /> Save Time with Automated
                  Preprocessing
                </ListItem>
                <ListItem>
                  <FaCheckCircle color="teal" /> Improve Data Quality &
                  Diversity
                </ListItem>
                <ListItem>
                  <FaCheckCircle color="teal" /> Enhance AI Model Performance
                </ListItem>
              </List>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>

      {/* CTA Button */}
      <Button mt={6} colorScheme="teal" onClick={toggleSection}>
        {isFeatures ? "Next: Why Choose Morph & Split" : "Back to Key Features"}
      </Button>
    </Box>
  );
};

export default FeatureSwitcher;
