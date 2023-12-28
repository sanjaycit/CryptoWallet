import React, { useState, useEffect ,useRef} from 'react';
import { ethers } from 'ethers';
import './NewWallet.css';
import { useNavigate } from 'react-router-dom';
import Home from '../Home/Home';
import PrivateKeyPopup from '../PrivateKey/PrivateKeyPopup';
import AddNetworkPopup from './AddNetworkPopup'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const {Alchemy}=require('alchemy-sdk');
const {Network}=require('alchemy-sdk');

const NewWallet=()=>{
    const[walletAddress,setWalletAddress]=useState('');
    const[networkUrl,setNetworkUrl]=useState('https://polygon-mainnet.infura.io/v3/83859b18e33c4eb3844e856f884cc302');
    const [balance, setBalance] = useState('');
    const[switchAccount,setSwitchAccount]=useState(false);
    const[transactionHistory,setTransactionHistory]=useState([]);
    const [showPrivateKeyPopup, setShowPrivateKeyPopup] = useState(false);
    const[networkType,setNetworkType]=useState('MATIC_MAINNET');
    const [showAddNetworkPopup, setShowAddNetworkPopup] = useState(false);
    const [currencySymbol,setCurrencySymbol]=useState('MATIC');
    const [isLoading, setLoading] = useState(false);
    const [isNetworkDropdownOpen, setNetworkDropdownOpen] = useState(false);
    const[netWorkName,setNetworkName]=useState('Polygon Mainnet');
    const[defaultNetwork,setDefaultNetwork]=useState(false);
    const[addNetwork,setAddNetwork]=useState(false);
    const [isAddressCopied, setIsAddressCopied] = useState(false);
    const [isTransactionHashCopied, setIsTransactionHashCopied] = useState(Array(transactionHistory.length).fill(false));
    const navigate=useNavigate();
    const customNetworks={
      5:'ETH_GOERLI',
      11155111:'ETH_SEPOLIA',
      // OPT_MAINNET = "opt-mainnet",
      420:'OPT_GOERLI',
      // ARB_MAINNET = "arb-mainnet",
      421613:'ARB_GOERLI',
      // 421613:'ARB_SEPOLIA',
      // ASTAR_MAINNET = "astar-mainnet",
      1101:'POLYGONZKEVM_MAINNET',
      1442:'POLYGONZKEVM_TESTNET',
      8453:'BASE_MAINNET',
      84531:'BASE_GOERLI'
    }
  
    const handleAddNetwork = (networkDetails) => {
      try {
        setNetworkName(networkDetails.networkName);
        const parsedChainID = parseInt(networkDetails.chainId);
        setNetworkType(customNetworks[parsedChainID]);
        setNetworkUrl(networkDetails.rpcUrl);
        setCurrencySymbol(networkDetails.currencySymbol);
        setTransactionHistory([]);
      
      } catch (error) {
        console.error('Error adding network manually:', error);
        toast.error(`An error occurred while adding the network: ${error.message}`);
      }
    };
 
  
    
    const handleNetwork = (selectedNetwork) => {
      setLoading(true);
        setNetworkType(selectedNetwork);
        setNetworkUrl(networkproviders[selectedNetwork]);
        setNetworkDropdownOpen(false);
        setTransactionHistory([]);
      };

    
      const config = {
        // apiKey: networkType.includes('POLYGONZKEVM') ? "vlyF2CeF3wNx0iXZjhHodgA-FC7GyeBo" : "BtTN4aVQvyElxir2w0Nx9AJc0H9GRMfx",
        apiKey:"BtTN4aVQvyElxir2w0Nx9AJc0H9GRMfx",
        network: Network[networkType],
      };
      const networkproviders={
        MATIC_MAINNET :"https://polygon-mainnet.infura.io/v3/83859b18e33c4eb3844e856f884cc302",
        MATIC_MUMBAI :"https://rpc-mumbai.maticvigil.com",
        ETH_MAINNET :"https://mainnet.infura.io/v3/83859b18e33c4eb3844e856f884cc302",
      }
      const alchemy = new Alchemy(config);
      useEffect(() => {
        const storedWalletAddress = localStorage.getItem('walletAddress');
      
        if (storedWalletAddress) {
          setWalletAddress(storedWalletAddress);
          const previousNetworkType = localStorage.getItem('previousNetworkType');
          if (previousNetworkType !== networkType) {
            handleGetBalance();
            getTransactionHistoryFromAlchemy();
            // toast.success('Network has been changed');
            localStorage.setItem('previousNetworkType', networkType);
          }
        }
        setCurrencySymbol(getCurrencySymbol(networkType));
      
      }, [walletAddress, networkType, networkUrl]);
      
      const handleGetBalance=async ()=>{
        try{
          if (!ethers.isAddress(walletAddress)) {
            throw new Error('Invalid wallet address');
          }
            const provider = new ethers.JsonRpcProvider(networkUrl);
            const balanceInWei = await provider.getBalance(walletAddress);
            const balanceInEther = ethers.formatEther(balanceInWei);
            setCurrencySymbol(getCurrencySymbol(networkType));
            const formattedBalance = `${balanceInEther} ${currencySymbol}`;
            setBalance(formattedBalance);
        }catch(error){
            console.error('Error in handleGetBalance:', error);
            console.error(error)
        }
      };
      const getTransactionHistoryFromAlchemy = async () => {
        try {
          const data = await alchemy.core.getAssetTransfers({
            fromBlock: "0x0",
            toAddress: walletAddress,
            category: ["external","erc20", "erc721", "erc1155"],
          });
          if (data.statusCode === 400) {
            throw new Error('Transactions cannot be fetched. Status code: 400');
          }

      
          const detailedTransactionHistory = await Promise.all(
            data.transfers.map(async (transaction) => {
              const isOutgoing = transaction.from.toLowerCase() === walletAddress.toLowerCase();
              const counterParty = isOutgoing ? transaction.to : transaction.from;
      
              return {
                value: transaction.value,
                asset: transaction.asset,
                from: transaction.from,
                to: transaction.to,
                hash: transaction.hash,
                isOutgoing: isOutgoing,
                counterParty: counterParty,
              };
            })
          );
      
          setTransactionHistory(detailedTransactionHistory);
        } catch (error) {
          console.error('Error fetching transaction history:', error);
        }
      };
      
      
      
      const getCurrencySymbol = (network) => {
        switch (network) {
          case 'MATIC_MAINNET':
          case 'MATIC_MUMBAI':
            return 'MATIC';
          case 'ETH_MAINNET':
            return 'ETH';
          default:
            return 'Unknown';
        }
      };
      
    const handleCopyAddressClick = () => {
      navigator.clipboard.writeText(walletAddress);
      setIsAddressCopied(true);
      setTimeout(() => {
        setIsAddressCopied(false);
      }, 2000);
    };
  
    const handleCopyTransactionHashClick = (index) => {
      const hash = transactionHistory[index].hash;
      navigator.clipboard.writeText(hash);
      setIsTransactionHashCopied((prev) => {
        const newArray = [...prev];
        newArray[index] = true;
        return newArray;
      });
  
     
      setTimeout(() => {
        setIsTransactionHashCopied((prev) => {
          const newArray = [...prev];
          newArray[index] = false;
          return newArray;
        });
      }, 2000);
    };
  
    const handleShowPrivateKey = () => {
        setShowPrivateKeyPopup(true);
      };
      const handleToggleNetworkDropdown = () => {
        setNetworkDropdownOpen((prev) => !prev);
      };
      const handleCopyTransactionHash = (hash) => {
        navigator.clipboard.writeText(hash);
      };
      const dropdownRef = useRef(null);
      const getNetworkImage = () => {
        switch (networkType) {
          case 'ETH_MAINNET':
            return <img src={process.env.PUBLIC_URL + '/crypto.png'} alt="ETH_MAINNET" className='network-img'/>;
          case 'MATIC_MAINNET':
            return <img src={process.env.PUBLIC_URL + '/polygon.png'} alt="MATIC_MAINNET"  className='network-img' />;
          default:
            return <div className="simple-network">
              <div>{netWorkName.charAt(0)}</div>
              </div>;
        }
      };

      useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setNetworkDropdownOpen(false);
          }
        };
        document.addEventListener('click', handleClickOutside);
    
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
      }, []);
      useEffect(() => {
        if (switchAccount) {
          navigate('/home');
        }
      }, [switchAccount]);
    const handleBack=()=>{
      navigate('/home');
    }
    useEffect(() => {
      const fetchData = async () => {
        try {
          await handleGetBalance();
          await getTransactionHistoryFromAlchemy();
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchData();
    }, [walletAddress, networkType, networkUrl]);
    
    
    
      const partiallyVisibleAddress = `${walletAddress.substring(0, 8)}...${walletAddress.substring(walletAddress.length - 8)}`;
      return walletAddress ? (
        <div className="root">
         <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        />
         <div className="container">
          <div className="heading">
              <div className="backward-img">
                  <img src={process.env.PUBLIC_URL+'/back-button.png'} alt="backward-icon" onClick={handleBack} />
              </div>
              <div className="title">
                  <h1>My Wallet</h1>
              </div>
              <div className="add-network" ref={dropdownRef}>
                  <button className="add-network-btn" onClick={handleToggleNetworkDropdown}>
                      + Network
                  </button>
                  {isNetworkDropdownOpen && (
                      <div className="network-dropdown">
                          <div className="network-option" onClick={() => {handleNetwork('MATIC_MAINNET');
                        setNetworkName("Polygon Mainnet");setDefaultNetwork(true)}}>MATIC_MAINNET</div>
                          <div className="network-option" onClick={() => {handleNetwork('MATIC_MUMBAI');
                         setNetworkName("Polygon Mumbai");setDefaultNetwork(true)}}>MATIC_MUMBAI</div>
                          <div className="network-option" onClick={() => {handleNetwork('ETH_MAINNET');
                        setNetworkName("Ethereum Mainnet");setDefaultNetwork(true)}}>ETH_MAINNET</div>
                          <div className="add-network-manually network-option" onClick={()=>{setShowAddNetworkPopup(true);
                            setNetworkDropdownOpen(false);setAddNetwork(true)}}
                            >
                              Add Network manually</div>
                      </div>
                      )}
                       {showAddNetworkPopup && (
                          <AddNetworkPopup onClose={() => setShowAddNetworkPopup(false)} onAddNetwork={handleAddNetwork} />
                        )}
              </div>
          </div>
          <div className="wallet-address">
              <div className="wallet-address-container">
                  <div>
                      <div className="partially-visible-address">{partiallyVisibleAddress}</div>
                      <div className="copy-icon">
                      {isAddressCopied ? (
                          <img src={process.env.PUBLIC_URL + '/check.png'} alt='copy-icon' className='copy-icon' />
                        ) : (
                          <img src={process.env.PUBLIC_URL + '/copy.png'} alt='copy-icon' onClick={handleCopyAddressClick} className='copy-icon' />
                        )}
                      </div>
                  </div>
                  
              </div>
          </div>
          
         
          <div className="balance-container">
              <div className="left-container">{getNetworkImage()}</div>
              <div className="right-container">
                  <div className="network-type">{netWorkName}</div>
                  <h2>Total Balance</h2>
                  {isLoading ? (
                    <div className='loading-img'>
                      <img src={process.env.PUBLIC_URL + '/loading.png'} alt="loading" />
                    </div>
                  ) : (
                    <div className="balance">{balance}</div>
                  )}
              </div>
          </div>


          <div className="actions-container">
            <div className="switch-account">
              <button className="switch-account-btn" onClick={()=>{setSwitchAccount(true)}}>
                  Switch Account
              </button>
            </div>
            {showPrivateKeyPopup && 
            (<PrivateKeyPopup onClose={()=>setShowPrivateKeyPopup(false)} onShowPrivateKey={handleShowPrivateKey}/>)}
            <div className="show-private-key">
              <button className="show-private-key-btn" onClick={()=>setShowPrivateKeyPopup(true)}>Show private key</button>
            </div>
          </div>
         
          <div className="transactions-container">
            <h2>Transactions</h2>
            <div className="transaction-list">
            {isLoading ? (
                    <div className='loading-img'>
                      <img src={process.env.PUBLIC_URL + '/loading.png'} alt="loading" />
                    </div>
                  ) : (
                    <div> {transactionHistory.length > 0 ? (
                      transactionHistory.map((transaction, index) => (
                        <div key={index} className={`transaction-item ${transaction.isOutgoing ? 'outgoing' : 'incoming'}`}>
                          <div className='sent-received-cont'>
                            <img src={process.env.PUBLIC_URL + (transaction.isOutgoing ? '/sent.png' : '/received.png')} alt="copy-icon" className="down-upload-icon" />
                            <p>{transaction.isOutgoing ? 'Sent' : 'Received'}</p>
                          </div>
                          <div className="partially-visible-hash" onClick={() => handleCopyTransactionHash(transaction.hash)}>
                            
                              <p>{`${transaction.hash.substring(0, 8)}...${transaction.hash.substring(transaction.hash.length - 8)}`}</p>
                  
                                {isTransactionHashCopied[index] ? (
                                    <img src={process.env.PUBLIC_URL + '/check.png'} alt='copy-icon' className='copy-icon' />
                                  ) : (
                                    <img src={process.env.PUBLIC_URL + '/copy.png'} alt='copy-icon' onClick={() => handleCopyTransactionHashClick(index)} className='copy-icon' />
                                  )}
                          </div>
                          <div className='asset-container'>
                            <div>
                              {transaction.value}
                            </div>
                            <div className='asset'>
                              {transaction.asset}
                            
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-transactions">No Transactions</div>
                    )}</div>
                  )}
             
            </div>
          </div>
              </div>
        </div>
      ) : (
        <Home />
      );
  }
   
export default NewWallet;