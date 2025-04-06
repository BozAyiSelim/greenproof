// Backend API endpoint for CO₂ calculation
const API_URL = "http://localhost:3000/calculate-co2";

// Function triggered when the user submits the form
async function getCarbon() {
  // Retrieve input values from the form, defaulting to 0 if empty
  const carKm = parseFloat(document.getElementById("carKm").value) || 0;
  const meatKg = parseFloat(document.getElementById("meatKg").value) || 0;
  const electricityKwh = parseFloat(document.getElementById("electricityKwh").value) || 0;
  const flightHours = parseFloat(document.getElementById("flightHours").value) || 0;
  const naturalGasM3 = parseFloat(document.getElementById("naturalGasM3").value) || 0;

  // Estimate total carbon footprint using approximate conversion factors (kg CO₂)
  const carbonEstimate =
    carKm * 0.192 +            // Car travel emissions per kilometer
    meatKg * 27 +              // Meat consumption emissions per kilogram
    electricityKwh * 0.4 +     // Electricity usage emissions per kWh
    flightHours * 90 +         // Flight emissions per hour
    naturalGasM3 * 2.2;        // Natural gas usage emissions per cubic meter

  // Determine the user's performance category and a corresponding message
  let medal, comment;
  if (carbonEstimate <= 250) {
    medal = "Gold";
    comment = "Excellent! Your carbon footprint is very low. You're a planet hero!";
  } else if (carbonEstimate <= 350) {
    medal = "Silver";
    comment = "Good job, but there is room for improvement.";
  } else {
    medal = "Bronze";
    comment = "Your footprint is a bit high. Small changes can make a difference.";
  }

  // Send the carbon data to the backend API
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ distance: carbonEstimate }), // Consider renaming "distance" to something more accurate
    });

    // Handle failed requests
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Display the carbon footprint result along with the evaluation
    const resultBox = document.getElementById("result");
    resultBox.style.display = "block";
    resultBox.innerHTML = `
      <div>
        CO₂: <strong>${data.carbon_kg.toFixed(2)} kg</strong><br>
        <span style="font-size:1.5em;">${medal}</span><br>
        ${comment}<br>
        ${data.message}
      </div>
    `;

    // If a transaction hash is returned (e.g. for an NFT), show the transaction link and enable the copy button
    if (data.tx_hash) {
      resultBox.innerHTML += `
        <br><strong>NFT Transaction:</strong>
        <br><a href="https://testnet.xrpl.org/transactions/${data.tx_hash}" target="_blank">
          ${data.tx_hash}
        </a>
      `;
      const copyBtn = document.getElementById("copyBtn");
      copyBtn.style.display = "inline-block";
      copyBtn.dataset.hash = data.tx_hash;
    } else {
      document.getElementById("copyBtn").style.display = "none";
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("result").innerText = "An error occurred while calculating your carbon footprint.";
  }
}

// Copies the transaction hash to the user's clipboard
function copyTx() {
  const hash = document.getElementById("copyBtn").dataset.hash;

  if (hash) {
    navigator.clipboard.writeText(hash)
      .then(() => alert("Transaction hash copied to clipboard."))
      .catch(() => alert("Failed to copy transaction hash."));
  } else {
    alert("No transaction hash available to copy.");
  }
}
