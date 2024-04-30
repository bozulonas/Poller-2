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
    const audio = new Audio('/30008__thanvannispen__stone_on_stone_impact_loud1_05.mp3');
        audio.play()
          .then(() => console.log("Audio played successfully"))
          .catch(e => console.error("Failed to play audio:", e));
}

function vote(index) {
    socket.emit('vote', index);
    const audio = new Audio('/30008__thanvannispen__stone_on_stone_impact_loud1_05.mp3');
        audio.play()
          .then(() => console.log("Audio played successfully"))
          .catch(e => console.error("Failed to play audio:", e));
}

function removeOption(index) {
    socket.emit('remove-option', index);
    const audio = new Audio('/30008__thanvannispen__stone_on_stone_impact_loud1_05.mp3');
        audio.play()
          .then(() => console.log("Audio played successfully"))
          .catch(e => console.error("Failed to play audio:", e));
}
