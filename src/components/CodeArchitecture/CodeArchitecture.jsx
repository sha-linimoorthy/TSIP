import React, { useState, useEffect, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import { deepPurple } from '@mui/material/colors';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import ReactMarkdown from 'react-markdown';
import Header from './Header'; 
import '../../styles/CodeArchitecture.css';
import '../../styles/CodeArchInputBox.css'
import FileUploadComponent from './FileUploadComponent';
import FileDownloadMenu from './FileDownload';

const CodeImplementationPage = ({ onClearChat, onToggleTheme }) => {
  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState('Generate Code');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDownloadMenuVisible, setIsDownloadMenuVisible] = useState(false); 
  const [clearFile, setClearFile] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleDownloadMenu = () =>{
    setIsDownloadMenuVisible(!isDownloadMenuVisible);
  }

  const handleFileRefresh = () =>{
    window.location.reload();
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
      } else if (event.shiftKey && event.key.toLowerCase() === 'c') {
        handleClearChat();
      } else if (event.shiftKey && event.key.toLowerCase() === 'm') {
        toggleDarkMode(!isDarkMode);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDarkMode]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleClearChat = () => {
    onClearChat();
    setMessages([]);
    setTextInput('');
    setClearFile(true);
  };

  const toggleDarkMode = (checked) => {
    setIsDarkMode(checked);
    onToggleTheme(checked);
  };

  const handleButtonClick = async (action) => {
    console.log(action)
    console.log(textInput)
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/generate/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileContent: textInput, action}), 
      });
  
      const result = await response.json();
      console.log('Response JSON:', result);
      if (response.ok) {
        const botMessage = {
          sender: 'bot',
          text: result.response || 'No result found',
          prompt: action,
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setTextInput('');
      } else {
        const errorMessage = {
          sender: 'bot',
          text: 'Failed to process action',
          prompt: action,
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
        setTextInput('');
      }
    } catch (error) {
      const errorMessage = {
        sender: 'bot',
        text: `Error processing ${action}: ${error.message}`,
        prompt: action,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Code copied to clipboard!');
  };

  const handleRefresh = async (originalPrompt, index) => {
    if (!textInput.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/generate/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileContent: textInput, action: originalPrompt }),
      });

      const result = await response.json();
      if (response.ok) {
        const newBotMessage = {
          sender: 'bot',
          text: result.response,
          prompt: originalPrompt,
        };
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[index] = newBotMessage;
          return newMessages;
        });
      } else {
        const errorMessage = {
          sender: 'bot',
          text: 'Failed to process action',
          prompt: originalPrompt,
        };
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[index] = errorMessage;
          return newMessages;
        });
      }
    } catch (error) {
      const errorMessage = {
        sender: 'bot',
        text: `Error processing ${originalPrompt}: ${error.message}`,
        prompt: originalPrompt,
      };
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[index] = errorMessage;
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  const renderMessages = () => {
    return messages.map((msg, index) => (
      <div key={index} className={`code-arch-message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
        <div className={`code-arch-message-box ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
          {msg.sender === 'bot' && (
            <div className="code-arch-avatar-message-container">
              <div className="code-arch-avatar-name-time">
                <Avatar sx={{ bgcolor: deepPurple[900] }}>B</Avatar>
                <div className="code-arch-name-time">
                  <span className="code-arch-bot-name">Bot</span>
                  <span className="code-arch-timestamp">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              <div className="code-arch-user-text">
                <ReactMarkdown
                  components={{
                    table: ({ children }) => <table className="code-arch-custom-table">{children}</table>,
                    th: ({ children }) => <th className="code-arch-custom-th">{children}</th>,
                    tr: ({ children }) => <tr className="code-arch-custom-tr">{children}</tr>,
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
              {msg.sender === 'bot' && (
                <div className='code-arch-buttons-container'>
                  <div className='code-arch-left-buttons'>
                    <button onClick={() => copyToClipboard(msg.text)} className='code-arch-copyToClipboard' title='Copy to clipboard'>
                      <ContentCopyIcon sx={{ fontSize: 16 }} />
                    </button>
                    <div>
                    <button onClick={toggleDownloadMenu} className='code-arch-download' title='Download as txt file'>
                       <FileDownloadIcon sx={{ fontSize: 16 }} />
                    {isDownloadMenuVisible && <FileDownloadMenu text={msg.text} />}
                    </button>
                  </div>
                  </div>
                  <div className='code-arch-right-buttons'>
                    <button className="code-arch-refresh" onClick={() => handleRefresh(msg.prompt, index)} title='Regenerate response'>
                      <RefreshIcon sx={{ fontSize: 16 }} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {msg.sender === 'user' && (
            <div className="code-arch-user-text">{msg.text}</div>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="code-arch-implementation-page">
      <Header 
        isDarkMode={isDarkMode} 
        onRefresh={handleFileRefresh}
        onClearChat={handleClearChat} 
        onToggleTheme={toggleDarkMode}
      />
      <div className="code-arch-messages-container">
        {renderMessages()}
        {loading && (
          <div className="code-arch-loading-animation">
            <span className="code-arch-dot"></span>
            <span className="code-arch-dot"></span>
            <span className="code-arch-dot"></span>
          </div>
        )}
        <div ref={messagesEndRef} />
        <div className='code-arch-buttons'>
          <FileUploadComponent 
            textInput={textInput}
            onTextInputChange={setTextInput}
            selectedAction={selectedAction}
            onSelectedActionChange={setSelectedAction}
            onButtonClick={handleButtonClick}
            onFileUpload={(content) => {
              console.log('File content Received', content);
            setTextInput(content);
            }}
            clearFile ={clearFile}
          />
        <select 
            value={selectedAction} 
            onChange={(e) => setSelectedAction(e.target.value)} 
            className="code-arch-dropdown">
            <option value="Generate Code">Generate Code</option>
            <option value="Static Analysis">Static Analysis</option>
            <option value="Generate Test Cases">Generate Test Cases</option>
        </select>
        <button 
            onClick={() => handleButtonClick(selectedAction)} 
            className="code-arch-send-button">Send
        </button>
        </div>
      </div>
      </div>
  );
};

export default CodeImplementationPage;
