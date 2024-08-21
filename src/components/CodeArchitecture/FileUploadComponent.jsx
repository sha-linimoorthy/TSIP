import React, { useState, useRef, useEffect } from 'react';
import mammoth from 'mammoth';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const FileUploadComponent = ({ onFileUpload, clearFile}) => {
    const [fileContent, setFileContent] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target.result;
            mammoth.extractRawText({ arrayBuffer: arrayBuffer })
                .then((result) => {
                    setFileContent(result.value);
                    onFileUpload(result.value);
                })
                .catch((error) => {
                    console.error('Error reading DOCX file:', error);
                });
        };
        reader.readAsArrayBuffer(file);
    };

    const handleTextAreaChange = (e) => {
        const content = e.target.value;
        setFileContent(content);
        onFileUpload(content); 
    };

    useEffect(() => {
        if(clearFile){
            fileInputRef.current.value = '';
        }
    }, [clearFile]);

    return (
        <div className="code-arch-input-box">
            <textarea
                className="code-arch-input"
                rows={10}
                value={fileContent}
                onChange={handleTextAreaChange}
                readOnly
            />
            <label className="code-arch-file-upload-button">
                <input
                    type="file"
                    accept=".docx, .txt, .py, .pdf"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }} 
                />
                <AttachFileIcon />
            </label>
        </div>
    );
};

export default FileUploadComponent;
