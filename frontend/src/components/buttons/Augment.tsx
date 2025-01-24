import { Button, Spinner, useToast } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { TbTransform } from "react-icons/tb";
import { useBackendResponse } from "../../hooks";
import { handleAugment } from "../../services";
import { useAugConfigStore } from "../../store";

const Augment = () => {
  const { augConfig } = useAugConfigStore();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const queryClient = useQueryClient();
  const { setBackendResponseLog } = useBackendResponse();

  return (
    <Button
      type="submit"
      colorScheme="teal"
      size="sm"
      borderRadius={20}
      justifySelf="center"
      _hover={{ bg: "teal" }}
      onClick={() =>
        handleAugment({
          queryClient,
          augConfig,
          setBackendResponseLog,
          setIsLoading,
          toast,
        })
      }
      disabled={isLoading}
      leftIcon={
        isLoading ? <Spinner size="md" color="white" /> : <TbTransform />
      }
    >
      {isLoading ? "Processing" : "Augment Data"}
    </Button>
  );
};

export default Augment;
