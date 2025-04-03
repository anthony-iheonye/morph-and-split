import { ColorProps, Text, TextProps, useColorMode } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props extends TextProps {
  children: ReactNode;
  lightModeTextColor?: ColorProps["color"];
  darkModeTextColor?: ColorProps["color"];
}

/**
 * ThemedText is a reusable Chakra Text component that adapts its color
 * based on the current color mode (light or dark).
 *
 */
const ThemedText = ({
  children,
  lightModeTextColor = "gray.700",
  darkModeTextColor = "gray.300",
  ...rest
}: Props) => {
  const { colorMode } = useColorMode();

  return (
    <Text
      color={colorMode === "dark" ? darkModeTextColor : lightModeTextColor}
      {...rest}
    >
      {children}
    </Text>
  );
};

export default ThemedText;
