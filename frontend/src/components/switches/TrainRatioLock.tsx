import { IconButton } from "@chakra-ui/react";
import { FaLock, FaLockOpen } from "react-icons/fa";
import useLockedRatio from "../../hooks/useLockedSet";

const TrainRatioLock = () => {
  const { trainRatioLocked, valRatioLocked, testRatioLocked, setAugConfig } =
    useLockedRatio();

  const handleLock = () => {
    if (!valRatioLocked && !testRatioLocked) {
      setAugConfig("trainRatioLocked", !trainRatioLocked);
    }
  };

  return (
    <IconButton
      aria-label="Click to activate or deactivate the lock."
      icon={trainRatioLocked ? <FaLock /> : <FaLockOpen />}
      onClick={() => handleLock()}
      background="auto"
      variant="unstyled"
      size="lg"
      disabled={valRatioLocked || testRatioLocked}
      minWidth={"auto"}
      height={"auto"}
      marginLeft={"20px"}
    ></IconButton>
  );
};

export default TrainRatioLock;
