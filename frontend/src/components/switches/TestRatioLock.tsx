import { IconButton } from "@chakra-ui/react";
import { FaLock, FaLockOpen } from "react-icons/fa";
import useLockedRatio from "../../hooks/useLockedSet";

/**
 * TestRatioLock is a UI control that toggles the lock state for the test split ratio slider.
 * It prevents the user from locking the test ratio if either the train or validation ratios are already locked,
 * ensuring only one ratio remains adjustable at a time for a consistent split configuration.
 *
 * Behavior:
 * - Displays a lock or unlock icon based on `testRatioLocked` state.
 * - Disables interaction when `trainRatioLocked` or `valRatioLocked` is active.
 * - Updates the `testRatioLocked` state in the global augmentation config store.
 */
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
