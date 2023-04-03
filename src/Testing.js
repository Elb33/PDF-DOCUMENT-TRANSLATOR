import React, { useState } from "react";
import "./Testing.css";

const Testing = () => {
  const [file, setFile] = useState();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="mainContent">
      <div className="pdfFileInput">
        <input type="file" onChange={handleFileChange} className="selectPdf" />
        {/* <button className="selectPdf">Browse</button> */}
        {/* <h2>Select A PDF Document...</h2> */}
      </div>
      <div className="languageSelect">
        <select
          className="currentLanguage"
          name="currentLanguage"
          id="currentLanguage"
        >
          <option value="en">English</option>
          <option value="fr">French</option>
        </select>

        <select
          className="targetLanguage"
          name="targetLanguage"
          id="targetLanguage"
        >
          <option value="fr">French</option>
          <option value="en">English</option>
        </select>
      </div>
      <div className="pdfFileOutput">
        <button className="downloadPdf">Download</button>
        <h2>Here Is Your Translated PDF Document...</h2>
      </div>
      <div>
        <div>{file && `${file.name} - ${file.type}`}</div>

        <button>Upload</button>
      </div>
      );
    </div>
  );
};

export default Testing;
