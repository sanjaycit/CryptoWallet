
import React, { useState } from 'react';
import SeedPhraseDisplay from '../SeedPhraseDisplay/SeedPhraseDisplay';
import './Password.css';
import generateSeedPhrase from '../SeedPhraseDisplay/generateSeedPhrase';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Password = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('Password is blank');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [showSeedPhraseModal, setShowSeedPhraseModal] = useState(false);
  const [strengthClass,setStrengthClass]=useState('blank')
  const navigate = useNavigate();
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
      setPasswordStrength('Too weak');
      setStrengthClass('weak'); 
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      toast.warning('Passwords do not match');
      return;
    } else if (passwordStrength !== 'Strong Password') {
      toast.warning('Please enter a strong password');
      return;
    }
  
    try {
      // Generate seed phrase
      const generatedSeedPhrase = await generateSeedPhrase();
      setSeedPhrase(generatedSeedPhrase);
      // Show Seed Phrase modal
      setShowSeedPhraseModal(true);
    } catch (error) {
      console.error('Error generating seed phrase:', error);
      toast.error('Failed to generate Seed Phrase');
    }
  };
  

  const handleCloseSeedPhraseModal = () => {
    setShowSeedPhraseModal(false);
    setPassword('');
    setPasswordStrength('Password is blank');
  };
  const handleBack=()=>{
    navigate('/home');
  }

  return (
    <div className='password-root'>
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
      <div className='password-home-container'>
        <div className="password-backward-img">
          <img src={process.env.PUBLIC_URL+'/back-button.png'} alt="backward-icon" onClick={handleBack}/>
        </div>
        <div className='guidelines'>
          <p>
            Please enter a strong password which includes numeric, lowercase,
            uppercase letters, and special characters. The password should be a
            minimum of 8 characters.
          </p>
        </div>
        <div className="caution">
              <p>Remember the password, as it will be used to display the private key for this wallet address.</p>
            </div>
        <div className='password-container'>
          <form onSubmit={handleSubmit}>
            <div className='password'>
              <label htmlFor='password'>Enter your password:</label>
              <input
                type='password'
                name='password'
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
                onChange={handleConfirmPasswordChange}
                required
              />
            </div>
            <button type='submit' className='btn'>
              Submit
            </button>
          </form>
          {showSeedPhraseModal && (
            <SeedPhraseDisplay
              seedPhrase={seedPhrase}
              onClose={()=>handleCloseSeedPhraseModal}
              password={confirmPassword}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Password;
