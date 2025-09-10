# Walee Chain Contract Interaction Demo

A web application that allows users to interact with a smart contract deployed on Walee Chain (Chain ID: 713714).

## Features

- **MetaMask Wallet Connection**: Connect your MetaMask wallet to the application
- **Add Walee Network**: One-click button to add Walee Chain network to MetaMask
- **Store Value**: Input a numeric value and store it on the blockchain
- **Retrieve Value**: Retrieve the currently stored value from the contract
- **Transaction Tracking**: View transaction hashes after successful operations
- **Modern UI**: Beautiful, responsive interface with loading states

## Contract Details

- **Contract Address**: `0x458e93d88F737fD7c6A290d0d1622FfDF3411D26`
- **Chain ID**: `713714` (Walee Chain)
- **Functions**:
  - `store(uint256 num)`: Store a numeric value
  - `retrieve()`: Retrieve the stored value

## Setup Instructions

1. **Install Node.js** (if not already installed)
   - Download from [nodejs.org](https://nodejs.org/)

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Server**
   ```bash
   npm start
   ```

4. **Open the Application**
   - Navigate to `http://localhost:3001` in your browser

## Usage Instructions

1. **Add Walee Network** (Optional)
   - Click "Add Walee Network" button in the top right corner
   - This will add Walee Chain to your MetaMask networks
   - Network details: RPC URL: `https://evm.walee.pk`, Explorer: `https://evmexplorer.walee.pk/`

2. **Connect Wallet**
   - Click "Connect MetaMask" button
   - Approve the connection in MetaMask
   - The app will automatically switch to Walee Chain (Chain ID: 713714)

3. **Store a Value**
   - Enter a numeric value in the input field
   - Click "Store Value" button
   - Sign the transaction in MetaMask
   - View the transaction hash once confirmed

4. **Retrieve Value**
   - Click "Retrieve Value" button
   - The stored value will be displayed on the page

## Requirements

- MetaMask browser extension
- Walee Chain network added to MetaMask (the app will prompt to add it)
- Some WLE tokens for gas fees

## Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Blockchain Interaction**: Ethers.js v6
- **UI Framework**: Bootstrap 5
- **Icons**: Font Awesome 6

## Error Handling

The application includes comprehensive error handling for:
- MetaMask not installed
- Wallet connection failures
- Network switching issues
- Transaction failures
- Contract interaction errors

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

Make sure MetaMask extension is installed and enabled.
