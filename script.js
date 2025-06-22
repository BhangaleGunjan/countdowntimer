// Get references to key DOM elements
const addBtn = document.getElementById('addBtn');
const timersContainer = document.getElementById('timers');
const alarm = document.getElementById('alarm');

// Load existing countdowns from localStorage (if any), or initialize an empty array
let countdowns = JSON.parse(localStorage.getItem('countdowns')) || [];

// Save the countdowns array to localStorage
function saveCountdowns() {
  localStorage.setItem('countdowns', JSON.stringify(countdowns));
}

// Format milliseconds into a human-readable time string (dd:hh:mm:ss)
function formatTime(ms) {
  if (ms < 0) ms = 0; // Just in case we get a negative number
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  return `${String(days).padStart(2, '0')}d : ${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s`;
}

// Create and display a single countdown timer block
function createTimer(id, targetTime) {
  // Create container div for timer
  const timerDiv = document.createElement('div');
  timerDiv.className = 'timer';
  timerDiv.id = `timer-${id}`;

  // Create and set the title (e.g. Countdown 1, Countdown 2, etc.)
  const title = document.createElement('h3');
  title.textContent = `Countdown ${timersContainer.children.length + 1}`;

  // Create paragraph element to display the countdown time
  const timeDisplay = document.createElement('p');

  // Create delete button for this timer
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '❌';
  deleteBtn.style.position = 'absolute';
  deleteBtn.style.top = '10px';
  deleteBtn.style.right = '10px';
  deleteBtn.style.background = 'transparent';
  deleteBtn.style.border = 'none';
  deleteBtn.style.fontSize = '18px';
  deleteBtn.style.cursor = 'pointer';
  deleteBtn.title = 'Delete Timer';

  // Delete this timer from the DOM and localStorage when clicked
  deleteBtn.addEventListener('click', () => {
    clearInterval(timerDiv.intervalId); // Stop the countdown interval
    countdowns = countdowns.filter(c => c.id !== id); // Remove from saved array
    saveCountdowns(); // Update localStorage
    timerDiv.remove(); // Remove from the DOM
  });

  // Add all parts to the timer block
  timerDiv.appendChild(deleteBtn);
  timerDiv.appendChild(title);
  timerDiv.appendChild(timeDisplay);
  timersContainer.appendChild(timerDiv);

  // Update the countdown every second
  const updateTimer = () => {
    const now = Date.now();
    const remaining = targetTime - now;

    if (remaining <= 0) {
      // Timer complete
      clearInterval(timerDiv.intervalId);
      timerDiv.classList.add('completed');
      timeDisplay.textContent = "⏰ Time's Up!";
      alarm.play(); // Play alert sound
    } else {
      // Still counting down — update the display
      timeDisplay.textContent = formatTime(remaining);
    }
  };

  updateTimer(); // Run once immediately so there's no delay
  const interval = setInterval(updateTimer, 1000); // Repeat every second
  timerDiv.intervalId = interval; // Save interval ID for clearing later
}

// Rebuild all timers from localStorage when page loads
function loadTimers() {
  timersContainer.innerHTML = ''; // Clear any existing timers
  countdowns.forEach(({ id, target }) => {
    createTimer(id, new Date(target).getTime());
  });
}

// When "Add Countdown" button is clicked:
addBtn.addEventListener('click', () => {
  const datetime = document.getElementById('datetime').value;
  if (!datetime) return alert("Pick a valid date & time!"); // Validation

  const target = new Date(datetime).getTime();
  const now = Date.now();

  if (target <= now) {
    alert("The time must be in the future!"); // Don’t allow past times
    return;
  }

  const id = Date.now(); // Unique identifier based on timestamp
  countdowns.push({ id, target }); // Add to the list
  saveCountdowns(); // Save to localStorage
  createTimer(id, target); // Display it
});

// Load any timers that were saved previously
loadTimers();
