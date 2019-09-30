const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const sqlite3 = require("sqlite3").verbose();
const path = require('path');
const DB_PATH = "./sqliteChatBot.db";

let db = new sqlite3.Database(DB_PATH, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the " + DB_PATH + " SQlite database.");
}); 

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname+'/views/index.html'));
    //__dirname : It will resolve to your project folder. 
});

app.use(express.static(path.join(__dirname, '../views')));

io.sockets.on("connection", function(socket) {
  socket.on("username", function(username) {
    socket.username = username;
    io.emit("is_online", "🔵 <i>" + socket.username + " join the chat..</i>");
  });

  socket.on("disconnect", function() {
    io.emit("is_online", "🔴 <i>" + socket.username + " left the chat..</i>");
  });

  socket.on("chat_message", function(message) {
    io.emit(
      "chat_message",
      "<strong>" + socket.username + "</strong>: " + message
    );
    db.run(
      `INSERT INTO ChatMessages(username, message) VALUES(?, ?)`,
      [socket.username, message],
      function(error) {
        if (error) {
          console.log(error);
        } else {
          console.log("Insert successful. # of Row Changes: " + this.changes);
        }
      }
    );
  });
});

const server = http.listen(8080, function() {
  console.log("listening on *:8080");
});

process.on("SIGINT", () => {
  db.close(err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Close the database connection.");
  });
  server.close();
});
