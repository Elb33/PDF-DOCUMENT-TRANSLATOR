import React, { useState } from "react";
import "./App.css";
import pdfjsLib from "pdfjs-dist/build/pdf";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
// import { TextField, Button, Select, MenuItem } from "@mui/material/styles";

// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

const App = () => {
  const [file, setFile] = useState(null);
  const [inputLanguage, setInputLanguage] = useState("en");
  const [outputLanguage, setOutputLanguage] = useState("es");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleInputLanguageChange = (event) => {
    setInputLanguage(event.target.value);
  };

  const handleOutputLanguageChange = (event) => {
    setOutputLanguage(event.target.value);
  };

  const handleTranslate = async () => {
    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = async () => {
        const pdfData = new Uint8Array(reader.result);
        const doc = await pdfjsLib.getDocument(pdfData).promise;
        const numPages = doc.numPages;

        let translatedText = "";
        for (let i = 1; i <= numPages; i++) {
          const page = await doc.getPage(i);
          const textContent = await page.getTextContent();
          const text = textContent.items.map((item) => item.str).join(" ");
          const response = await fetch(
            `https://api.openai.com/v1/translations/latest`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization:
                  "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",
              },
              body: JSON.stringify({
                text: text,
                source_language: inputLanguage,
                target_language: outputLanguage,
              }),
            }
          );
          const data = await response.json();
          translatedText += data.translations[0].translated_text;
        }

        const translatedPdf = pdfMake.createPdf({
          content: [{ text: translatedText }],
        });
        translatedPdf.download("translated-document.pdf");
      };
    } else {
      alert("Please select a PDF file.");
    }
  };

  return (
    <div className="translatorField">
      {/* <h2>Testing Testing</h2> */}
      <TextField
        className="importField"
        type="file"
        onChange={handleFileChange}
      />
      <br />
      <Select
        className="currentLanguage"
        value={inputLanguage}
        onChange={handleInputLanguageChange}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="fr">French</MenuItem>
      </Select>
      <Select
        className="targetLanguage"
        value={outputLanguage}
        onChange={handleOutputLanguageChange}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="fr">French</MenuItem>
      </Select>
      <Button className="translate" onClick={handleTranslate}>
        Translate
      </Button>
    </div>
  );
};

export default App;
