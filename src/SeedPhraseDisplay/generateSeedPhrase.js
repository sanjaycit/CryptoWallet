
import { Buffer } from 'buffer';
const bip39 = require('bip39');

function generateSeedPhrase() {
  return new Promise((resolve) => {
    global.Buffer = Buffer;
    const mnemonic = bip39.generateMnemonic();
    delete global.Buffer;
    resolve(mnemonic);
  });
}

export default generateSeedPhrase;
