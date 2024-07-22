import { useState, useRef } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const ZipCompressor = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const handleCompress = async () => {
    setLoading(true);
    const zip = new JSZip();
    
    files.forEach(file => {
      const folderPath = file.webkitRelativePath ? file.webkitRelativePath.split('/').slice(0, -1).join('/') : '';
      const folder = folderPath ? zip.folder(folderPath) : zip;
      folder.file(file.name, file);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'compressed.zip');
    setLoading(false);
  };

  return (
    <div className="min-h-screen md:min-w-[50%] flex items-center justify-center p-4">
      <div className="bg-white rounded-md shadow-md p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Zip File Compressor</h1>
        <div
          onClick={() => fileInputRef.current.click()}
          className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
        >
          <p className="text-gray-500">Click to select files and folders</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            webkitdirectory=""
            multiple
            className="hidden"
          />
        </div>

        {files.length > 0 && (
          <button
            onClick={handleCompress}
            className="w-full py-2 mt-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Compress Files
          </button>
        )}

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
            <p className="ml-2 text-lg text-gray-700">Compressing...</p>
          </div>
        )}
        
        {files.length > 0 && (
          <ul className="mt-4 space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 bg-gray-100 text-gray-900 font-medium rounded-md"
              >
                {file.webkitRelativePath || file.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ZipCompressor;
