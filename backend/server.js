const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const { mintGreenNFT } = require("./mintGreenNFT")

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.post("/calculate-co2", async (req, res) => {
  try {
    const { distance } = req.body
    const carbonKg = parseFloat(distance) * 0.192 

    let nftTxHash = null
    if (carbonKg < 500) {
      nftTxHash = await mintGreenNFT(carbonKg)
    }

    res.json({
      carbon_kg: carbonKg,
      message: carbonKg < 500
        ? "🚀 NFT minted successfully!"
        : "CO₂ yüksek, NFT mintlenmedi.",
      tx_hash: nftTxHash
    })
  } catch (error) {
    console.error("🔥 SERVER ERROR:", error)
    res.status(500).json({ error: "Server error" })
  }
})

const PORT = 3000
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`))
