
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './SeedPhraseVerificationPopup.css';
import KeyGeneration from '../KeyGeneration/KeyGeneration';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const SeedPhraseVerificationPopup = ({ generatedSeedPhrase , password}) => {
  const [shuffledSeedPhrase, setShuffledSeedPhrase] = useState([]);
  const [selectedBoxes, setSelectedBoxes] = useState(Array(12).fill(null));
  const [verificationError, setVerificationError] = useState('');
  const [keyGenerationTriggered, setKeyGenerationTriggered] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const seedPhraseArray = generatedSeedPhrase.split(' ');
    const shuffledArray = seedPhraseArray.sort(() => Math.random() - 0.5);
    setShuffledSeedPhrase(shuffledArray);
  }, [generatedSeedPhrase]);

const handleBoxClick = (index) => {
    const updatedSelectedBoxes = [...selectedBoxes];
    const selectedIndex = updatedSelectedBoxes.indexOf(index);

    if (selectedIndex !== -1) {
      updatedSelectedBoxes[selectedIndex] = null;
    } else {
      const emptyIndex = updatedSelectedBoxes.indexOf(null);
      if (emptyIndex !== -1) {
        updatedSelectedBoxes[emptyIndex] = index;
      }
    }
  
    setSelectedBoxes(updatedSelectedBoxes);
  
 
    if (!updatedSelectedBoxes.includes(null)) {
      const selectedWords = updatedSelectedBoxes.map((i) => shuffledSeedPhrase[i]);
      const enteredSeedPhrase = selectedWords.join(' ');
      const isMatch = enteredSeedPhrase === generatedSeedPhrase;
      
      if (isMatch) {
        onVerificationSuccess();
       
      } else {
        setVerificationError('Seed phrase does not match. Please try again.');
        toast.error(verificationError);
      }
    }
  };
  const onVerificationSuccess=()=>{
    setKeyGenerationTriggered(true);
    toast.success("Wallet has been created");
  }
  const handleBack=()=>{
    navigate('/home');
  }
  
  return keyGenerationTriggered ? (
    <>
      {console.log("Hello")}
      <KeyGeneration mnemonic={generatedSeedPhrase} userPassword={password} />
      {navigate('/wallet')}
    </>
  ) :  (
    <div className="seed-phrase-verification-popup">
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
      <div className="verification-container">
      <div className="password-backward-img">
        <img src={process.env.PUBLIC_URL+'/back-button.png'} alt="backward-icon" onClick={handleBack}/>
      </div>
        <h2>Verify Seed Phrase</h2>
        <p>Click on the boxes below to reorder the seed phrase.</p>
        {/* {verificationError && <div className="error-message">{verificationError}</div>} */}
        <div className="empty-boxes">
          
          {selectedBoxes.map((index, i) => (
          <div key={i} className="empty-box">
            {index !== null ? shuffledSeedPhrase[index] : ''}
          </div>
        ))}
        </div> 
    
         <div className="seed-boxes">
        {shuffledSeedPhrase.map((word, index) => (
          <div
            key={index}
            className={`seed-box ${selectedBoxes.includes(index) ? 'selected' : ''}`}
            onClick={() => handleBoxClick(index)}
          >
            {word}
          </div>
        ))}
      </div>
      </div>
      
    </div>
    
  );
  
  
};

SeedPhraseVerificationPopup.propTypes = {
  generatedSeedPhrase: PropTypes.string.isRequired,
  onVerificationSuccess: PropTypes.func.isRequired,
};

export default SeedPhraseVerificationPopup;
