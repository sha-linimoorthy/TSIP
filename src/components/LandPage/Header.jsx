import React from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import '../../styles/ChatWindowHeader.css';

const Header = ({ isDarkMode, onClearChat, onToggleTheme }) => {
  return (
    <div className='header'>
      <h1>Coder Pro</h1>
      <div className="header-buttons">
        <button className="clear-chat" onClick={onClearChat} title="Shift + c">Clear Chat</button>
        <DarkModeSwitch
          title="Shift + m"
          className="toggle-theme"
          checked={isDarkMode}
          onChange={onToggleTheme}
          size={32}
        />
      </div>
    </div>
  );
};

export default Header;
