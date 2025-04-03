import { IconButton } from "@chakra-ui/react";
import { FaLock, FaLockOpen } from "react-icons/fa";
import useLockedRatio from "../../hooks/useLockedSet";

/**
 * `ValRatioLock` is a toggle button component that locks or unlocks the validation set ratio
 * in the data splitting configuration.
 *
 * Only one of the three ratios (train, val, test) can be locked at a time to ensure
 * the total sum remains 100%. This component is disabled if either the train or test ratio is locked.
 *
 * When clicked, it toggles the `valRatioLocked` state in the augmentation config store (Zustand).
 *
 * The icon shown depends on the current lock state:
 * - `FaLock` when locked
 * - `FaLockOpen` when unlocked
 */
const ValRatioLock = () => {
  // Access locked ratio flags and update function from Zustand store
  const { trainRatioLocked, valRatioLocked, testRatioLocked, setAugConfig } =
    useLockedRatio();

  /**
   * Handles toggling the lock state of the validation ratio.
   * Only triggers if both train and test ratios are currently unlocked.
   */
  const handleLock = () => {
    if (!trainRatioLocked && !testRatioLocked) {
      setAugConfig("valRatioLocked", !valRatioLocked);
    }
  };

  return (
    <IconButton
      aria-label="Click to activate or deactivate the lock."
      icon={valRatioLocked ? <FaLock /> : <FaLockOpen />}
      onClick={handleLock}
      background="auto"
      variant="unstyled"
      size="lg"
      disabled={trainRatioLocked || testRatioLocked} // Lock unavailable if other ratios are locked
      minWidth="auto"
      height="auto"
      marginLeft="20px"
    />
  );
};

export default ValRatioLock;
