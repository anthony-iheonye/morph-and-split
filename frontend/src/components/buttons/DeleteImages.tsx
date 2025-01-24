import { MdDeleteForever } from "react-icons/md";
import IconButtonWithToolTip from "./IconButtonWithToolTip";
import handleDeleteImages from "../../services/handleDeleteImages";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner, useToast } from "@chakra-ui/react";
import { useBackendResponse } from "../../hooks";

/**
 * Delete uploaded images.
 * @returns
 */
const DeleteImages = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { setBackendResponseLog, imageIsUploading, deletingImages } =
    useBackendResponse();

  return (
    <IconButtonWithToolTip
      aria-label="Click to delete uploaded images"
      tooltipLabel="Delete all images"
      icon={deletingImages ? <Spinner /> : <MdDeleteForever />}
      onClick={() =>
        handleDeleteImages({
          queryClient,
          setBackendResponseLog,
          toast,
        })
      }
      isDisabled={imageIsUploading}
    />
  );
};

export default DeleteImages;
