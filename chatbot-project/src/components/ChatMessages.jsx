import { useRef, useEffect } from 'react'
import { ChatMessage } from './ChatMessage';
import './ChatMessages.css'


function useAutoScroll(chatMessages) {
    // It's highly recommend to rename this to something
    // more generic like containerRef. This will make the
    // code make more sense if we ever reuse this code in
    // other components.
    const containerRef = useRef(null);

    useEffect(() => {
        const containerElem = containerRef.current;
        if (containerElem) {
            containerElem.scrollTop = containerElem.scrollHeight;
        }
    }, [chatMessages]);

    return containerRef;

}


function ChatMessages({ chatMessages }) {
    // const chatMessagesRef = React.useRef(null);
    const chatMessagesRef = useAutoScroll([chatMessages]);

    // React.useEffect(() => {
    //     const containerElem = chatMessagesRef.current;
    //     if (containerElem) {
    //         containerElem.scrollTop = containerElem.scrollHeight;
    //     }
    // }, [chatMessages]);

    return (
        <div className="chat-messages-container" ref={chatMessagesRef}>
            {chatMessages.map((chatMessage) => {
                if (!chatMessage?.id) return null;
                return (
                    <ChatMessage
                        message={chatMessage.message}
                        sender={chatMessage.sender}
                        time={chatMessage.time}
                        key={chatMessage.id}
                    />
                );
            })}
        </div>
    );
}

export default ChatMessages;