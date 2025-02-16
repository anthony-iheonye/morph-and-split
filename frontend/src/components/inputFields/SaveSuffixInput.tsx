import { GridProps, useBreakpointValue } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { IconComboControl } from "../miscellaneous";
import TestStartIndex from "./TestStartIndex";
import TrainStartIndex from "./TrainStartIndex";
import ValStartIndex from "./ValStartIndex";

interface Props extends Omit<GridProps, "title"> {
  title: string | { base?: string; md?: string; lg?: string };
  titleFontSize?: number | { base?: number; md?: number; lg?: number };
  description?: string | { base?: string; md?: string; lg?: string };
  setName: "training" | "validation" | "testing";
  icon?: IconType | undefined;
}
const SaveSuffixInput = ({
  title,
  titleFontSize,
  description = "",
  setName,
  icon,
}: Props) => {
  const responsiveDescription = useBreakpointValue(
    typeof description === "string" ? { base: description } : description
  );

  const responsiveTitle =
    useBreakpointValue(typeof title === "string" ? { base: title } : title) ||
    "";

  const suffixDescription = {
    training:
      "Specify the numerical suffix for naming the first  augmented training result",
    validation:
      "Specify the numerical suffix for naming the first  augmented  validation result",
    testing:
      "Specify the numerical suffix for naming the first augmented test result",
  };

  return (
    <IconComboControl
      icon={icon}
      title={responsiveTitle}
      description={suffixDescription[setName] || responsiveDescription}
      titleFontSize={titleFontSize}
      controlElement={
        setName === "training" ? (
          <TrainStartIndex />
        ) : setName === "validation" ? (
          <ValStartIndex />
        ) : (
          <TestStartIndex />
        )
      }
      controlElementWidth="100px"
    />
  );
};

export default SaveSuffixInput;
