import useNavStore from "../store/navStore";

const useActiveParent = () => {
  const { setActiveParent } = useNavStore((store) => ({
    setActiveParent: store.setActiveParent,
  }));

  return setActiveParent;
};

export default useActiveParent;
