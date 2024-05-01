const socket = io();
const pollsElement = document.getElementById('polls');
const optionInput = document.getElementById('option-input');
let userVotes = new Set();  // Track user's votes on client-side

socket.on('update', ({ polls }) => {
  pollsElement.innerHTML = ''; // Clear existing poll elements
  polls.forEach((poll, index) => {
      const pollElement = document.createElement('li');

      // Button container for voting and removal buttons
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'button-container';

      // Create the vote button
      const voteButton = document.createElement('span');
      voteButton.textContent = '💰'; // Emoji for the button
      voteButton.className = poll.voters.includes(socket.id) ? 'vote voted' : 'vote';
      voteButton.onclick = () => vote(index); // Attach event handler for voting
      buttonContainer.appendChild(voteButton);

      // Create the remove button
      const removeButton = document.createElement('span');
      removeButton.textContent = '☠️'; // Emoji for the button
      removeButton.className = 'remove';
      removeButton.onclick = () => removeOption(index); // Attach event handler for removing an option
      buttonContainer.appendChild(removeButton);

      // Append button container to the poll element first
      pollElement.appendChild(buttonContainer);

      // Create the poll text element
      const pollText = document.createElement('span');
      pollText.id = `poll-text-${index}`; // Unique ID for each poll text
      pollText.className = 'poll-text';

      // Create the visual representation of votes
      const votesRepresentation = '💰'.repeat(poll.votes);

      // Combine the text and vote emojis
      pollText.textContent = `${poll.text} ${votesRepresentation}`;
      pollElement.appendChild(pollText);

      // Append the poll element to the polls container in the DOM
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
  const pollText = document.querySelector(`#poll-text-${index}`);
  pollText.classList.add('animate__animated', 'animate__shakeX');

  // Optional: Remove the animation class after it's done to allow re-animation if needed
  pollText.addEventListener('animationend', () => {
      pollText.classList.remove('animate__animated', 'animate__shakeX');
  });

  const audio = new Audio('/630018__flem0527__singular-coin-dropping.wav');
  audio.play()
      .then(() => console.log("Audio played successfully"))
      .catch(e => console.error("Failed to play audio:", e));
}




function removeOption(index) {
    socket.emit('remove-option', index);
    const audio = new Audio('/trimmed_audio_648969__atomediadesign__dying.wav');
        audio.play()
          .then(() => console.log("Audio played successfully"))
          .catch(e => console.error("Failed to play audio:", e));
}

optionInput.addEventListener('keypress', function(event) {
  if (event.key === "Enter") {
      event.preventDefault();  // Prevent the default form submit behavior
      submitOption();
  }
});