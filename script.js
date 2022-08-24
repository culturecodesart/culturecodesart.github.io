"use strict";
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;
const coinbasewallet = window.ethereum;
let web3Modal
let provider;
let selectedAccount;
let web3;

function init() {


  console.log("WalletConnectProvider is", WalletConnectProvider);
  console.log("Fortmatic is", Fortmatic);
  console.log("window.ethereum is", window.ethereum);
  
  const providerOptions = {
	  
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "7b7a8bcd983a4e28a26e41d806851c99",
      }
    },

    fortmatic: {
      package: Fortmatic,
      options: {
        key: "pk_live_BAD37FD4C0C5345A"
      }
    },	
	
	coinbasewallet: {
		package: CoinbaseWalletSDK,
		options: {
			appName: "CultureCodes",
			infuraId: "7b7a8bcd983a4e28a26e41d806851c99",
			rpc: "",
			chainId: 1,
			darkMode: false
		}  
	}
	
  };

  web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions,
    disableInjectedProvider: false,
  });

  console.log("Web3Modal instance is", web3Modal);
}







async function fetchAccountData() {
  web3 = new Web3(provider);
  
  console.log("Web3 instance is", web3);
  
  const chainId = await web3.eth.getChainId();
  const chainData = evmChains.getChain(chainId);
  const accounts = await web3.eth.getAccounts();
  
  console.log("Got accounts", accounts);
  
  selectedAccount = accounts[0];
  selectedAccount = selectedAccount.toLowerCase();
  
  console.log("selectedAccount: ", selectedAccount);
}




async function refreshAccountData() {
  await fetchAccountData(provider);
}






async function onConnect() {

  try {
    provider = await web3Modal.connect();
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }


  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });


  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });


  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  await refreshAccountData();
}





async function onDisconnect() {

  if(provider.close) {
    await provider.close();
    await web3Modal.clearCachedProvider();
    provider = null;
  }
  selectedAccount = null;
}



window.addEventListener('load', async () => {
  init();
  document.querySelector("#connectWallet").addEventListener("click", onConnect);
  document.querySelector("#btnMigrate").addEventListener("click", Migrate);
});
