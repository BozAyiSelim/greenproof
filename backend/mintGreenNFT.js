// mintGreenNFT.js
const xrpl = require("xrpl");

// Function to mint an NFT based on the given carbon emission value (in kg)
async function mintGreenNFT(carbonKg) {
  // Connect to the XRP Ledger Testnet
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
  await client.connect();

  // Create a wallet instance from a known seed (testnet only)
  const wallet = xrpl.Wallet.fromSeed("sEd7j6PkucGSfqW6RbFSKpDex6LoLBc");

  // Create a metadata string with the carbon emission value
  const metadata = `GreenProof NFT - ${carbonKg} kg CO₂`;

  // Define the NFT minting transaction
  const tx = {
    TransactionType: "NFTokenMint",
    Account: wallet.address,
    URI: Buffer.from(metadata).toString("hex"), // Metadata must be hex-encoded
    Flags: 8, // Standard transferability flag
    NFTokenTaxon: 0 // Category identifier for the NFT (can be used to group NFTs)
  };

  // Automatically fill in necessary fields (e.g., fee, sequence number)
  const prepared = await client.autofill(tx);

  // Sign the transaction with the wallet's private key
  const signed = wallet.sign(prepared);

  // Submit the transaction and wait for it to be confirmed
  const result = await client.submitAndWait(signed.tx_blob);

  // Log transaction hash to the console for debugging or tracking
  console.log("NFT minted successfully.");
  console.log("Transaction Hash:", result.result.hash);

  // Disconnect from the XRPL client
  await client.disconnect();

  // Return the transaction hash so it can be shown to the user
  return result.result.hash;
}

// Export the function so it can be used in other files (e.g., server.js)
module.exports = { mintGreenNFT };
