import React, { useState } from 'react';
import './PrivateKeyPopup.css';
import { Buffer } from 'buffer';
const crypto = require('crypto');

const PrivateKeyPopup = ({ onClose, onShowPrivateKey }) => {
  const [password, setPassword] = useState('');
  const [decryptedPrivateKey, setDecryptedPrivateKey] = useState('');
  const [showDecryptedKeyPopup, setShowDecryptedKeyPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPrivateKeyCopied, setIsPrivateKeyCopied] = useState(false);

  window.Buffer = Buffer;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const salt = localStorage.getItem('salt');
      const derivedKey = crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha256').toString('hex');
      const encryptedPrivateKey = localStorage.getItem('encryptedPrivateKey');

      const decipher = crypto.createDecipher('aes-256-cbc', derivedKey);
      let decryptedPrivateKey = decipher.update(encryptedPrivateKey, 'hex', 'utf8');
      decryptedPrivateKey += decipher.final('utf8');
      setDecryptedPrivateKey(decryptedPrivateKey);
      setShowDecryptedKeyPopup(true);
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setErrorMessage('Unable to display the private key. Please check your password.');
    }
  };

  const handleClose = () => {
    setErrorMessage('');
    setShowDecryptedKeyPopup(false);
    onClose();
  };

  const handleDecryptedKeyPopupClose = () => {
    setShowDecryptedKeyPopup(false);
  };

  const handleCopyPrivateKeyClick = () => {
    navigator.clipboard.writeText(decryptedPrivateKey);
    setIsPrivateKeyCopied(true);
    setTimeout(() => {
      setIsPrivateKeyCopied(false);
    }, 2000);
  };

  return (
    <div className="private-key-popup">
      <div className="popup-content">
        <h2>Enter Password to Show Private Key</h2>
        <div className="password-container">
          <form onSubmit={handleSubmit}>
            <div className="password">
              <label htmlFor="password">Enter your password:</label>
              <input
                type="password"
                name="password"
                onChange={(e) => {setPassword(e.target.value)
                setErrorMessage('')}}
                required
              />
            </div>
            {errorMessage?(( <p className="err-msg">{errorMessage}</p>)):(<p></p>)}
           
            <div className="actions-container">
              <button type="submit" className="submit-btn">
                Submit
              </button>
              <button onClick={()=>handleClose()} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>

        {showDecryptedKeyPopup && (
          <div className="decrypted-key-popup-root">
            <h1>Private Key</h1>
            <div className="decrypted-key-container">
              <div className="decrypted-key">
                <p>{decryptedPrivateKey.slice(0, Math.ceil(decryptedPrivateKey.length / 2))}</p>
                <p>{decryptedPrivateKey.slice(Math.ceil(decryptedPrivateKey.length / 2))}</p>
              </div>
              <div className="copy-icon">
                {isPrivateKeyCopied ? (
                  <img src={process.env.PUBLIC_URL + '/check.png'} alt="copy-icon" className="copy-icon" />
                ) : (
                  <img
                    src={process.env.PUBLIC_URL + '/copy.png'}
                    alt="copy-icon"
                    onClick={handleCopyPrivateKeyClick}
                    className="copy-icon"
                  />
                )}
              </div>
            </div>
            <button className="private-key-popup-btn" onClick={handleDecryptedKeyPopupClose}>
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivateKeyPopup;
