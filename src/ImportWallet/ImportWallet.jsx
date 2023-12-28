
import React, { useState,useEffect } from 'react';
import './ImportWallet.css';
import WalletFromPrivateKey from './WalletFromPrivateKey';
import NewWallet from '../Wallet/NewWallet';
import { useNavigate } from 'react-router';
import KeyGeneration from '../KeyGeneration/KeyGeneration';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isValidMnemonic } from '@ethersproject/hdnode';
// import { utils } from 'ethers';
const { ethers } = require("ethers"); 

const ImportWallet = () => {
  const [showPrivateKeyPopup, setShowPrivateKeyPopup] = useState(false);
  const [showSeedPhrasePopup, setShowSeedPhrasePopup] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [walletImportedFromPrivateKey, setWalletImportedFromPrivateKey] = useState(false);
  const [walletImportedFromSeedPhrase, setWalletImportedFromSeedPhrase] = useState(false);
  const [password,setPassword]=useState('');
  const [passwordStrength, setPasswordStrength] = useState('Password is blank');
  const [strengthClass,setStrengthClass]=useState('blank');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate=useNavigate();
  const[mnemonic,setMnemonic]=useState('');
  
  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  const checkPasswordStrength = (password) => {
    if (password.length === 0) {
      setPasswordStrength('Password is blank');
      setStrengthClass('blank');
      return;
    }

    if (password.length < 8) {
      setPasswordStrength('Password must be greater than 8 characters');
      return;
    }

    const strongRegex = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{9,})'
    );
    const moderateRegex = new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{8,})');

    if (strongRegex.test(password)) {
      setPasswordStrength('Strong Password');
      setStrengthClass('strong');
    } else if (moderateRegex.test(password)) {
      setPasswordStrength('Could be stronger');
      setStrengthClass('moderate');
    } else if(password.length<=8 && password.length>0) {
      setPasswordStrength('Too week');
      setStrengthClass('week');
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };
  
