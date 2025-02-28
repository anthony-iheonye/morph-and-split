import { Button, Input, Text, useToast, VStack } from "@chakra-ui/react";
import React, { ChangeEvent, useState } from "react";
import { BackendResponse, CustomError } from "../../entities";
import useStratificationDataFileName from "../../hooks/useStratificationDataFileName";
import { APIClient, getFileExt } from "../../services";
import { useAugConfigAndSetter } from "../../hooks";
import { useQueryClient } from "@tanstack/react-query";
import invalidateQueries from "../../services/invalidateQueries";
import DeleteStratDataFile from "./DeleteStratDataFile";

const StratifiedDataFileUploader = () => {
  const [uploading, setIsUploading] = useState(false);
  const toast = useToast();
  const { setAugConfig } = useAugConfigAndSetter();
  const queryClient = useQueryClient();

  const uploadClient = new APIClient<BackendResponse>(
    "/upload/backend/stratification_file"
  );
  const { data } = useStratificationDataFileName();
  const fileName = data?.results[0];

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
        // leftIcon={<Icon as={BsFiletypeCsv} />}
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
      {fileName ? (
        <Text fontWeight="thin" fontSize="sm">
          {fileName}
        </Text>
      ) : null}
      <DeleteStratDataFile />
    </VStack>
  );
};

export default StratifiedDataFileUploader;
