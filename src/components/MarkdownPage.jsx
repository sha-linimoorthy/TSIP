import React, { useState } from 'react';
import MarkdownEditor from '@uiw/react-markdown-editor';

const MarkdownPage = () => {
  const [content, setContent] = useState('');
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handlePostRequest = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputValue }), // Ensure the key matches what the server expects
      });

      if (!response.ok) {
        throw new Error('Failed to post data');
      }

      const data = await response.json();
      setContent(data.response); 
      console.log('Data posted successfully:', data);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Markdown Editor</h1>
      <MarkdownEditor
        value={content}
        onChange={(editor, data, value) => setContent(value)}
      />
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter text to post"
          style={{ marginRight: '10px' }}
        />
        <button onClick={handlePostRequest}>Submit</button>
      </div>
    </div>
  );
};

export default MarkdownPage;
