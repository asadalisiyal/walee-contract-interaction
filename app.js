// Contract configuration
const CONTRACT_ADDRESS = '0x458e93d88F737fD7c6A290d0d1622FfDF3411D26';
const CHAIN_ID = 713714; // Walee Chain ID
const CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "num",
                "type": "uint256"
            }
        ],
        "name": "store",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "retrieve",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Global variables
let provider = null;
let signer = null;
let contract = null;
let userAddress = null;

// DOM elements
const connectWalletBtn = document.getElementById('connectWallet');
const walletStatus = document.getElementById('walletStatus');
const walletMessage = document.getElementById('walletMessage');
const storeButton = document.getElementById('storeButton');
const retrieveButton = document.getElementById('retrieveButton');
const valueInput = document.getElementById('valueInput');
const transactionResult = document.getElementById('transactionResult');
const transactionHash = document.getElementById('transactionHash');
const retrievedValue = document.getElementById('retrievedValue');
const retrievedValueText = document.getElementById('retrievedValueText');

// Check if MetaMask is installed
function isMetaMaskInstalled() {
    return typeof window.ethereum !== 'undefined';
}

// Check if connected to correct network
async function checkNetwork() {
    if (!provider) return false;
    
    try {
        const network = await provider.getNetwork();
        return network.chainId === BigInt(CHAIN_ID);
    } catch (error) {
        console.error('Error checking network:', error);
        return false;
    }
}

// Switch to Walee Chain
async function switchToWaleeChain() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
        });
        return true;
    } catch (switchError) {
        // If the chain doesn't exist, add it
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: `0x${CHAIN_ID.toString(16)}`,
                        chainName: 'Walee Chain',
                        nativeCurrency: {
                            name: 'WAL',
                            symbol: 'WAL',
                            decimals: 18,
                        },
                        rpcUrls: ['https://rpc.walee.io'], // You may need to update this with actual RPC URL
                        blockExplorerUrls: ['https://explorer.walee.io'], // You may need to update this
                    }],
                });
                return true;
            } catch (addError) {
                console.error('Error adding Walee Chain:', addError);
                return false;
            }
        } else {
            console.error('Error switching to Walee Chain:', switchError);
            return false;
        }
    }
}

// Connect to MetaMask
async function connectWallet() {
    if (!isMetaMaskInstalled()) {
        alert('MetaMask is not installed. Please install MetaMask to use this application.');
        return;
    }

    try {
        // Request account access
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        if (accounts.length === 0) {
            throw new Error('No accounts found');
        }

        userAddress = accounts[0];
        
        // Initialize provider and signer
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        
        // Check if connected to correct network
        const isCorrectNetwork = await checkNetwork();
        if (!isCorrectNetwork) {
            const switched = await switchToWaleeChain();
            if (!switched) {
                throw new Error('Please switch to Walee Chain (Chain ID: 713714)');
            }
            // Re-initialize provider after network switch
            provider = new ethers.BrowserProvider(window.ethereum);
            signer = await provider.getSigner();
        }

        // Initialize contract
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        // Update UI
        updateWalletStatus(true);
        enableButtons();
        
        console.log('Wallet connected:', userAddress);
        
    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet: ' + error.message);
    }
}

// Update wallet status in UI
function updateWalletStatus(connected) {
    if (connected) {
        walletStatus.className = 'wallet-status wallet-connected';
        walletMessage.innerHTML = `<i class="fas fa-check-circle me-2"></i>Wallet connected: ${userAddress}`;
        connectWalletBtn.style.display = 'none';
    } else {
        walletStatus.className = 'wallet-status wallet-disconnected';
        walletMessage.innerHTML = '<i class="fas fa-times-circle me-2"></i>Wallet not connected';
        connectWalletBtn.style.display = 'block';
    }
}

// Enable/disable buttons
function enableButtons() {
    storeButton.disabled = false;
    retrieveButton.disabled = false;
}

function disableButtons() {
    storeButton.disabled = true;
    retrieveButton.disabled = true;
}

// Show loading state
function showLoading(button) {
    const loading = button.querySelector('.loading');
    loading.style.display = 'inline';
    button.disabled = true;
}

// Hide loading state
function hideLoading(button) {
    const loading = button.querySelector('.loading');
    loading.style.display = 'none';
    button.disabled = false;
}

// Store value function
async function storeValue() {
    const value = valueInput.value.trim();
    
    if (!value || isNaN(value)) {
        alert('Please enter a valid number');
        return;
    }

    if (!contract) {
        alert('Please connect your wallet first');
        return;
    }

    try {
        showLoading(storeButton);
        
        // Call the store function
        const tx = await contract.store(value);
        
        // Wait for transaction to be mined
        const receipt = await tx.wait();
        
        // Display transaction hash
        transactionHash.textContent = receipt.hash;
        transactionResult.style.display = 'block';
        
        // Clear input
        valueInput.value = '';
        
        console.log('Transaction successful:', receipt);
        
    } catch (error) {
        console.error('Error storing value:', error);
        alert('Failed to store value: ' + error.message);
    } finally {
        hideLoading(storeButton);
    }
}

// Retrieve value function
async function retrieveValue() {
    if (!contract) {
        alert('Please connect your wallet first');
        return;
    }

    try {
        showLoading(retrieveButton);
        
        // Call the retrieve function
        const value = await contract.retrieve();
        
        // Display retrieved value
        retrievedValueText.textContent = `Stored Value: ${value.toString()}`;
        retrievedValue.style.display = 'block';
        
        console.log('Retrieved value:', value.toString());
        
    } catch (error) {
        console.error('Error retrieving value:', error);
        alert('Failed to retrieve value: ' + error.message);
    } finally {
        hideLoading(retrieveButton);
    }
}

// Event listeners
connectWalletBtn.addEventListener('click', connectWallet);
storeButton.addEventListener('click', storeValue);
retrieveButton.addEventListener('click', retrieveValue);

// Check if wallet is already connected on page load
window.addEventListener('load', async () => {
    if (isMetaMaskInstalled()) {
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_accounts'
            });
            
            if (accounts.length > 0) {
                userAddress = accounts[0];
                provider = new ethers.BrowserProvider(window.ethereum);
                signer = await provider.getSigner();
                
                const isCorrectNetwork = await checkNetwork();
                if (isCorrectNetwork) {
                    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
                    updateWalletStatus(true);
                    enableButtons();
                } else {
                    updateWalletStatus(false);
                }
            }
        } catch (error) {
            console.error('Error checking wallet connection:', error);
        }
    }
});

// Listen for account changes
if (isMetaMaskInstalled()) {
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            // User disconnected
            userAddress = null;
            provider = null;
            signer = null;
            contract = null;
            updateWalletStatus(false);
            disableButtons();
            transactionResult.style.display = 'none';
            retrievedValue.style.display = 'none';
        } else {
            // User switched accounts
            location.reload();
        }
    });

    // Listen for chain changes
    window.ethereum.on('chainChanged', () => {
        location.reload();
    });
}
