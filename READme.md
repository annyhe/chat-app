# Real time chat app using Socket.io, Nodejs

- Database: use **sqlite** for testing. Stores username and messages
- Tested on Chrome
- Works with multi-user, concurrent sessions
- Type in @picIMAGE_QUERY, @quote to get random famous quote, or @joke to get random joke

TODO
- UI can be better, ie. make it more obvious who is talking. Anyone other than the current person should be in a separate column
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
5. Open two terminal tabs. Fire up the client with **npm run client** in one terminal, and the server with  **node index.js**

6. Head over to a browser and enter http://localhost:3000/, then your username

7. To join as another user, open another browser tab/window. Enter http://localhost:3000/, enter another username

8. Enter your message and hit **Enter** to send the message to all. You can also type in **@picIMAGE_QUERY**, **@quote** to get random famous quote, or **@joke** to get random joke
