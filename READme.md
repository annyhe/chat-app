# Real time chat app using Socket.io, Nodejs

- Database: use sqlite for testing. Stores username and messages

TODO
- Extend to make it more slack-like. Ie. @inspiration to get inspirational message, or @imageCat to get image of a cat from unsplash
- convert jQuery on the front to React
- UI can be better, ie. make it more obvious who is talking. Anyone other than the current person should be in a separate column
- no react
- no tests

### Learned

**How to create tables in Sqlite3 npm package**

db.run(
  "CREATE TABLE IF NOT EXISTS ChatMessages(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, message text)",
  function() {
    console.log("successful");
  }
);

