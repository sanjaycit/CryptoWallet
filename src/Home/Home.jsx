
import React from "react";
import "./Home.css";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleCreateWalletClick = () => {
    navigate('/password');
  };

  const handleImportWalletClick = () => {
    navigate('/importWallet');
  };

  const handleBack = () => {
    navigate('/wallet');
  };

  return (
    <div className="home-root">
      <div className="home-container">
        {localStorage.getItem('walletAddress') &&
          <div className="password-backward-img">
            <img src={process.env.PUBLIC_URL + '/back-button.png'} alt="backward-icon" onClick={handleBack} />
          </div>}
        <div>
          <img src={process.env.PUBLIC_URL + '/wowtalkies.png'} alt='wowtalkies logo' className='logo' />
        </div>
        <div className="actions">
          <button className="create-wallet" onClick={handleCreateWalletClick}>Create new Wallet</button>
          <button className="import-wallet" onClick={handleImportWalletClick}>Import Wallet</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
