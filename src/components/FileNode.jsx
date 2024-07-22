// FileNode.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';

const FileNode = ({ node, path }) => {
  const [expanded, setExpanded] = useState(false);

  const downloadFile = (fileContent, fileName) => {
    saveAs(fileContent, fileName);
  };

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

FileNode.propTypes = {
  node: PropTypes.shape({
    type: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.instanceOf(Blob),
    ]).isRequired,
    name: PropTypes.string,
  }).isRequired,
  path: PropTypes.string.isRequired,
};

export default FileNode;
