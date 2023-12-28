
import { useEffect,useState } from 'react';
import crypto from 'crypto-browserify';
import { ethers } from 'ethers';
import { Buffer } from 'buffer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// @ts-ignore
window.Buffer = Buffer;

const WalletFromPrivateKey = (props) => {
  const { privateKey, userPassword } = props;
  const [error, setError] = useState(null);
  useEffect(() => {
    const generateKeys = () => {
      try{
        const salt = crypto.randomBytes(16).toString('hex');
        const derivedKey = crypto.pbkdf2Sync(userPassword, Buffer.from(salt, 'hex'), 10000, 32, 'sha256').toString('hex');
        const cipher = crypto.createCipher('aes-256-cbc', derivedKey);
        const encryptedPrivateKey = cipher.update(privateKey, 'utf8', 'hex') + cipher.final('hex');
  
        const wallet = new ethers.Wallet(privateKey);
        const walletAddress = wallet.address;
        const publicKey=wallet.publicKey;
  
        if(!error){
          localStorage.setItem('walletAddress',walletAddress);
          localStorage.setItem('encryptedPrivateKey',encryptedPrivateKey);
          localStorage.setItem('publicKey',publicKey);
          localStorage.setItem('salt',salt);
        }
      
      }catch(error){
      
        setError(error.message);
        toast.error(`An error occurred: ${error.message}`);
      }
     
    };

    generateKeys();
  }, [privateKey, userPassword,error]);

  return <div>
  <ToastContainer />
</div>; 
};

export default WalletFromPrivateKey;


