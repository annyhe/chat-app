import React, { useEffect } from 'react'
import openSocket from 'socket.io-client';
import './App.css'
const  socket = openSocket('http://localhost:8080');

function App() {
    useEffect(() => {
        // append the chat text message
        socket.on('chat_message', function(msg) {
            const listEl = document.createElement('li')
            listEl.innerHTML = msg
            document.getElementById('messages').appendChild(listEl)
        });

        // append text if someone is online
        socket.on('is_online', function(username) {
            const listEl = document.createElement('li')
            listEl.innerHTML = username
            document.getElementById('messages').appendChild(listEl)
        });

        // ask username
        const username = prompt('Please tell me your name')
        socket.emit('username', username)
    })
    const onSubmitForm = e => {
        e.preventDefault() // prevents page reloading
        socket.emit('chat_message', document.getElementById('txt').value)
        document.getElementById('txt').value = ''
        return false
    }
    return (
        <div className="App">
            <ul id="messages"></ul>
            <form
                action="/"
                method="POST"
                onSubmit={onSubmitForm}
            >
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
