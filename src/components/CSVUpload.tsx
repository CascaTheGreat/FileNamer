import "../App.css";
import { useState } from "react";
import { uploadFile } from "../utils/supabase";

interface CSVUploadProps {
  setRowCount: (count: number) => void;
  setCsvString?: (csv: string) => void;
}

export default function CSVUpload({
  setRowCount,
  setCsvString,
}: CSVUploadProps) {
  const [file, setFile] = useState<File>();
  const reader = new FileReader();

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
      console.log("creating reader");

      reader.onload = function (e) {
        const csvOutput = e.target?.result;
        if (csvOutput) {
          if (setCsvString) {
            setCsvString(csvOutput as string);
          }
          //horrific regex to count rows in csv, accounts for commas and new lines in quotes
          //https://stackoverflow.com/a/2953007
          var rows = (csvOutput as string).match(
            /(?:"(?:[^"]|"")*"|[^,\n]*)(?:,(?:"(?:[^"]|"")*"|[^,\n]*))*\n/g
          );
          if (rows) {
            setRowCount(rows.length);
          } else {
            setRowCount(0);
            throw new Error("No rows found in CSV");
          }
        }
      };

      reader.readAsText(file);
      uploadFile(file, file.name)
        .then((data) => {
          console.log("File uploaded successfully:", data);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  };

  return (
    <div className="csv-upload">
      {file ? <h2>{file.name}</h2> : <h2>Upload CSV File</h2>}
      <input
        type="file"
        accept=".csv"
        onChange={(e) => {
          handleOnChange(e);
          handleUpload(e);
        }}
      />
    </div>
  );
}
