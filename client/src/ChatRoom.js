import React from 'react'
import { ChatBox } from './UtilComp'
import './chatroom.css'
import openSocket from 'socket.io-client'
const socket = openSocket('http://localhost:8080')
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

/* ChatRoom component - composed of multiple ChatBoxes */
class ChatRoom extends React.Component {
    state = {
        messages: [],
        isTyping: [],
        username: '',
        avatar: '',
    }
    componentDidMount = () => {
        // append the chat text message
        const self = this
        socket.on('chat_message', function(msg) {
            const obj = JSON.parse(msg);
            const {username, message, avatar} = obj
            
            self.sendMessage(username, avatar, message)
            // GET the image
            let tag = FLAG.pic.tag
            if (message.includes(tag)) {
                getImage(message, tag).then(url => {
                    const imageEl = document.createElement('img')
                    imageEl.src = url
                    self.sendMessage(username, avatar, imageEl.outerHTML, true)                    
                })
            }
        })

        socket.on('is_online', function(msg) {
            const obj = JSON.parse(msg);
            const pronoun = self.state.username  === obj.user ? 'You' : obj.user
            const markup = obj.joinOrLeave ? 
            '🔵 <i>' + pronoun + ' joined the chat..</i>' :
             '🔴 <i>' + obj.user + ' left the chat..</i>'
            self.sendMessage(obj.user, obj.url, markup)
            if (obj.joinOrLeave) {
                self.setState({ username, avatar: obj.url || self.state.avatar })            
            }
        })

        socket.on('notify everyone', function(msg) {
            self.sendMessage(self.state.username, self.state.avatar, msg)
        })

        // testing: switch back to '' + Math.random(); 
        const username = prompt('Please tell me your name')
        socket.emit('username', username)
        this.setState({ username })
    }

    /* adds a new message to the chatroom */
    sendMessage = (sender, senderAvatar, message, skipFormatting) => {
        setTimeout(() => {
            let messageFormat = skipFormatting ? message : detectURL(message)
            let newMessageItem = {
                id: this.state.messages.length + 1,
                sender: sender,
                senderAvatar: senderAvatar,
                message: messageFormat,
            }
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
        if (!this.state.username) {
            return <p className='warning'>Please refresh the page and input your name</p>
        }
        let messages = this.state.messages
        let isTyping = this.state.isTyping
        let sendMessage = this.sendMessage
        let typing = this.typing
        let resetTyping = this.resetTyping

        const user = {
            name: this.state.username || 'unamed_watermelon',
            avatar: this.state.avatar,
        }
        return (
            <div className={'chatApp__room'}>
                <ChatBox
                    socket={socket}
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
