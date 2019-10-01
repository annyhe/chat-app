const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const DB_PATH = './sqliteChatBot.db'
const fetch = require('node-fetch')
const JOKE_URL = 'https://icanhazdadjoke.com/'
const QUOTE_URL = 'http://quotes.rest/qod.json?category='

// images are fetched on client-side, since on server-side unsplash requires API key
const FLAG = {
    joke: '@joke',
    quote: '@quote',
}
let db = new sqlite3.Database(DB_PATH, err => {
    if (err) {
        return console.error(err.message)
    }
    console.log('Connected to the ' + DB_PATH + ' SQlite database.')
})

app.get('/', function(req, res) {
    res.send(path.join(__dirname + '/index.html'))
})

app.use(express.static('public'))

io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username
        io.emit(
            'is_online',
            '🔵 <i>' + socket.username + ' join the chat..</i>'
        )
    })

    socket.on('disconnect', function() {
        io.emit(
            'is_online',
            '🔴 <i>' + socket.username + ' left the chat..</i>'
        )
    })

    socket.on('chat_message', function(message) {
        io.emit(
            'chat_message',
            '<strong>' + socket.username + '</strong>: ' + message
        )

        let url = ''
        let callback // will be a function
        if (message.includes(FLAG.quote)) {
            const flagWithQuery = message
                .split(' ')
                .filter(word => word.startsWith(FLAG.quote))[0]
            // query is @picTHIS_PART_OF_STRING
            const category = flagWithQuery.slice(
                FLAG.quote.length,
                flagWithQuery.length
            )
            console.log('GET quote with', category)
            url = QUOTE_URL + category
            callback = json => {
                /* Sample error
                { error:
                    { code: 429,
                        message:
                        'Too Many Requests: Rate limit of 10 requests per hour exceeded. Please wait for 58 minutes and 49 seconds.' } }
                */
                if (json.hasOwnProperty('error')) {
                    console.log(
                        'GET Quote failed. Error is',
                        json.error.message
                    )
                } else {
                    const { quote, author } = json.contents.quotes[0]
                    io.emit("notify everyone", quote + ' By ' + author)                    
                }
            }
        } else if (message.includes(FLAG.joke)) {
            url = JOKE_URL
            callback = (json) => {
                if (json.status === 200) {
                    // console.log(json.joke)
                    io.emit("notify everyone", json.joke)                    
                } else {
                    console.log('GET joke failed.')
                }
                
            }
        }

        if (url.length) {
            fetch(url, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then(res => res.json())
                .then(callback)
                .catch(console.log)
        }

        db.run(
            `INSERT INTO ChatMessages(username, message) VALUES(?, ?)`,
            [socket.username, message],
            function(error) {
                if (error) {
                    console.log(error)
                } else {
                    console.log(
                        'Insert successful. # of Row Changes: ' + this.changes
                    )
                }
            }
        )
    })
})

const server = http.listen(8080, function() {
    console.log('listening on *:8080')
})

process.on('SIGINT', () => {
    db.close(err => {
        if (err) {
            return console.error(err.message)
        }
        console.log('Close the database connection.')
    })
    server.close()
})
