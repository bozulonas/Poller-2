const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let polls = [];

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
      console.log("Received request from origin:", origin); // Log the origin
      const allowedOrigins = ['https://enigmatic-forest-34660-55d56228b54e.herokuapp.com',
       'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://www.owlbear.rodeo'];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);  // Allow
      } else {
          callback(new Error('CORS not allowed from this origin'), false);  // Disallow
      }
  }
};

// Use CORS middleware
app.use(cors(corsOptions));

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
