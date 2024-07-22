// ZipExtractor.jsx
import { useState, useRef } from 'react';
import JSZip from 'jszip';
import FileNode from './FileNode';

const ZipExtractor = () => {
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
    setError(null);
    const zip = new JSZip();

    try {
      const content = await zip.loadAsync(file);
      const extractedFiles = {};
      const promises = [];

      content.forEach((relativePath, zipEntry) => {
        const pathParts = relativePath.split('/');
        const fileName = pathParts.pop();
        let currentDir = extractedFiles;

        pathParts.forEach((part) => {
          if (!currentDir[part]) {
            currentDir[part] = { type: 'directory', content: {} };
          }
          currentDir = currentDir[part].content;
        });

        if (!zipEntry.dir) {
          const promise = zipEntry.async('blob').then((fileContent) => {
            currentDir[fileName] = { type: 'file', content: fileContent, name: zipEntry.name };
          });
          promises.push(promise);
        }
      });

      await Promise.all(promises);
      setFiles(extractedFiles);
    } catch (err) {
      setError('Failed to extract ZIP file.');
    }

    setLoading(false);
  };

  return (
    <div className=" flex items-center justify-center p-4">
      <div className="bg-white rounded-md shadow-md p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Zip File Extractor</h1>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current.click()}
          className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
          aria-label="Drag and drop your ZIP file here, or click to select a file"
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
          <div className="flex justify-center items-center mt-4">
            <svg
              className="animate-spin h-5 w-5 text-blue-600"
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
            <p className="ml-2 text-lg text-gray-700">Loading...</p>
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-600">{error}</div>
        )}

        <div className="mt-4 space-y-2">
          {Object.keys(files).length > 0 && (
            <FileNode node={{ type: 'directory', content: files }} path="Root" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ZipExtractor;
