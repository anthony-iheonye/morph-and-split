import useNavStore from "../store/navStore";

const useActiveSubParent = () => {
  const { setActiveSubParent } = useNavStore((store) => ({
    setActiveSubParent: store.activeSubParent,
  }));
  return setActiveSubParent;
};

export default useActiveSubParent;
