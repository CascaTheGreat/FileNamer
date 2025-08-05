import { useState, useEffect } from "react";
import "./App.css";
import Dropdown from "./components/Dropdown";
import CopyAlert from "./components/CopyAlert";
import FileUpload from "./components/FileUpload";

function App() {
  const [folder, setFolder] = useState<string>("");
  const [client, setClient] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [creativeName, setCreativeName] = useState<string>("");
  const [images, setImages] = useState<{ name: string; blob: Blob | null }[]>(
    []
  );

  useEffect(() => {
    if (!images || !client || !creativeName) {
      setFolder("");
      return;
    }
    setFolder(client + `_${creativeName}_`);
    console.log(`Folder path: ${folder}`);
  }, [client, creativeName]);

  const downloadImages = () => {
    if (!images.length) {
      alert("No creative data to download.");
      return;
    }
    for (const image of images) {
      if (!image.blob) continue;

      const url = URL.createObjectURL(image.blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = folder + image.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setShowModal(true);
    }
  };

  return (
    <>
      <img src="/logo.png" alt="Logo" className="logo" />
      <FileUpload setImages={setImages} />
      <Dropdown onChange={setClient} type="clients" />
      <Dropdown onChange={setCreativeName} type="creative" client={client} />
      <button
        disabled={!images || !client || !creativeName}
        onClick={() => {
          try {
            downloadImages();
          } catch (err) {
            console.error("Failed to download: ", err);
            alert(`Failed to download: ${folder}`);
          }
          setShowModal(false);
          setTimeout(() => setShowModal(false), 2000);
        }}
      >
        {folder == "" ? "Complete All Fields" : "Download Creative"}
      </button>
      {showModal && <CopyAlert />}
    </>
  );
}

export default App;
