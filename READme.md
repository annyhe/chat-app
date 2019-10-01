# Real time chat app using Socket.io, Nodejs

Overview
- Database: use **sqlite** for testing. Stores username and messages
- Tested on Chrome
- Works with multi-user, concurrent sessions
- Type in **@picIMAGE_QUERY**, **@quote** to get random famous quote, or **@joke** to get random joke

Credit 
- UI based on these React components https://codepen.io/swaibu/pen/OJLZjLb?editors=0010
- socket.io and express setup based on https://itnext.io/build-a-group-chat-app-in-30-lines-using-node-js-15bfe7a2417b

TODO
- 'joined the chat' should be on the other side, unless is owner
- add URL column for avatar on sqlite table
- make input expand to entire width of the box
- make MessageList component handle images  
- avatar: change to random, non-gender specific 
- add screenshots to READme
- add API, UI tests

### Setup

1. Git clone this repo

2. Run **npm install**

3. Create a blank **sqliteChatBot.db** at the root of the folder

4. Create tables in Sqlite3. Uncomment this section in **index.js**

```javascript
db.run(
  "CREATE TABLE IF NOT EXISTS ChatMessages(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, message text)",
  function() {
    console.log("successful");
  }
);
```
5. Open two terminal tabs. Fire up the client with **npm run client** in one terminal, and the server with  **node index.js** in another terminal

6. Head over to a browser and enter http://localhost:3000/, then enter your username in the prompt.

7. To join as another user, open another browser tab/window. Enter http://localhost:3000/, enter another username in the prompt.

8. Enter your message and hit **Enter** to send the message to all. You can also type in **@picIMAGE_QUERY**, **@quote** to get random famous quote, or **@joke** to get random joke.
