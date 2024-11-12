import { Box, Link, Text } from "@chakra-ui/react";

const CopyrightBar = () => {
  return (
    <Box as="footer" py={4} textAlign="center">
      <Text fontSize="sm" color="gray.600">
        {" "}
        © {new Date().getFullYear()} Developed by{" "}
        <Link href="https://www.linkedin.com/in/anthony-iheonye/">
          Anthony Iheonye
        </Link>
        . All rights reserved.
      </Text>
    </Box>
  );
};

export default CopyrightBar;
