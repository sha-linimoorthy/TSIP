import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ChatWindow from './components/LandPage/ChatWindow';
import CodeImplementationPage from './components/CodeArchitecture/CodeArchitecture';
import MarkdownPage from './components/MarkdownPage';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);
  const [theme, setTheme] = useState('light');

  const handleSend = async (message) => {
    setMessages([...messages, { sender: 'user', text: message }]);
    try {
      const response = await axios.post('/api/message', { message });
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: response.data.message },
      ]);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: 'Error: Unable to get response' },
      ]);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleToggleTheme = (checked) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className={`app ${theme}`}>
        <div className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <ChatWindow
                  onClearChat={handleClearChat}
                  onToggleTheme={handleToggleTheme}
                  messages={messages}
                  onSend={handleSend}
                />
              }
            />
            <Route path="/markdown" element={<MarkdownPage />} />
            <Route path="/code-implementation" element={<CodeImplementationPage onClearChat={handleClearChat} onToggleTheme={handleToggleTheme} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
