// mintGreenNFT.js
const xrpl = require("xrpl")

async function mintGreenNFT(carbonKg) {
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
  await client.connect()

  const wallet = xrpl.Wallet.fromSeed("sEd7j6PkucGSfqW6RbFSKpDex6LoLBc")
  const metadata = `GreenProof NFT - ${carbonKg} kg CO₂`

  const tx = {
    TransactionType: "NFTokenMint",
    Account: wallet.address,
    URI: Buffer.from(metadata).toString("hex"),
    Flags: 8,
    NFTokenTaxon: 0
  }

  const prepared = await client.autofill(tx)
  const signed = wallet.sign(prepared)
  const result = await client.submitAndWait(signed.tx_blob)

  console.log("✅ NFT MINTED!")
  console.log("🎯 TX HASH:", result.result.hash)

  await client.disconnect()
  return result.result.hash
}

module.exports = { mintGreenNFT } 
