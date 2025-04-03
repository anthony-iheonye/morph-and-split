import { MdDeleteForever } from "react-icons/md";
import IconButtonWithToolTip from "./IconButtonWithToolTip";
import handleDeleteImages from "../../services/handleDeleteImages";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner, useToast } from "@chakra-ui/react";
import { useBackendResponse } from "../../hooks";

/**
 * DeleteImages component renders a button for deleting uploaded images.
 *
 * @returns {JSX.Element} An IconButton component configured with delete functionality and tooltip.
 */
const DeleteImages = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { setBackendResponseLog, imageIsUploading, deletingImages } =
    useBackendResponse();

  // Handles the deletion of uploaded images using backend service.
  const handleDelete = () => {
    handleDeleteImages({
      queryClient,
      setBackendResponseLog,
      toast,
    });
  };

  return (
    <IconButtonWithToolTip
      aria-label="Click to delete uploaded images"
      tooltipLabel="Delete all images"
      icon={deletingImages ? <Spinner /> : <MdDeleteForever />}
      onClick={handleDelete}
      placement="left-start"
      isDisabled={imageIsUploading}
    />
  );
};

export default DeleteImages;
