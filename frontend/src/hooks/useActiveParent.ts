import useNavStore from "../store/navStore";

const useActiveParent = () => {
  const { activeParent, setActiveParent } = useNavStore((store) => ({
    setActiveParent: store.setActiveParent,
    activeParent: store.activeParent,
  }));

  return { activeParent, setActiveParent };
};

export default useActiveParent;
