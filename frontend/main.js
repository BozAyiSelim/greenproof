async function getCarbon() {
  const carKm = parseFloat(document.getElementById("carKm").value) || 0
  const meatKg = parseFloat(document.getElementById("meatKg").value) || 0
  const electricityKwh = parseFloat(document.getElementById("electricityKwh").value) || 0
  const flightHours = parseFloat(document.getElementById("flightHours").value) || 0
  const naturalGasM3 = parseFloat(document.getElementById("naturalGasM3").value) || 0

  
  const carbonEstimate =
    carKm * 0.192 +
    meatKg * 27 +
    electricityKwh * 0.4 +
    flightHours * 90 +
    naturalGasM3 * 2.2

  const response = await fetch("http://localhost:3000/calculate-co2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ distance: carbonEstimate }) 
  })

  const data = await response.json()

  const resultBox = document.getElementById("result")
  resultBox.innerText = `CO₂: ${data.carbon_kg.toFixed(2)} kg\n${data.message}`

  if (data.tx_hash) {
    resultBox.innerHTML += `
      <br><strong>NFT TX:</strong>
      <br><a href="https://testnet.xrpl.org/transactions/${data.tx_hash}" target="_blank">
        ${data.tx_hash}
      </a>
    `
    document.getElementById("copyBtn").style.display = "inline-block"

  
  }
}

function copyTx() {
  const match = document.getElementById("result").innerText.match(/NFT TX:\s*(\w+)/)
  const hash = match ? match[1] : null

  if (hash) {
    navigator.clipboard.writeText(hash)
    alert("✅ TX hash copied to clipboard!")
  } else {
    alert("❌ No TX hash found to copy.")
  }
}
