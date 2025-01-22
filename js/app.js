console.log('I am running!');

// Constants for daily goals (Close and Open for each day)
const dailyGoals = {
  close: [16.9, 15.9, 13.9, 11.9, 8.9, 6.9],
  open: [21.9, 18.9, 16.9, 14.9, 11.9]
};

// === Tab Switching Logic ===
const tabs = document.querySelectorAll(".tab");
const tabPanes = document.querySelectorAll(".tab-pane");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    // Remove "active" class from all tabs and tab panes
    tabs.forEach(t => t.classList.remove("active"));
    tabPanes.forEach(p => p.classList.remove("active"));

    // Add "active" class to the clicked tab and relevant pane
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

// === Daily Goals Calculator ===
document.getElementById("calculate").addEventListener("click", function () {
  const aor = parseFloat(document.getElementById("aor").value);
  const pastDue = parseFloat(document.getElementById("pastDue").value);
  let openDue = parseFloat(document.getElementById("nowDue").value);

  if (isNaN(aor) || isNaN(pastDue)) {
    alert("Please enter valid numeric values for AOR and Past Due %.");
    return;
  }

  if (isNaN(openDue)) openDue = pastDue;

  const today = new Date().getDay();
  const closeGoal = today === 0 ? dailyGoals.close[5] : dailyGoals.close[today - 1];
  const openGoal = today >= 6 ? dailyGoals.open[0] : dailyGoals.open[today];

  const cardsForClose = Math.ceil(((pastDue - closeGoal) * aor) / 100);
  const cardsForOpen = Math.ceil(((openDue - openGoal) * aor) / 100);

  const rollPercentage = openDue - pastDue;
  const cardsForRoll = Math.ceil(rollPercentage * (aor / 100));
  const maxRollCards = Math.ceil((10 * aor) / 100);

  let rollDifference = Math.ceil(cardsForRoll - maxRollCards);
  if (rollDifference < 0) rollDifference = 0;

  document.getElementById("result").innerHTML = `
    <p>You have <strong>${cardsForClose > 0 ? cardsForClose : 0}</strong> cards remaining to hit today's goal of <strong>${closeGoal}%</strong>.</p>
    <p>You have <strong>${cardsForOpen > 0 ? cardsForOpen : 0}</strong> cards remaining to hit tomorrow's open goal of <strong>${openGoal}%</strong>.</p>
    <p>Roll: <strong>${rollPercentage.toFixed(2)}%</strong> 
       (<strong>${cardsForRoll}</strong> cards)</p>
    <p>10% of the current AOR of <strong>${aor}</strong> is <strong>${maxRollCards}</strong> cards.</p>
    <p>${rollDifference > 0 
      ? `<strong>${rollDifference}</strong> cards are needed to have the roll be under 10%!` 
      : ``
    }</p>
  `;
});

// === Cost Calculator ===
document.getElementById("calculate-cost").addEventListener("click", function () {
  const price = parseFloat(document.getElementById("price").value);
  const clubToggle = document.getElementById("club-toggle").checked; // Check if "Club" toggle is ON
  const CLUB_COST = 3.17; // Additional weekly Club cost
  const SALES_TAX_RATE = 1.06; // Sales tax (6%)
  const WEEKLY_MULTIPLIER = 1.1; // 10% LDW
  const MONTHLY_MULTIPLIER = 4.345; // Weeks in a month

  if (isNaN(price)) {
    alert("Please enter a valid price.");
    return;
  }

  // 1. Calculate the weekly price with LDW and sales tax
  const weeklyPrice = price * WEEKLY_MULTIPLIER; // Price + LDW
  const weeklyPriceWithTax = weeklyPrice * SALES_TAX_RATE; // Add sales tax

  // 2. Add Club cost (if toggle is ON) AFTER calculating LDW and tax
  const weeklyFinalPrice = clubToggle
    ? weeklyPriceWithTax + CLUB_COST
    : weeklyPriceWithTax;

  // 3. Calculate bi-weekly and monthly prices
  const biWeeklyFinalPrice = weeklyFinalPrice * 2; // Bi-weekly = weekly * 2
  const monthlyFinalPrice = weeklyFinalPrice * MONTHLY_MULTIPLIER; // Monthly = weekly * multiplier

  // Update output in the interface
  document.getElementById("cost-result").innerHTML = `
    <p>Weekly: <strong>$${weeklyFinalPrice.toFixed(2)}</strong></p>
    <p>Bi-Weekly:<strong>$${biWeeklyFinalPrice.toFixed(2)}</strong></p>
    <p>Monthly: <strong>$${monthlyFinalPrice.toFixed(2)}</strong></p>
  `;
});