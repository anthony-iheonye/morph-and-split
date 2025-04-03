import { GridProps, useBreakpointValue } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { IconComboControl } from "../miscellaneous";
import TestStartIndex from "./TestStartIndex";
import TrainStartIndex from "./TrainStartIndex";
import ValStartIndex from "./ValStartIndex";

/**
 * Props for the SaveSuffixInput component.
 */
interface Props extends Omit<GridProps, "title"> {
  /** Header/title to display above the suffix input */
  title: string | { base?: string; md?: string; lg?: string };
  /** Font size of the title (responsive or fixed) */
  titleFontSize?: number | { base?: number; md?: number; lg?: number };
  /** Optional description displayed below the title */
  description?: string | { base?: string; md?: string; lg?: string };
  /** Indicates the dataset type (train/val/test) */
  setName: "training" | "validation" | "testing";
  /** Optional icon shown alongside the title/description */
  icon?: IconType | undefined;
}

/**
 * SaveSuffixInput is a wrapper component that displays a labeled number input
 * for specifying the numerical suffix used in naming augmented results.
 *
 * It dynamically renders the appropriate suffix input (Train/Val/Test) based on the provided set name.
 */
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
