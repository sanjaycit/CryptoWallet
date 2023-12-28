import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Password from './Password/Password';
import SeedPhraseDisplay from './SeedPhraseDisplay/SeedPhraseDisplay';
import KeyGeneration from './KeyGeneration/KeyGeneration';
import Home from './Home/Home';
import ImportWallet from './ImportWallet/ImportWallet';
import NewWallet from './Wallet/NewWallet';

function App() {
  const [generatedSeedPhrase, setGeneratedSeedPhrase] = useState('');
  const [generatedKeys, setGeneratedKeys] = useState(null);

  const handleSeedPhraseGeneration = (seedPhrase) => {
    // Handle the generated seed phrase as needed (e.g., store in state)
    setGeneratedSeedPhrase(seedPhrase);
  };

  const handleKeyGeneration = (mnemonic, userPassword) => {
    const keys = {
      // Your generated keys
      walletAddress: '...',
      encryptedPrivateKey: '...',
      publicKey: '...',
    };

    setGeneratedKeys(keys);

    // Navigate to the '/wallet' route after successful key generation
    return <Navigate to="/NewWallet" />;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        <Route
        path="/"
        element={
        localStorage.getItem('walletAddress') ? (
          // <Wallet />
          <NewWallet/>
        ) : (
         <Home />
       )
        }
        />
        <Route
        path='/home'
        element={<Home/>}
        >
          
        </Route>
        
           <Route
            path="/importWallet"
            element={<ImportWallet />}
          />

          <Route
            path="/password"
            element={<Password onKeyGeneration={handleKeyGeneration} />}
          />
          <Route
            path="/seed-phrase"
            element={
              <SeedPhraseDisplay
                seedPhrase={generatedSeedPhrase}
                onSeedPhraseGeneration={handleSeedPhraseGeneration}
              />
            }
          />

          <Route
            path="/key-generation"
            element={<KeyGeneration mnemonic={generatedSeedPhrase} />}
          />
           <Route
            path="/wallet"
            element={<NewWallet/>}
          />
        </Routes>
      </BrowserRouter>
      {generatedKeys && (
        <div>
          <h2>Generated Keys:</h2>
          <pre>{JSON.stringify(generatedKeys, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;

