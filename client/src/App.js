import React, { useEffect } from 'react'
import './App.css'
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

function App() {
    useEffect(() => {
        // append the chat text message
        socket.on('chat_message', function(msg) {
            const listEl = document.createElement('li')
            listEl.innerHTML = msg
            document.getElementById('messages').appendChild(listEl)
            // GET the image
            let tag = FLAG.pic.tag
            if (msg.includes(tag)) {
                getImage(msg, tag).then(url => {
                    const imageEl = document.createElement('img')
                    imageEl.src = url
                    document.getElementById('messages').appendChild(imageEl)
                })
            }
        })

        // append text if someone is online
        socket.on('is_online', function(username) {
            const listEl = document.createElement('li')
            listEl.innerHTML = username
            document.getElementById('messages').appendChild(listEl)
        })

        socket.on('notify everyone', function(msg) {
            console.log('got new message')
            const listEl = document.createElement('li')
            listEl.innerHTML = msg
            document.getElementById('messages').appendChild(listEl)
        })
        // ask username
        const username = prompt('Please tell me your name')
        socket.emit('username', username)
    }, [])

    const onSubmitForm = e => {
        e.preventDefault() // prevents page reloading
        socket.emit('chat_message', document.getElementById('txt').value)
        document.getElementById('txt').value = ''
        return false
    }

    return (
        <div className="App">
            <ul id="messages"></ul>
            <form action="/" method="POST" onSubmit={onSubmitForm}>
                <input
                    id="txt"
                    autoComplete="off"
                    autoFocus="on"
                    // onInput="isTyping()"
                    placeholder="type your message here..."
                />
                <button>Send</button>
            </form>
        </div>
    )
}

export default App
