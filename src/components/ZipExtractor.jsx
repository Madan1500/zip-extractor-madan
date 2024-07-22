import { useState, useRef } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import PropTypes from 'prop-types';

const ZipExtractor = () => {
  const [files, setFiles] = useState({});
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
    setLoading(false);
  };

  const downloadFile = (fileContent, fileName) => {
    saveAs(fileContent, fileName);
  };

  const FileNode = ({ node, path }) => {
    const [expanded, setExpanded] = useState(false);

    if (node.type === 'directory') {
      return (
        <div className="ml-4">
          <div
            className="cursor-pointer text-gray-700 font-medium"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? '📂' : '📁'} {path}
          </div>
          {expanded && (
            <div className="ml-4">
              {Object.keys(node.content).map((key) => (
                <FileNode key={key} node={node.content[key]} path={key} />
              ))}
            </div>
          )}
        </div>
      );
    }

    FileNode.propTypes = {
      node: PropTypes.shape({
        type: PropTypes.string.isRequired,
        content: PropTypes.oneOfType([
          PropTypes.object,
          PropTypes.instanceOf(Blob),
        ]),
        name: PropTypes.string,
      }).isRequired,
      path: PropTypes.string.isRequired,
    };

    return (
      <div className="ml-4 flex justify-between items-center p-2 bg-gray-100 text-gray-900 font-medium rounded-md">
        {path}
        <button
          onClick={() => downloadFile(node.content, node.name)}
          className="ml-4 py-1 px-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-md shadow-md p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Zip File Extractor</h1>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current.click()}
          className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
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
