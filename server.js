const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let polls = [];

io.on('connection', (socket) => {
  socket.emit('update', { polls: polls.map(poll => ({ ...poll, voters: Array.from(poll.voters) })) });

  socket.on('new-option', (option) => {
      polls.push({ text: option, votes: 0, voters: new Set() });
      io.emit('update', { polls: polls.map(poll => ({ ...poll, voters: Array.from(poll.voters) })) });
  });

  socket.on('vote', (index) => {
      const option = polls[index];
      if (option.voters.has(socket.id)) {
          option.votes--;
          option.voters.delete(socket.id);
      } else {
          option.votes++;
          option.voters.add(socket.id);
      }
      io.emit('update', { polls: polls.map(poll => ({ ...poll, voters: Array.from(poll.voters) })) });
  });

  socket.on('remove-option', (index) => {
      polls.splice(index, 1);
      io.emit('update', { polls: polls.map(poll => ({ ...poll, voters: Array.from(poll.voters) })) });
  });
});


app.use(express.static('public'));

const PORT = process.env.PORT || 5173;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
