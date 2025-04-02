import { IconButton } from "@chakra-ui/react";
import { FaLock, FaLockOpen } from "react-icons/fa";
import useLockedRatio from "../../hooks/useLockedSet";

const ValRatioLock = () => {
  const { trainRatioLocked, valRatioLocked, testRatioLocked, setAugConfig } =
    useLockedRatio();

  const handleLock = () => {
    if (!trainRatioLocked && !testRatioLocked) {
      setAugConfig("valRatioLocked", !valRatioLocked);
    }
  };

  return (
    <IconButton
      aria-label="Click to activate or deactivate the lock."
      icon={valRatioLocked ? <FaLock /> : <FaLockOpen />}
      onClick={() => handleLock()}
      background="auto"
      variant="unstyled"
      size="lg"
      disabled={trainRatioLocked || testRatioLocked}
      minWidth={"auto"}
      height={"auto"}
      marginLeft={"20px"}
    ></IconButton>
  );
};

export default ValRatioLock;
