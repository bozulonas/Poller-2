const socket = io();
const pollsElement = document.getElementById('polls');
const optionInput = document.getElementById('option-input');
let userVotes = new Set();  // Track user's votes on client-side

socket.on('update', ({ polls }) => {
  pollsElement.innerHTML = '';
  polls.forEach((poll, index) => {
      const pollElement = document.createElement('li');
      pollElement.textContent = `${poll.text} (${poll.votes})`;

      const voteButton = document.createElement('span');
      voteButton.textContent = '+';
      voteButton.className = poll.voters.includes(socket.id) ? 'vote voted' : 'vote';
      voteButton.onclick = () => vote(index);

      const removeButton = document.createElement('span');
      removeButton.textContent = 'X';
      removeButton.className = 'remove';
      removeButton.onclick = () => removeOption(index);

      pollElement.appendChild(voteButton);
      pollElement.appendChild(removeButton);
      pollsElement.appendChild(pollElement);
  });
});


function submitOption() {
    const option = optionInput.value;
    socket.emit('new-option', option);
    optionInput.value = '';
}

function vote(index) {
    socket.emit('vote', index);
}

function removeOption(index) {
    socket.emit('remove-option', index);
}
