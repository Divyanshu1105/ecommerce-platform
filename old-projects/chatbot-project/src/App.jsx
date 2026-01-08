import { useState, useEffect } from 'react'
import { Chatbot } from 'supersimpledev';
import { ChatInput } from './components/ChatInput'
import ChatMessages from './components/ChatMessages';
import './App.css'

function App() {
  // const [chatMessages, setChatMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem('messages');
    return saved ? JSON.parse(saved) : [];
  });
  // const [chatMessages, setChatMessages] = array; // we are doing array destructuring and order matters
  // const chatMessages = array[0]; // the current data
  // const setChatMessages = array[1]; // updater function

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(chatMessages));
  }, [chatMessages]);


  return (
    <div className="app-container">
      {chatMessages.length === 0 && (
        <p
          className="welcome-message"
        >
          Welcome to the chatbot project! Send a message using the textbox below.
        </p>
      )}
      <ChatMessages
        chatMessages={chatMessages}
      />
      <ChatInput
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
      />
    </div>
  );

}

export default App
