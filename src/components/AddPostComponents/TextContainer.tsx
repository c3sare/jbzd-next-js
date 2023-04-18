import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const TextContainer = (props: any) => {
  const { data, setData, index } = props;
  const modules = {
    toolbar: [
      [
        {
          color: [
            "rgb(222, 33, 39)",
            "rgb(143, 143, 143)",
            "rgb(148, 180, 37)",
            "rgb(240, 204, 0)",
            "rgb(24, 119, 242)",
            "rgb(255, 255, 255)",
            "rgb(119, 119, 119)",
            "rgb(0, 0, 0)",
          ],
        },
      ],
      [{ header: [1, 2, 3] }],
      ["bold", "italic", "underline"],
      [{ align: "justify" }],
      [{ align: "center" }],
      [{ align: "right" }],
    ],
  };
  return (
    <ReactQuill
      modules={modules}
      theme="snow"
      value={data}
      onChange={(e) => setData(e, index)}
    />
  );
};

export default TextContainer;
