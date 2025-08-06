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

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log("Files to upload:", files);
    if (!files) return;

    const imagePromises = Array.from(files).map(
      (file) =>
        new Promise<{ name: string; blob: Blob | null }>((resolve) => {
          const img = new window.Image();
          img.src = URL.createObjectURL(file);
          img.onload = function () {
            const size = `${img.width}x${img.height}`;
            const type = file.type;
            resolve({
              name: `${size}${type.replace("image/", ".")}`,
              blob: file,
            });
          };
        })
    );
    const images = await Promise.all(imagePromises);
    setImages(images);
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
