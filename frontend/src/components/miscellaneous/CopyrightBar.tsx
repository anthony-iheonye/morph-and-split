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
      left={{ base: "0", md: "40%", lg: "0" }}
      bottom="0"
    >
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
        .{rightsWord}
      </Text>
    </Box>
  );
};

export default CopyrightBar;
