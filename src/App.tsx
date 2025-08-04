import { useState, useEffect } from "react";
import "./App.css";
import Dropdown from "./components/Dropdown";
import CopyAlert from "./components/CopyAlert";
import FileUpload from "./components/FileUpload";
import { updateFileName } from "./utils/supabase";

function App() {
  const [folder, setFolder] = useState<string>("");
  const [client, setClient] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [fileType, setFileType] = useState<string>("");
  const [imageSize, setImageSize] = useState<[number, number]>([0, 0]);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [creativeName, setCreativeName] = useState<string>("");

  useEffect(() => {
    if (
      !imageSize ||
      !client ||
      !imageSize[0] ||
      !imageSize[1] ||
      !fileType ||
      !creativeName
    ) {
      setFolder("");
      return;
    }
    setFolder(client + `_${creativeName}` + `_${imageSize[0]}x${imageSize[1]}`);
    console.log(`Folder path: ${folder}`);
  }, [client, imageSize, fileType, creativeName]);

  const downloadImage = () => {
    if (!imageBlob) {
      alert("No CSV data to download.");
      return;
    }
    updateFileName(folder + ".png");
    const url = URL.createObjectURL(imageBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = folder + fileType.replace("image/", ".");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowModal(true);
  };

  return (
    <>
      <img src="/logo.png" alt="Logo" className="logo" />
      <FileUpload
        setImageSize={setImageSize}
        setFileType={setFileType}
        setImageBlob={setImageBlob}
      />
      <Dropdown onChange={setClient} type="clients" />
      <Dropdown onChange={setCreativeName} type="creative" client={client} />
      <button
        disabled={!imageSize || !fileType || !client}
        onClick={() => {
          try {
            navigator.clipboard.writeText(folder);
            downloadImage();
          } catch (err) {
            console.error("Failed to copy: ", err);
            alert(`Failed to copy path: ${folder}`);
          }
          setShowModal(false);
          setTimeout(() => setShowModal(false), 2000);
        }}
      >
        {folder == "" ? "Complete All Fields" : folder}
      </button>
      {showModal && <CopyAlert />}
    </>
  );
}

export default App;
