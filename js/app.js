console.log('I am running!');

// Constants for daily goals (Close and Open for each day)
const dailyGoals = {
  close: [16.9, 15.9, 13.9, 11.9, 8.9, 6.9], // Monday through Saturday Close Goals
  open: [21.9, 18.9, 16.9, 14.9, 11.9]       // Saturday → Monday Open Goals
};

// Event Listener for Calculate button
document.getElementById("calculate").addEventListener("click", function () {
  // Retrieve user inputs
  const aor = parseFloat(document.getElementById("aor").value); // Active accounts (AOR)
  const pastDue = parseFloat(document.getElementById("pastDue").value); // Current Past Due percentage
  let openDue = parseFloat(document.getElementById("nowDue").value); // Optional: Current Now Due percentage

  // Validate inputs (ensure we have numbers)
  if (isNaN(aor) || isNaN(pastDue)) {
    alert("Please enter valid numeric values for AOR and Past Due %.");
    return;
  }

  // Default Open Due (optional input) to equal Past Due if not provided
  if (isNaN(openDue)) {
    openDue = pastDue;
  }

  // Determine the current day of the week (0 = Sunday, ..., 6 = Saturday)
  const today = new Date().getDay();

  // Obtain today's Close Goal and Open Goal for tomorrow
  const closeGoal = today === 0 ? dailyGoals.close[5] : dailyGoals.close[today - 1]; // Sunday uses Saturday's Close Goal
  const openGoal = today >= 6 ? dailyGoals.open[0] : dailyGoals.open[today]; // Saturday → Monday Open Goal

  // Calculate Cards Needed for Close
  const cardsForClose = Math.ceil(((pastDue - closeGoal) * aor) / 100);

  // Calculate Cards Needed for Open
  const cardsForOpen = Math.ceil(((openDue - openGoal) * aor) / 100);

  // Calculate the Roll Percentage (difference between Now Due and Past Due)
  const rollPercentage = openDue - pastDue;
  const cardsForRoll = Math.ceil(rollPercentage * (aor / 100)); // Cards impacted by the Roll percentage

  // Maximum Roll Allowed (10% of AOR in cards)
  const maxRollPercentage = 10; // 10% max allowed roll
  const maxRollCards = Math.ceil(maxRollPercentage * (aor / 100));

  // Roll Difference (determines if we exceed the 10% max roll limit)
  let rollDifference = Math.ceil(cardsForRoll - maxRollCards);

  // Ensure rollDifference doesn't show negative numbers
  if (rollDifference < 0) {
    rollDifference = 0;
  }

  // Update the results in the interface
  document.getElementById("result").innerHTML = `
    <p>You have <strong>${cardsForClose > 0 ? cardsForClose : 0}</strong> cards remaining to hit today's goal of <strong>${closeGoal}%</strong>.</p>
    
    <p>You have <strong>${cardsForOpen > 0 ? cardsForOpen : 0}</strong> cards remaining to hit tomorrow's open goal of <strong>${openGoal}%</strong>.</p>
    
    <p>Roll: <strong>${rollPercentage.toFixed(2)}%</strong> 
       (<strong>${cardsForRoll}</strong> cards)</p>
    <p>10% of the current AOR of <strong>${aor}</strong> is <strong>${maxRollCards}</strong> cards.</p>
    <p>${rollDifference > 0 
      ? `<strong>${rollDifference}</strong> cards are needed to have the roll be under 10%!` 
      : `You are within the allowable roll percentage!`
    }</p>
  `;
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
      navigator.serviceWorker
          .register('./sw.js') // Register the service worker located in the root directory
          .then(function (registration) {
              console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch(function (error) {
              console.error('Service Worker registration failed:', error);
          });
  });
}
