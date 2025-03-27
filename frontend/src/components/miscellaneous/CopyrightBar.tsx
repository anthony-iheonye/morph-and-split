import { Box, Link, Text, useBreakpointValue } from "@chakra-ui/react";

const CopyrightBar = () => {
  const rightsWord =
    useBreakpointValue({
      base: "",
    }) ?? "All right reserved.";
  return (
    <Box
      as="footer"
      pb={1}
      pt={0}
      textAlign="center"
      position="absolute"
      right="0"
      left="0"
      bottom="0.5rem"
    >
      <Text fontSize="0.8rem" color="gray.600">
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
        .{rightsWord}
      </Text>
    </Box>
  );
};

export default CopyrightBar;
