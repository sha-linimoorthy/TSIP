import React, { useState, useEffect, useRef } from 'react';
import Header from './Header'; 
import Avatar from '@mui/material/Avatar';
import { deepPurple } from '@mui/material/colors';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh'; 
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import '../../styles/ChatWindow.css';
import '../../styles/ChatWindowInputBox.css'

const ChatWindow = ({ onClearChat, onToggleTheme }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showCards, setShowCards] = useState(true);
  const [messages, setMessages] = useState([]);
  const [templateId, setTemplateId] = useState(1); 
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const cardsShown = sessionStorage.getItem('cardsShown');
    if (cardsShown) {
      setShowCards(false);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSend();
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
  }, [isDarkMode, inputText]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ block: 'end', behavior: 'auto' });
    }
  }, [messages]);

  const handleClearChat = () => {
    onClearChat();
    setMessages([]);
    setShowCards(true);
  };

  const toggleDarkMode = (checked) => {
    setIsDarkMode(checked);
    onToggleTheme(checked);
  };

  const cardPrompts = [
    { id: 1, prompt: 'Develop the software architecture documentation for this specified use case'},
    { id: 2, prompt: 'Help me with Code Architecture, Static Code Analysis & Gen test cases'},
    { id: 3, prompt: 'TO - DO' },
    { id: 4, prompt: 'TO - DO' },
  ];

  const handleCardClick = (prompt, id) => {
    if (id === 2) { 
      navigate('/code-implementation');
    } 
    else if(id == 3){
      navigate('/code-implementation');
    }
    else {
      setInputText(prompt);
      setTemplateId(id); 
    }
  };

  const handleRefresh = async (originalPrompt, index) => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({prompt: originalPrompt, template_id: templateId}), 
      });
      const data = await response.json();
      if (response.ok) {
        const newBotMessage = { sender: 'bot', text: data.response, prompt: originalPrompt };
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[index] = newBotMessage;
          return newMessages;
        });
      } else {
        const errorMessage = { sender: 'bot', text: 'An error occurred: ' + data.error, prompt: originalPrompt };
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[index] = errorMessage;
          return newMessages;
        });
      }
    } catch (error) {
      const errorMessage = { sender: 'bot', text: 'An error occurred: ' + error.message, prompt: originalPrompt };
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[index] = errorMessage;
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (showCards) {
      setShowCards(false);
      sessionStorage.setItem('cardsShown', 'true');
    }
    setInputText('');
    if (inputText.trim() === '') {
      return;
    }
    const userMessage = { sender: 'user', text: inputText.trim(), prompt: inputText.trim() };
    setMessages([...messages, userMessage]);
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputText.trim(), template_id: templateId }), 
      });
      const data = await response.json();
      if (response.ok) {
        const botMessage = { sender: 'bot', text: data.response, prompt: inputText.trim() };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        const errorMessage = { sender: 'bot', text: 'An error occurred: ' + data.error, prompt: inputText.trim() };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    } catch (error) {
      const errorMessage = { sender: 'bot', text: 'An error occurred: ' + error.message, prompt: inputText.trim() };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Code copied to clipboard!');
  };

  const downloadAsTxt = (text, filename = 'code.txt') => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
  };

  const renderMessages = () => {
    const defaultMessages = [
      {
        sender: 'bot',
        text: 'Hello! How may I assist you today?',
      },
    ];
    const allMessages = messages.length > 0 ? messages : defaultMessages;
    return allMessages.map((msg, index) => (
      <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
        <div className={`message-box ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
          {msg.sender === 'bot' && (
            <div className="avatar-message-container">
              <div className="avatar-name-time">
                <Avatar sx={{ bgcolor: deepPurple[900] }}>B</Avatar>
                <div className="name-time">
                  <span className="bot-name">Bot</span>
                  <span className="timestamp">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              <div className="user-text">
                <ReactMarkdown
                components={{
                    table: ({ children }) => <table className="custom-table">{children}</table>,
                    th: ({ children }) => <th className="custom-th">{children}</th>,
                    tr: ({ children }) => <tr className="custom-tr">{children}</tr>,
                  }} 
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          )}
          {msg.sender === 'user' && (
            <div className="user-text">
              <ReactMarkdown
                components={{
                    table: ({ children }) => <table className="custom-table">{children}</table>,
                    th: ({ children }) => <th className="custom-th">{children}</th>,
                    tr: ({ children }) => <tr className="custom-tr">{children}</tr>,
                  }} 
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          )}
          {msg.sender === 'bot' && msg.text !== 'Hello! How may I assist you today?' && (
                <div className='code-buttons-container'>
                  <div className='left-buttons'>
                    <button onClick={() => copyToClipboard(msg.text)} className='copyToClipboard' title='Copy to clipboard'>
                      <ContentCopyIcon sx={{ fontSize: 16 }} />
                    </button>
                    <button onClick={() => downloadAsTxt(msg.text)} className='download' title='Download as txt file'>
                      <FileDownloadIcon sx={{ fontSize: 16 }} />
                    </button>
                  </div>
                  <div className='right-buttons'>
                    <button className="refresh" onClick={() => handleRefresh(msg.prompt, index)} title='Regenerate content'>
                      <RefreshIcon sx={{ fontSize: 16 }} />
                    </button>
                  </div>
                </div>
              )}
        </div>
      </div>
    ));
  };

  return (
    <div className="chat-window">
      <Header 
        isDarkMode={isDarkMode} 
        onClearChat={handleClearChat} 
        onToggleTheme={toggleDarkMode}
      />
      <div className="chat-window-messages" style={{ overflowY: 'auto', maxHeight: '500px' }}>
        {renderMessages()}
        {loading && (
          <div className="loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        )}
        {showCards && (
          <div className="cards-container">
            {cardPrompts.map((card) => (
              <div key={card.id} className="card" onClick={() => handleCardClick(card.prompt, card.id)}>
                {card.prompt}
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-box">
        <textarea
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows="1"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button onClick={handleSend} title="Enter key">Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;