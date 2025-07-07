import { useState, useEffect } from "react";
import "./App.css";
import Dropdown from "./components/Dropdown";
import CopyAlert from "./components/CopyAlert";
import CSVUpload from "./components/CSVUpload";
import { toMMDDYY } from "./utils/dates";
import Checkbox from "./components/Checkbox";
import { updateFileName } from "./utils/supabase";

function App() {
  const [folder, setFolder] = useState<string>("");
  const [audience, setAudience] = useState<string>("");
  const [client, setClient] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [numRows, setNumRows] = useState<number>(0);
  const [staffers, setStaffers] = useState<boolean>(false);
  const [select, setSelect] = useState<boolean>(false);
  const [updated, setUpdated] = useState<boolean>(false);
  const [adUpload, setAdUpload] = useState<boolean>(false);
  const [csvString, setCsvString] = useState<string>("");

  const date = toMMDDYY(new Date());

  useEffect(() => {
    if (!audience || !numRows || !client) {
      setFolder("");
      return;
    }
    setFolder(
      client +
        "_" +
        (adUpload ? "Direct_" : "") +
        (select ? "Select" : "") +
        audience +
        (staffers ? "AndStaff" : "") +
        (updated ? "_Updated" : "") +
        "_" +
        numRows +
        "_" +
        date
    );
    console.log(`Folder path: ${folder}`);
  }, [audience, numRows, client, staffers, select, updated, adUpload]);

  useEffect(() => {
    console.log(csvString);
  }, [csvString]);

  const downloadCsv = () => {
    if (!csvString) {
      alert("No CSV data to download.");
      return;
    }
    updateFileName(folder + ".csv");
    const csvData = new Blob([csvString], { type: "text/csv" });
    const csvUrl = URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = csvUrl;
    link.download = folder + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <img src="/logo.png" alt="Logo" className="logo" />
      <CSVUpload setRowCount={setNumRows} setCsvString={setCsvString} />
      <Dropdown onChange={setAudience} type="audiences" />
      <Dropdown onChange={setClient} type="clients" />
      <Checkbox
        label="Includes Staffers?"
        checked={staffers}
        onChange={setStaffers}
      />
      <Checkbox label="Select Group?" checked={select} onChange={setSelect} />
      <Checkbox label="Updated List?" checked={updated} onChange={setUpdated} />
      <Checkbox
        label="Direct Upload to Ad Platform (bypassing LiveRamp)?"
        checked={adUpload}
        onChange={setAdUpload}
      />
      <button
        disabled={!audience || !numRows || !client}
        onClick={() => {
          try {
            navigator.clipboard.writeText(folder);
            downloadCsv();
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
