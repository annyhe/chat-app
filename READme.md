# Real time chat app using Socket.io, Nodejs

- Database: use sqlite for testing. Stores username and messages

TODO
- Extend to make it more slack-like. Ie. @inspiration to get inspirational message, or @imageCat to get image of a cat from unsplash
- UI can be better, ie. make it more obvious who is talking. Anyone other than the current person should be in a separate column
- @quote needs to return parameterized quote, not only random quote, which seems to remain identical from one request to the next
- add API, UI tests

### Learned

**How to create tables in Sqlite3 npm package**

db.run(
  "CREATE TABLE IF NOT EXISTS ChatMessages(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, message text)",
  function() {
    console.log("successful");
  }
);

