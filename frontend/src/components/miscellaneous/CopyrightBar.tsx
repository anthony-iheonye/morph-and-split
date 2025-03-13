import { Box, Link, Text, useBreakpointValue } from "@chakra-ui/react";

const CopyrightBar = () => {
  const rightsWord =
    useBreakpointValue({
      sm: "",
      md: "All rights reserved.",
    }) ?? "All right reserved.";
  return (
    <Box as="footer" pb={3} pt={2} textAlign="center">
      <Text fontSize="sm" color="gray.600">
        {" "}
        © {new Date().getFullYear()} Developed by{" "}
        <Link
          href="https://www.linkedin.com/in/anthony-iheonye/"
          isExternal
          color="teal.500"
          rel="noopener noreferrer"
        >
          Anthony Iheonye
        </Link>
        . {rightsWord}
      </Text>
    </Box>
  );
};

export default CopyrightBar;
