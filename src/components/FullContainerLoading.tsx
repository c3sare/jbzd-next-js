import Loading from "./Loading";

const FullContainerLoading = ({ bgColor }: { bgColor?: string }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: "0",
        left: "0",
        ...(bgColor ? { backgroundColor: bgColor } : {}),
      }}
    >
      <Loading />
    </div>
  );
};

export default FullContainerLoading;
