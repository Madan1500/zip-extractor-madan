import { useState, useRef } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const ZipExtractor = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await extractFiles(file);
    }
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    if (file) {
      await extractFiles(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const extractFiles = async (file) => {
    setLoading(true);
    const zip = new JSZip();
    const content = await zip.loadAsync(file);

    const extractedFiles = [];
    const promises = [];

    content.forEach((relativePath, zipEntry) => {
      const promise = zipEntry.async("blob").then((fileContent) => {
        extractedFiles.push({ name: zipEntry.name, content: fileContent });
      });
      promises.push(promise);
    });

    await Promise.all(promises);
    setFiles(extractedFiles);
    setLoading(false);
  };

  const downloadFile = (fileContent, fileName) => {
    saveAs(fileContent, fileName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-5">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Zip File Extractor</h1>
        
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current.click()}
          className="border-4 border-dashed border-gray-300 rounded-lg p-6 mb-6 text-center cursor-pointer hover:bg-gray-100"
        >
          <p className="text-gray-500">Drag and drop your ZIP file here, or click to select a file</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".zip"
            className="hidden"
          />
        </div>
        
        {loading && (
          <div className="flex justify-center items-center mb-4">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 11-8 8v-8H4z"
              ></path>
            </svg>
            <p className="text-lg text-gray-700">Loading...</p>
          </div>
        )}
        
        <ul className="mt-4 space-y-3">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-100 to-gray-300 text-gray-900 font-medium rounded-lg shadow-md"
            >
              {file.name}
              <button
                onClick={() => downloadFile(file.content, file.name)}
                className="ml-4 py-1 px-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full hover:bg-blue-600"
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ZipExtractor;
