import ClipboardIcon from "../assets/clipboard-outline.svg";

const CopyAlert = () => {
  return (
    <div className="copy-alert">
      <img src={ClipboardIcon} alt="Clipboard Icon" />
      <p>Copied to clipboard!</p>
    </div>
  );
};

export default CopyAlert;
