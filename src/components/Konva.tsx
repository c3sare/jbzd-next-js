import { useState, useEffect, useRef } from "react";
import { Layer, Stage, Image } from "react-konva";

const setPos = (
  size: number[],
  pos: { x: number; y: number },
  zoom: number
) => {
  let x = pos.x;
  let y = pos.y;
  const maxX = size[0] * zoom > 204 ? (size[0] * zoom - 204) / 2 : 0;
  const maxY = size[1] * zoom > 204 ? (size[1] * zoom - 204) / 2 : 0;

  if (pos.x < -maxX * 2) x = -maxX * 2;
  if (pos.x > 0) x = 0;

  if (pos.y < -maxY * 2) y = -maxY * 2;
  if (pos.y > 0) y = 0;

  return {
    x,
    y,
  };
};

const Konva = ({
  src = "/images/avatars/default.jpg",
  zoom,
  setFile,
  canvasRef,
}: {
  src: string;
  zoom: number;
  setFile: any;
  canvasRef: any;
}) => {
  const [img, setImg] = useState<any>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const stageRef = useRef<any>(null);
  const [size, setSize] = useState([0, 0]);

  useEffect(() => {
    const img = document.createElement("img");
    img.onload = function () {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const width = w > h ? 204 * (w / h) : 204;
      const height = h > w ? 204 * (h / w) : 204;
      img.width = width;
      img.height = height;
      setImg(img);
      setSize([width, height]);
      stageRef.current!.position({
        x: width > 204 ? -(width - 204) / 2 : 0,
        y: height > 204 ? -(height - 204) / 2 : 0,
      });
    };
    img.crossOrigin = "Anonymous";
    img.src = src;
  }, [src]);

  useEffect(() => {
    if (stageRef.current !== null) {
      const width = size[0] * zoom;
      const height = size[1] * zoom;
      const x = stageRef.current!.x();
      const y = stageRef.current!.y();
      const minX = -(width - 204);
      const minY = -(height - 204);

      stageRef.current!.position({
        x: x < minX ? minX : x,
        y: y < minY ? minY : y,
      });
    }
  }, [zoom]);

  return (
    <>
      <Stage
        width={204}
        height={204}
        style={{ margin: "0 auto", maxWidth: "204px", cursor: "pointer" }}
        ref={canvasRef}
      >
        <Layer>
          <Image
            ref={stageRef}
            image={img}
            alt="Avatar"
            scaleX={zoom}
            draggable
            scaleY={zoom}
            dragBoundFunc={function (pos) {
              const { x, y } = setPos(size, pos, zoom);
              return { x, y };
            }}
            onPointerClick={() => fileInput.current!.click()}
            width={size[0]}
            height={size[1]}
          />
        </Layer>
      </Stage>
      <input
        ref={fileInput}
        type="file"
        accept="image/jpeg,image/png,image/gif"
        onChange={(e) => {
          if (e.target?.files?.[0])
            setFile(URL.createObjectURL(e.target?.files?.[0]));
        }}
      />
    </>
  );
};

export default Konva;
