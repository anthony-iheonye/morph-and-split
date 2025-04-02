import { PlacementWithLogical, Spinner, useToast } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { MdDeleteForever } from "react-icons/md";
import { useAugConfigAndSetter, useBackendResponse } from "../../hooks";
import { handleDeleteStratDataFile } from "../../services";
import IconButtonWithToolTip from "./IconButtonWithToolTip";

/**
 * Delete uploaded stratified splitting datafile.
 * @returns
 */
interface Props {
  tooltipPlacment?: PlacementWithLogical;
}
const DeleteStratDataFile = ({ tooltipPlacment = "left-start" }: Props) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { setBackendResponseLog, imageIsUploading, deletingStratDataFile } =
    useBackendResponse();
  const { setAugConfig } = useAugConfigAndSetter();

  return (
    <IconButtonWithToolTip
      aria-label="Click to delete uploaded stratification data file."
      tooltipLabel="Delete the stratification data file"
      icon={
        deletingStratDataFile ? <Spinner /> : <MdDeleteForever size="1.5rem" />
      }
      onClick={() =>
        handleDeleteStratDataFile({
          queryClient,
          setBackendResponseLog,
          setAugConfig,
          toast,
        })
      }
      placement={tooltipPlacment}
      isDisabled={imageIsUploading}
    />
  );
};

export default DeleteStratDataFile;
