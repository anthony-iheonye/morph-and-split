import { IconButton } from "@chakra-ui/react";
import { FaLock, FaLockOpen } from "react-icons/fa";
import useLockedRatio from "../../hooks/useLockedSet";

const TestRatioLock = () => {
  const { trainRatioLocked, valRatioLocked, testRatioLocked, setAugConfig } =
    useLockedRatio();

  const handleLock = () => {
    if (!valRatioLocked && !trainRatioLocked) {
      setAugConfig("testRatioLocked", !testRatioLocked);
    }
  };

  return (
    <IconButton
      aria-label="Click to activate or deactivate the lock."
      icon={testRatioLocked ? <FaLock /> : <FaLockOpen />}
      onClick={() => handleLock()}
      background="auto"
      variant="unstyled"
      size="lg"
      disabled={valRatioLocked || trainRatioLocked}
      minWidth={"auto"}
      height={"auto"}
      marginLeft={"20px"}
    ></IconButton>
  );
};

export default TestRatioLock;
