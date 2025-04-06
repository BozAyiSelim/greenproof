// Import required modules
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { mintGreenNFT } = require("./mintGreenNFT"); // Function to mint an NFT based on CO₂ data

// Initialize the Express app
const app = express();

// Enable CORS for cross-origin requests
app.use(cors());

// Parse incoming JSON request bodies
app.use(bodyParser.json());

// POST endpoint for CO₂ calculation and optional NFT minting
app.post("/calculate-co2", async (req, res) => {
  try {
    const { distance } = req.body;

    // Estimate CO₂ emissions based on distance (kg CO₂)
    const carbonKg = parseFloat(distance);

    let nftTxHash = null;

    // Only mint an NFT if carbon emissions are below threshold
    if (carbonKg < 400) {
      nftTxHash = await mintGreenNFT(carbonKg);
    }

    // Send back the carbon data, message, and optional transaction hash
    res.json({
      carbon_kg: carbonKg,
      message: carbonKg < 400
        ? "NFT minted successfully."
        : "CO₂ too high, NFT was not minted.",
      tx_hash: nftTxHash
    });
  } catch (error) {
    // Log and return server error if something goes wrong
    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
