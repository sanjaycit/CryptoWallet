import React, { useState} from 'react';
import "./AddNetworkPopup.css";

const AddNetworkPopup = ({ onClose, onAddNetwork }) => {
  const [networkName, setNetworkName] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [chainId, setChainId] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('');

  const handleAddNetwork =async  (e) => {
    e.preventDefault();

    // Call the onAddNetwork callback with the entered details
    onAddNetwork({
      networkName,
      rpcUrl,
      chainId,
      currencySymbol,
    });
    onClose();
  };
  return (
    <div className="add-network-container">
      
      <div className="add-network-popup">
        <div className='close-icon-container'>
        <img src={process.env.PUBLIC_URL + '/close.png'} alt="Close" className="close-icon" onClick={onClose} />
        </div>
      
        <h2>Add Network</h2>
        <form onSubmit={handleAddNetwork}>
        <label>
          Network Name:
          <input type="text" value={networkName} onChange={(e) => setNetworkName(e.target.value)} required />
        </label>
        <label>
          Network RPC URL:
          <input type="text" value={rpcUrl} onChange={(e) => setRpcUrl(e.target.value)} required/>
        </label>
        <label>
          Chain ID:
          <input type="number" value={chainId} onChange={(e) => setChainId(e.target.value)} required />
        </label>

        <label>
          Currency Symbol:
          <input type="text" value={currencySymbol} onChange={(e) => setCurrencySymbol(e.target.value)} required/>
        </label>
        <button type='submit'>Add Network</button>
        </form>
       
     </div>
    </div>
    
  );
};

export default AddNetworkPopup;
