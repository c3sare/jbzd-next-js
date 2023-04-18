import { TiUpload } from "react-icons/ti";
import React, { useRef, useState } from "react";
import style from "@/styles/addpost.module.css";

const VideoContainer = (props: any) => {
  const { data, setData, index } = props;
  const currentImage = data;
  const setCurrentImage = setData;
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const ref = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = function (e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (["video/mp4"].includes(e.dataTransfer.files[0].type))
        setCurrentImage(e.dataTransfer.files[0], index);
      previewFile(e.dataTransfer.files[0]);
    }
  };

  const onButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    ref.current!.click();
  };

  const handleClearImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImage(null, index);
    setPreview(null);
  };

  const handleOnChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (["video/mp4"].includes(e.target.files![0].type))
      setCurrentImage(e.target.files![0], index);
    previewFile(e.target.files![0]);
  };

  const previewFile = (e: any) => {
    const reader = new FileReader();
    const selectedFile = e;
    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
    reader.onload = (readerEvent: any) => {
      setPreview(readerEvent.target.result);
    };
  };

  return currentImage === null ? (
    <label
      htmlFor="upload"
      onDragEnter={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      className={style.imageContainer}
    >
      <span>
        <TiUpload />
      </span>
      <span>Przeciągnij tu plik</span>
      <span>lub</span>
      <button onClick={onButtonClick}>Przeglądaj</button>
      <input
        onDrop={(e) => {
          e.preventDefault();
        }}
        onChange={handleOnChangeImage}
        id="upload"
        ref={ref}
        style={{ display: "none" }}
        type="file"
        multiple={false}
      />
      {dragActive && (
        <div
          id="drag-file-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </label>
  ) : (
    <div className={style.imageContainer}>
      <video src={preview} controls />
      <button onClick={handleClearImage} className={style.changeImage}>
        Zmień
      </button>
    </div>
  );
};

export default VideoContainer;
