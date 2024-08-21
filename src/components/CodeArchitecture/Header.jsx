import React from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import '../../styles/ChatWindowHeader.css';

const Header = ({ isDarkMode, onClearChat, onToggleTheme, onRefresh }) => {
  return (
    <div className='header'>
      <h1>Code Architecture</h1>
      <div className="header-buttons">
        <button className="file-detach" onClick={onRefresh} title='Shift + d'>File Dettach</button>
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
