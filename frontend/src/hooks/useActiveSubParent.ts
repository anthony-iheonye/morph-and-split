import useNavStore from "../store/navStore";

const useActiveSubParent = () => {
  const { activeSubParent, setActiveSubParent } = useNavStore((store) => ({
    activeSubParent: store.activeSubParent,
    setActiveSubParent: store.setActiveSubParent,
  }));
  return { activeSubParent, setActiveSubParent };
};

export default useActiveSubParent;
