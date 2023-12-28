import  {  useEffect } from 'react';
import crypto from 'crypto-browserify';
import { Buffer } from 'buffer';
const bip39 = require('bip39');
const { hdkey } = require('ethereumjs-wallet');
// @ts-ignore
window.Buffer = Buffer;
const KeyGeneration = (props) => {

  
  const { mnemonic, userPassword } = props;
  useEffect(() => {
    const generateKeys = () => {
      const salt = crypto.randomBytes(16).toString('hex');
      localStorage.setItem('salt',salt);
      const masterSeed = bip39.mnemonicToSeedSync(mnemonic, null, 'hex');
      const derivedKey = crypto.pbkdf2Sync(userPassword, salt, 10000, 32, 'sha256').toString('hex');
      const hdWallet = hdkey.fromMasterSeed(Buffer.from(masterSeed, 'hex'));
      const address = hdWallet.derivePath(`m/44'/60'/0'/0/1`).getWallet().getAddressString();
      const key = hdWallet.derivePath(`m/44'/60'/0'/0/1`).getWallet().getPrivateKeyString();
      const pubKey = hdWallet.derivePath(`m/44'/60'/0'/0/1`).getWallet().getPublicKeyString();

      const cipher = crypto.createCipher('aes-256-cbc', derivedKey);
      const encryptedPrivateKey = cipher.update(key, 'utf8', 'hex') + cipher.final('hex');

      localStorage.setItem('walletAddress', address);
      localStorage.setItem('encryptedPrivateKey', encryptedPrivateKey);
      localStorage.setItem('publicKey', pubKey);

      
    };

    generateKeys();
    
  }, [mnemonic, userPassword]);

};

export default KeyGeneration;
