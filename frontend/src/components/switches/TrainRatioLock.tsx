import { IconButton } from "@chakra-ui/react";
import { FaLock, FaLockOpen } from "react-icons/fa";
import useLockedRatio from "../../hooks/useLockedSet";

/**
 * `TrainRatioLock` is a UI component that renders a lock/unlock button for the training set ratio.
 *
 * This button allows users to lock or unlock the training set ratio in a data split configuration.
 * It ensures that only one ratio (train, val, or test) can be locked at a time by disabling the button
 * if either the validation or test ratio is already locked.
 *
 * When clicked, the button toggles the `trainRatioLocked` state in the Zustand store.
 *
 * The button uses a lock icon (`FaLock`) if the ratio is currently locked,
 * and an unlock icon (`FaLockOpen`) if it is not.
 */
const TrainRatioLock = () => {
  // Access locked ratio states and setter from Zustand store
  const { trainRatioLocked, valRatioLocked, testRatioLocked, setAugConfig } =
    useLockedRatio();

  /**
   * Toggles the lock state for the training ratio.
   * Only allowed if neither the validation nor test ratio is locked.
   */
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
      disabled={valRatioLocked || testRatioLocked} // Prevent toggling if other ratios are locked
      minWidth={"auto"}
      height={"auto"}
      marginLeft={"20px"}
    />
  );
};

export default TrainRatioLock;
