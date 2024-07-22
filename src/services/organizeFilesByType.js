import JSZip from 'jszip';

export const organizeFilesByType = async (file, setProgress) => {
  const zip = new JSZip();
  const content = await zip.loadAsync(file);
  const organizedFiles = {};
  const totalFiles = Object.keys(content.files).length;
  let processedFiles = 0;

  const promises = [];

  const processFile = async (relativePath, zipEntry) => {
    const fileType = zipEntry.name.split('.').pop();
    const pathParts = relativePath.split('/');
    if (pathParts.length > 1 && pathParts[0] === 'C-C++ Internship Cognifyz') {
      relativePath = pathParts.slice(1).join('/');
    }

    if (!organizedFiles[fileType]) {
      organizedFiles[fileType] = new JSZip();
    }

    if (!zipEntry.dir) {
      const fileContent = await zipEntry.async('blob');
      organizedFiles[fileType].file(relativePath, fileContent);
      processedFiles++;
      setProgress(Math.round((processedFiles / totalFiles) * 100));
    } else {
      processedFiles++;
      setProgress(Math.round((processedFiles / totalFiles) * 100));
    }
  };

  content.forEach((relativePath, zipEntry) => {
    promises.push(processFile(relativePath, zipEntry));
  });

  await Promise.all(promises);
  return organizedFiles;
};