const isValidPrivateKey = (privateKey) => {
  try {
    new ethers.Wallet(privateKey);
  } catch (e) {
    return false;
  }
  return true;
};

  useEffect(()=>{
    isValidPrivateKey(privateKey);
  },[privateKey])
  const handleSubmit=async(e)=>{
    try{
      e.preventDefault();
      if (!privateKey) {
        toast.warning('Please enter a private key');
        return;
      }else if (passwordStrength !== 'Strong Password') {
        toast.warning('Please enter a strong password');
        return;
      }
  
     else if (password !== confirmPassword) {
        toast.warning('Passwords do not match');
        return;
      }
      else if(!isValidPrivateKey(privateKey)){
        toast.warning(`The private Key is not valid`);
        return
      }
      else{
        setShowPrivateKeyPopup(false);
        setWalletImportedFromPrivateKey(true);
      }
    }catch(error){
      toast.error(`An error occured ${error.message}`)
    }
   

  }
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
const handleBack=()=>{
  navigate('/home');
}
const handleSeedPhraseSubmit=async(e)=>{
  try{
    e.preventDefault();
    if (!mnemonic) {
      toast.warning('Please enter the seedPhrase');
      return;
    }else if(!isValidMnemonic(mnemonic)){
      toast.error('The seedphrase is not valid');
      return;
    }
    else if (passwordStrength !== 'Strong Password') {
      toast.warning('Please enter a strong password');
      return;
    }

   else if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    else{
      setShowSeedPhrasePopup(false);
      setWalletImportedFromSeedPhrase(true);
    }
  }catch(error){
    toast.warning(`An error occured ${error.message}`)
  }
}
return (
  <div>
    {walletImportedFromPrivateKey ? (
      <div>
        <WalletFromPrivateKey privateKey={privateKey} userPassword={password} />
        <NewWallet />
      </div>
    ) : walletImportedFromSeedPhrase ? (
      <div>
        <KeyGeneration mnemonic={mnemonic} userPassword={password} />
        <NewWallet />
      </div>
    ) : (
      <div className="importWallet-root">
       <div className="importWallet-container">
          <div className="password-backward-img">
          <img src={process.env.PUBLIC_URL+'/back-button.png'} alt="backward-icon" onClick={handleBack}/>
        </div>
        <div>
          <img src={process.env.PUBLIC_URL+'/wowtalkies.png'} alt='wowtalkies logo' className='logo'/>
          
        </div>
          <div className="actions">
            <button
              className="privateKey" 
              onClick={() => setShowPrivateKeyPopup(true)  }
            >
              Import Wallet From Private Key
            </button>
            <button className="seedPhrase" onClick={()=>setShowSeedPhrasePopup(true)}>
              Import Wallet From SeedPhrase
            </button>
          </div>
        </div>
      </div>
    )}
     {showPrivateKeyPopup && (
        <div className="popupBackdrop" onClick={() => {setShowPrivateKeyPopup(false);setPasswordStrength('Password is blank');setStrengthClass('blank');}}>
          <div className="popup" onClick={stopPropagation}>
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
             <div className='password-container'>
             <div className="close-icon-container">
                  <img src={process.env.PUBLIC_URL + '/close.png'} alt="Close" className="close-icon" onClick={()=>setShowPrivateKeyPopup(false)} />
              </div>
            <form onSubmit={handleSubmit}>
            <h2>Enter Private Key</h2>
            <input
              type="text"
              placeholder="Enter your private key"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
            required/>
             <h2>Enter Password</h2>
             <div className="caution">
              <p>Remember the password, as it will be used to display the private key <br/>for this wallet address.</p>
            </div>
              <div className='password'>
                <label htmlFor='password'>Enter your password:</label>
                <input
                  type='password'
                  name='password'
                  placeholder="Enter the password"
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              {password.length >= 0 && (
                <div className={`password-strength ${strengthClass} `}>
                  <span>{passwordStrength}</span>
                </div>
              )}
              <div className='confirm-password'>
                <label htmlFor='confirmPassword'>Re-enter your password:</label>
                <input
                  type='password'
                  name='confirmPassword'
                  placeholder="Re-enter your private key"
                  onChange={handleConfirmPasswordChange}
                  required
                />
              </div>
              <button type='submit' className='seedPhrase-popup-button'>Confirm</button>
            </form>
        </div>
           
          </div>
        </div>
      )}

{showSeedPhrasePopup && (
         <div className="popupBackdrop" onClick={() => {setShowSeedPhrasePopup(false);setPasswordStrength('Password is blank');setStrengthClass('blank');}}>
         <div className="popup" onClick={stopPropagation}>
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
            <div className='password-container'>
              
              <div className="close-icon-container">
                  <img src={process.env.PUBLIC_URL + '/close.png'} alt="Close" className="close-icon" onClick={()=>setShowSeedPhrasePopup(false)} />
              </div>
           
           <form onSubmit={handleSeedPhraseSubmit}>
           <h2>Enter Your SeedPhrase</h2>
           <input
             type="text"
             placeholder="Enter your seedPhrase"
             value={mnemonic}
             onChange={(e) => setMnemonic(e.target.value)}
           required/>
           <div className="caution">
                <p>When importing the wallet using a seed phrase,<br/> only the first wallet address will be imported</p>
              </div>
            <h2>Enter Password</h2>
            <div className="caution">
              <p>Remember the password, as it will be used to display the private key <br/>for this wallet address.</p>
            </div>
             <div className='password'>
               <label htmlFor='password'>Enter your password:</label>
               <input
                 type='password'
                 name='password'
                 placeholder="Enter the password"
                 onChange={handlePasswordChange}
                 required
               />
             </div>
             {password.length >= 0 && (
               <div className={`password-strength ${strengthClass} `}>
                 <span>{passwordStrength}</span>
               </div>
             )}
             <div className='confirm-password'>
               <label htmlFor='confirmPassword'>Re-enter your password:</label>
               <input
                 type='password'
                 name='confirmPassword'
                 placeholder="Re-enter your private key"
                 onChange={handleConfirmPasswordChange}
                 required
               />
             </div>
             <button type='submit' className='seedPhrase-popup-button'>Confirm</button>
           </form>
       </div>
          
         </div>
       </div>
      )}
  </div>
);
};

export default ImportWallet;
