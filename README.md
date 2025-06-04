# 🌐 Web Based HD Wallet

A secure, web-based wallet for generating and managing hierarchical deterministic (HD) wallets on multiple blockchains (**Solana & Ethereum**) from a single mnemonic phrase.  
**Create, view, and manage multiple addresses with ease—all in your browser.**

---

## ✨ Features

- 🔑 **Mnemonic-based Wallet Generation:**  
  Create a new 12-word mnemonic phrase (BIP39) and derive unlimited wallets.

- 🔗 **Multi-Chain Support:**  
  Instantly generate **Solana** (ed25519) and **Ethereum** (secp256k1) addresses from the same seed.

- 💼 **Wallet Management:**  
  - View and copy public/private keys for each wallet (with private key reveal/hide & warnings).
  - Create additional wallets with deterministic, incremented derivation paths.

- 💰 **Balance Checking:**  
  Instantly fetch the balance of any selected Solana or Ethereum wallet using public RPC endpoints.

- 🛡️ **Security Focused:**  
  - Mnemonic and private keys are handled only in the browser—**never sent to any server**.
  - Strong warnings & safe UI patterns to protect your keys.

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Er-luffy-D/web_wallet.git
cd web_wallet
npm install
```

### 2. Set Environment Variables

Create a `.env` file (or set in your environment):

```env
VITE_SOLANA_URL=https://api.mainnet-beta.solana.com
VITE_ETHERIUM_URL=https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID
```

You can use any public/mainnet/testnet RPC endpoints supported by Solana/Ethereum.

### 3. Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

---

## 📝 Usage

1. **Create New Wallet:**  
   Click "Create New Wallet" to generate a new mnemonic and your first wallet.

2. **Show/Hide Mnemonic:**  
   Reveal your 12-word recovery phrase. **Write it down and store it securely!**

3. **Add Wallet:**  
   Generate additional wallets, each with unique addresses for both chains.

4. **View & Copy Keys:**  
   Click on wallets to select them, show/hide private keys, and copy keys if needed.

5. **Fetch Balance:**  
   Select a wallet and click "Fetch Balance" to see current funds on Solana or Ethereum.

---

## ⚠️ Security Notice

- **Never share your mnemonic or private keys.**
- This is a client-side tool. All key generation and wallet management happens in your browser.
- Use only on trusted devices, and never enter your real mainnet mnemonic if unsure.

---

## 🛠️ Tech Stack

- **React + TypeScript**
- **TailwindCSS** for styling
- **Redux** for lightweight state management
- **bip39, ed25519-hd-key, tweetnacl, @solana/web3.js, ethers** for cryptography
- **Axios** for RPC requests

---

## 📚 Derivation Paths

- **Solana:** `m/44'/501'/account'/0'`
- **Ethereum:** `m/44'/60'/account'/0/0`

Each additional wallet increments the `account` index.

---

## 📄 License

MIT License

---

## 👤 Author

[Er-luffy-D](https://github.com/Er-luffy-D)

---

> **Disclaimer:**  
> This project is for educational and self-custody wallet demo purposes.  
> Use at your own risk. The author is not responsible for any loss of funds.
