import React, { useState } from 'react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import '../../styles/CodeArchitectureFileDownload.css';

const downloadAsTxt = (text, filename = 'code.txt') => {
  const element = document.createElement('a');
  const file = new Blob([text], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

const downloadAsDocx = async (text, filename = 'code.docx') => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun(text),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const element = document.createElement('a');
  element.href = url;
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(url);
};

const FileDownloadMenu = ({ text }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const handleMouseEnter = () => setIsMenuVisible(true);
  const handleMouseLeave = () => setIsMenuVisible(false);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative', display: 'inline-block' }}>
      {isMenuVisible && (
        <div className='code-arch-download-button'>
          <button
            onClick={() => downloadAsTxt(text, 'code.txt')}
            style={{ display: 'block', padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer' }}
          >
            .txt
          </button>
          <button
            onClick={() => downloadAsDocx(text, 'code.docx')}
            style={{ display: 'block', padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer' }}
          >
            .docx
          </button>
        </div>
      )}
    </div>
  );
};

export default FileDownloadMenu;
