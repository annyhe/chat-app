import React, {useState} from 'react'
import InputMessage from './InputMessage'

/* Title component */
function Title({ owner }) {
    return <div className={'chatApp__convTitle'}>Welcome {owner}!</div>
}

/* MessageList component - contains all messages */
function MessageList({ owner, messages }) {
    return (
        <div className={'chatApp__convTimeline'}>
            {messages
                .slice(0)
                .reverse()
                .map(messageItem => (
                    <MessageItem
                        key={messageItem.id}
                        owner={owner}
                        sender={messageItem.sender}
                        senderAvatar={messageItem.senderAvatar}
                        message={messageItem.message}
                    />
                ))}
        </div>
    )
}

/* MessageItem component - composed of a message and the sender's avatar */
// TODO: make className optional for div.chatApp__convMessageValue
function MessageItem({ owner, sender, senderAvatar, message }) {
    console.log(message, senderAvatar)
    /* message position formatting - right if I'm the author */
    let messagePosition =
        owner === sender
            ? 'chatApp__convMessageItem--right'
            : 'chatApp__convMessageItem--left'
    return (
        <div
            className={
                'chatApp__convMessageItem ' + messagePosition + ' clearfix'
            }
        >
            <img
                src={senderAvatar}
                alt={sender}
                className="chatApp__convMessageAvatar"
            />
            <div
                className="chatApp__convMessageValue"
                dangerouslySetInnerHTML={{ __html: message }}
            />
        </div>
    )
}

/* ChatBox component - composed of Title, MessageList, InputMessage */
function ChatBox({
    owner,
    messages,
    ownerAvatar,
    sendMessage,
    typing,
    resetTyping,
    socket,
}) {
    const [isLoading, setIsLoading] = useState(false);
    /* catch the sendMessage signal and update the loading state then continues the sending instruction */
    const sendMessageLoading = (sender, senderAvatar, message) => {
        setIsLoading(true)
        sendMessage(sender, senderAvatar, message)
        setTimeout(() => {
            setIsLoading(false)
        }, 400)
    }
    return (
        <div className={'chatApp__conv'}>
            <Title owner={owner} />
            <MessageList owner={owner} messages={messages} />
            <div className={'chatApp__convSendMessage clearfix'}>
                <InputMessage
                    socket={socket}
                    isLoading={isLoading}
                    owner={owner}
                    ownerAvatar={ownerAvatar}
                    sendMessage={sendMessage}
                    sendMessageLoading={sendMessageLoading}
                    typing={typing}
                    resetTyping={resetTyping}
                />
            </div>
        </div>
    )
}

// export each for test-ability
export  { Title, MessageList, MessageItem, ChatBox };