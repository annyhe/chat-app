import React, {useState} from 'react'
import openSocket from 'socket.io-client'
import './chatroom.css'
import logo from './logo.svg'
import logoTwo from './logo192.png'
const socket = openSocket('http://localhost:8080')
const USER_AVATAR = logo
const FLAG = {
    pic: { tag: '@pic', url: 'https://source.unsplash.com/random/800x600?' },
}

const getImage = async (msg, tag) => {
    const flagWithQuery = msg.split(' ').filter(word => word.startsWith(tag))[0]

    // query is @picTHIS_PART_OF_STRING
    const category = flagWithQuery.slice(tag.length, flagWithQuery.length)
    let url = FLAG.pic.url + category
    const obj = await fetch(url)
    return obj.url
}

/* detect url in a message and add a link tag */
function detectURL(message) {
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g
    return message.replace(urlRegex, function(urlMatch) {
        return '<a href="' + urlMatch + '">' + urlMatch + '</a>'
    })
}

/* Title component */
function Title({ owner }) {
    return <div className={'chatApp__convTitle'}>{owner}'s display</div>
}

/* InputMessage component - used to type the message */
class InputMessage extends React.Component {
    handleSendMessage = event => {
        event.preventDefault()
        /* Disable sendMessage if the message is empty */
        if (this.messageInput.value.length > 0) {
            socket.emit('chat_message', this.messageInput.value)
            /* Reset input after send*/
            this.messageInput.value = ''
        }
    }
    handleTyping = () => {
        /* Tell users when another user has at least started to write */
        if (this.messageInput.value.length > 0) {
            this.props.typing(this.ownerInput.value)
        } else {
            /* When there is no more character, the user no longer writes */
            this.props.resetTyping(this.ownerInput.value)
        }
    }
    render() {
        /* If the chatbox state is loading, loading class for display */
        let loadingClass = this.props.isLoading
            ? 'chatApp__convButton--loading'
            : ''
        let sendButtonIcon = <span>&#x2709;</span>
        return (
            <form onSubmit={this.handleSendMessage}>
                <input
                    type="hidden"
                    ref={owner => (this.ownerInput = owner)}
                    value={this.props.owner}
                />
                <input
                    type="hidden"
                    ref={ownerAvatar => (this.ownerAvatarInput = ownerAvatar)}
                    value={this.props.ownerAvatar}
                />
                <input
                    type="text"
                    ref={message => (this.messageInput = message)}
                    className={'chatApp__convInput'}
                    placeholder="Text message"
                    onKeyDown={this.handleTyping}
                    onKeyUp={this.handleTyping}
                    tabIndex="0"
                />
                <div
                    className={'chatApp__convButton ' + loadingClass}
                    onClick={this.handleSendMessage}
                >
                    {sendButtonIcon}
                </div>
            </form>
        )
    }
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
function MessageItem({ owner, sender, senderAvatar, message }) {
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

/* ChatRoom component - composed of multiple ChatBoxes */
class ChatRoom extends React.Component {
    state = {
        messages: [],
        isTyping: [],
        username: '',
    }
    componentDidMount = () => {
        // append the chat text message
        const self = this
        socket.on('chat_message', function(msg) {
            const arr = msg.split(':');
            const _msg = arr[1].slice(1)
            let user = arr[0].slice('<strong>'.length, arr[0].length- '</strong>'.length)
            self.sendMessage(user, USER_AVATAR, msg)
            // GET the image
            let tag = FLAG.pic.tag
            if (msg.includes(tag)) {
                getImage(msg, tag).then(url => {
                    const imageEl = document.createElement('img')
                    imageEl.src = url
                    // TODO: make MessageList component handle images
                    self.sendMessage(self.state.username, USER_AVATAR, url)                    
                })
            }
        })

        socket.on('is_online', function(msg) {
            const obj = JSON.parse(msg);
            const markup = obj.joinOrLeave ? 
            '🔵 <i>' + obj.user + ' join the chat..</i>' :
             '🔴 <i>' + obj.user + ' left the chat..</i>'
            
            self.sendMessage(obj.user, USER_AVATAR, markup)
        })

        socket.on('notify everyone', function(msg) {
            self.sendMessage(self.state.username, USER_AVATAR, msg)
        })
        // ask username. disabled for testing
        const username = '' + Math.random(); // prompt('Please tell me your name')
        socket.emit('username', username)
        this.setState({ username })
    }

    /* adds a new message to the chatroom */
    sendMessage = (sender, senderAvatar, message) => {
        setTimeout(() => {
            let messageFormat = detectURL(message)
            let newMessageItem = {
                id: this.state.messages.length + 1,
                sender: sender,
                senderAvatar: senderAvatar,
                message: messageFormat,
            }
            // console.log(message, messageFormat)
            this.setState({
                messages: [...this.state.messages, newMessageItem],
            })
            this.resetTyping(sender)
        }, 400)
    }
    /* updates the writing indicator if not already displayed */
    typing = writer => {
        if (!this.state.isTyping[writer]) {
            let stateTyping = this.state.isTyping
            stateTyping[writer] = true
            this.setState({ isTyping: stateTyping })
        }
    }
    /* hide the writing indicator */
    resetTyping = writer => {
        let stateTyping = this.state.isTyping
        stateTyping[writer] = false
        this.setState({ isTyping: stateTyping })
    }
    render() {
        let messages = this.state.messages
        let isTyping = this.state.isTyping
        let sendMessage = this.sendMessage
        let typing = this.typing
        let resetTyping = this.resetTyping

        const user = {
            name: this.state.username || 'unamed_watermelon',
            avatar: USER_AVATAR,
        }
        return (
            <div className={'chatApp__room'}>
                <ChatBox
                    // TODO: ensure this is unique
                    key={user.name}
                    owner={user.name}
                    ownerAvatar={user.avatar}
                    sendMessage={sendMessage}
                    typing={typing}
                    resetTyping={resetTyping}
                    messages={messages}
                    isTyping={isTyping}
                />
            </div>
        )
    }
}

export default ChatRoom
