import React ,{useState} from 'react';
import PropTypes from 'prop-types';
import './SeedPhraseDisplay.css';
import SeedPhraseVerificationPopup from './SeedPhraseVerificationPopup';
import { useNavigate } from 'react-router';


const SeedPhraseDisplay = ({ seedPhrase,password}) => {
 const navigate=useNavigate();
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
 const[isSeedPhraseCopied,setSeedPhraseCopied]=useState(false);
  const handleNext = () => {
    setShowVerificationPopup(true);
  };
const handleBack=()=>{
  console.log('Back button clicked');
  navigate('/home');
};
  const seedWords = seedPhrase.split(' ');
  const handleCopySeedPhraseClick = () => {
    navigator.clipboard.writeText(seedPhrase);
    setSeedPhraseCopied(true);
    setTimeout(() => {
      setSeedPhraseCopied(false);
    }, 2000);
  };

  return (
    <div className="seed-phrase-modal">
      <div className="seed-phrase-container">
      <div className="password-backward-img">
        <img src={process.env.PUBLIC_URL+'/back-button.png'} alt="backward-icon" onClick={handleBack}/>
      </div>
        <h2>Seed Phrase Generated</h2>
        <p style={{textAlign:'center'}}>
          Please note down the following seed phrase.<br/> It is crucial for
          recovering your account.
        </p>
        <div className="seedPhrase-word-container">
        <div className="seed-phrase-grid">
          {seedWords.map((word, index) => (
            <div key={index} className='seed-word'>
               <span className="seed-word-number"><p>{index + 1}.</p></span>
              <div className="seed-phrase-word">
              {word}
              </div>
            </div>
          ))}
        </div>
        </div>
        <div className="copy-icon-seedphrase">
          <div style={{display:'flex',alignItems:'center'}}>
          {isSeedPhraseCopied ? (
                  <img src={process.env.PUBLIC_URL + '/check.png'} alt="copy-icon" className="copy-icon" />
                ) : (
                  <img
                    src={process.env.PUBLIC_URL + '/copy.png'}
                    alt="copy-icon"
                    onClick={handleCopySeedPhraseClick}
                    className="copy-icon"
                  />
                )}
                
               
          </div>
          <div> {isSeedPhraseCopied?(<p style={{color:'#2DAF7D'}}>Copied!</p>):
                  (<p style={{color:'#494545'}}>Copy to clipboard</p>)}
          </div>
              </div>
        
        <button onClick={handleNext} className='btn'>Next</button>
      </div>
      {showVerificationPopup && (
        <SeedPhraseVerificationPopup
          generatedSeedPhrase={seedPhrase}
          password={password}
        />
      )}
      

    </div>
  );
};

SeedPhraseDisplay.propTypes = {
  seedPhrase: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

export default SeedPhraseDisplay;
