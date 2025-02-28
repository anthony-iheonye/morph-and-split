import { Spinner, useToast } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { MdDeleteForever } from "react-icons/md";
import { useBackendResponse } from "../../hooks";
import { handleDeleteStratDataFile } from "../../services";
import IconButtonWithToolTip from "./IconButtonWithToolTip";

/**
 * Delete uploaded stratified splitting datafile.
 * @returns
 */
const DeleteStratDataFile = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { setBackendResponseLog, imageIsUploading, deletingStratDataFile } =
    useBackendResponse();

  return (
    <IconButtonWithToolTip
      aria-label="Click to delete uploaded stratification data file."
      tooltipLabel="Delete stratification data file."
      icon={
        deletingStratDataFile ? <Spinner /> : <MdDeleteForever size="1.5rem" />
      }
      onClick={() =>
        handleDeleteStratDataFile({
          queryClient,
          setBackendResponseLog,
          toast,
        })
      }
      placement="left-start"
      isDisabled={imageIsUploading}
    />
  );
};

export default DeleteStratDataFile;
