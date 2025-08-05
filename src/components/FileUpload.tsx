import "../App.css";
import { useState } from "react";

interface CSVUploadProps {
  setImages: (images: { name: string; blob: Blob | null }[]) => void;
}

export default function FileUpload({ setImages }: CSVUploadProps) {
  const [numFiles, setNumFiles] = useState<number>(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    setNumFiles(files.length);
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const images: { name: string; blob: Blob | null }[] = [];
    const files = event.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      var size, type;
      var file = files[i];
      if (file) {
        var img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = function () {
          console.log("Image loaded with size:", img.width, img.height);
          size = `${img.width}x${img.height}`;
          console.log("Image size:", size);
          type = file.type;
          console.log("File type:", type);
          console.log("File ending:", `${size}${type.replace("image/", ".")}`);
          images.push({
            name: `${size}${type.replace("image/", ".")}`,
            blob: file,
          });
        };
      }
      setImages(images);
    }
  };

  return (
    <div className="csv-upload">
      {numFiles ? <h2>{numFiles} files uploaded</h2> : <h2>Upload Creative</h2>}
      <input
        type="file"
        accept=".png,.jpg,.jpeg,.gif"
        multiple={true}
        onChange={(e) => {
          handleChange(e);
          handleUpload(e);
        }}
      />
    </div>
  );
}
