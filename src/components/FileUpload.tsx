import "../App.css";
import { useState } from "react";
import ad_sizes from "../assets/ad_sizes.json";

interface CSVUploadProps {
  setImageSize: (size: [number, number]) => void;
  setFileType: (type: string) => void;
  setImageBlob: (blob: Blob | null) => void;
}

export default function FileUpload({
  setImageSize,
  setFileType,
  setImageBlob,
}: CSVUploadProps) {
  const [file, setFile] = useState<File>();

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setFile(event.target.files[0]);
      console.log(event.target.files[0]);
    }
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (file) {
      var img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = function () {
        console.log("Image loaded with size:", img.width, img.height);
        setImageSize([img.width, img.height]);
      };
      // get the file type
      setFileType(file.type);
      setImageBlob(file);
    }
  };

  return (
    <div className="csv-upload">
      {file ? <h2>{file.name}</h2> : <h2>Upload Creative</h2>}
      <input
        type="file"
        accept=".png,.jpg,.jpeg,.gif"
        onChange={(e) => {
          handleOnChange(e);
          handleUpload(e);
        }}
      />
    </div>
  );
}
