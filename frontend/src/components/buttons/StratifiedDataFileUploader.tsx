import { Button, Input, useToast, VStack } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { ChangeEvent, useState } from "react";
import { BackendResponse, CustomError } from "../../entities";
import { useAugConfigAndSetter, useButtonThemedColor } from "../../hooks";
import { APIClient, getFileExt } from "../../services";
import invalidateQueries from "../../services/invalidateQueries";

const StratifiedDataFileUploader = () => {
  const [uploading, setIsUploading] = useState(false);
  const toast = useToast();
  const { setAugConfig } = useAugConfigAndSetter();
  const queryClient = useQueryClient();

  const {
    backgroundColor,
    borderColor,
    hoverBorder,
    textColor,
    hoverBackgroundColor,
  } = useButtonThemedColor();

  const uploadClient = new APIClient<BackendResponse>(
    "/upload/backend/stratification_file"
  );

  const resetInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value = "";
  };

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    try {
      const curFiles = event.target.files;

      if (!curFiles || curFiles?.length === 0) {
        toast({
          title: "File Selection",
          description: `No file was selected.`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        throw new CustomError("File Selection", "No file was selected.");
      }

      if (curFiles && getFileExt(curFiles[0]) !== "csv") {
        toast({
          title: "Invalid File Format",
          description: `File most be in CSV format. Selected '${curFiles[0].name}'.`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const formData = new FormData();
      formData.append("stratificationDataFile", curFiles[0]);

      setIsUploading(true);

      const response = await uploadClient.postData(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!response.success) {
        toast({
          title: response.error,
          description: response.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        setAugConfig("splitParameters", response.results!);
        invalidateQueries(queryClient, [
          "strafied_split_parameters",
          "stratificationFileName",
        ]);
        toast({
          title: "Successful Upload",
          description: "Successfully uploaded the stratification data file.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      const errorTitle = error.response?.data?.error || "Upload Error";
      const errorDescription =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.";

      toast({
        title: errorTitle,
        description: errorDescription,
        status: "error",
        duration: null,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <VStack>
      <Button
        as="label"
        cursor="pointer"
        bg={backgroundColor}
        border={`1px solid ${borderColor}`}
        color={textColor}
        transition="background-color 0.2s ease-in-out, border-color 0.2s ease-in-out" //Smooth transitions
        _hover={{
          border: `2px solid ${hoverBorder}`,
          boxShadow: `0 0 0 2px ${hoverBorder}`,
          bg: hoverBackgroundColor,
        }}
        size="md"
      >
        {!uploading ? "Select file" : "Uploading..."}
        <Input
          type="file"
          variant="outline"
          padding="0"
          display="None"
          accept=".csv"
          onChange={(event) => {
            handleFileChange(event);
            resetInput(event);
          }}
        />
      </Button>
    </VStack>
  );
};

export default StratifiedDataFileUploader;
