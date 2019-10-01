# Real time chat app using Socket.io, Nodejs

See it in action! [![Chat app with Express, NodeJS, and socket.io](https://img.youtube.com/vi/K8s_DIN_N8w/0.jpg)](https://www.youtube.com/watch?v=K8s_DIN_N8w)

Overview
- Database: use **sqlite** for testing. Stores username and messages
- Tested on Chrome
- Works with multi-user, concurrent sessions
- Type in **@picIMAGE_QUERY**, **@quote** to get random famous quote, or **@joke** to get random joke

Credit 
- UI based on these React components https://codepen.io/swaibu/pen/OJLZjLb?editors=0010
- socket.io and express setup based on https://itnext.io/build-a-group-chat-app-in-30-lines-using-node-js-15bfe7a2417b

TODO
Refactor database to 2 tables:
1. Users: ID, username text, avatar text. Need this table to remove and add users
2. Messages: ID, user ID or username if unique, message text. Have most fields in this table except for user ID

- UI: show which users are there, to disallow multiple users
- sticky footer, move component outside of chat
- @picCat: on the other side, should not have the blue background
- disallow users with same name to join from the UI, and the database: username needs be unique field
- specific users and avatars for quoteBot, jokeBot, and picBot
- add screenshots to READme
- add API, UI tests

### Setup

1. Git clone this repo

2. Run **npm install**

3. Create a blank **sqliteChatBot.db** at the root of the folder

4. Create tables in Sqlite3. Uncomment this section in **index.js**

```javascript
db.run(
  "CREATE TABLE IF NOT EXISTS ChatMessages(id INTEGER PRIMARY KEY AUTOINCREMENT, username text, message text, avatar text)",  
  () => {
    console.log("successful");
  }
);
```
5. Open two terminal tabs. Fire up the client with **npm run client** in one terminal, and the server with  **node index.js** in another terminal

6. Head over to a browser and enter http://localhost:3000/, then enter your username in the prompt.

7. To join as another user, open another browser tab/window. Enter http://localhost:3000/, enter another username in the prompt.

8. Enter your message and hit **Enter** to send the message to all. You can also type in **@picIMAGE_QUERY**, **@quote** to get random famous quote, or **@joke** to get random joke.
