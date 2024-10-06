// 生成盐
export const generateSalt = () => {
  try {
    return window.crypto.getRandomValues(new Uint8Array(16));
  } catch (error) {
    console.error('Error generating salt:', error);
    throw error;
  }
};

// 哈希密码
export const hashPassword = async (password, salt) => {
  try {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    const hashedPassword = await window.crypto.subtle.exportKey('raw', key);
    return new Uint8Array(hashedPassword);
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};

// 生成公钥和私钥对
export const generateKeyPair = async () => {
  try {
    return window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    );
  } catch (error) {
    console.error('Error generating key pair:', error);
    throw error;
  }
};

// 加密私钥
export const encryptPrivateKey = async (privateKey, hashedPassword, iv) => {
  try {
    const exportedPrivateKey = await window.crypto.subtle.exportKey('pkcs8', privateKey);
    const key = await window.crypto.subtle.importKey(
      'raw',
      hashedPassword,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    const encryptedPrivateKey = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      exportedPrivateKey
    );
    return new Uint8Array(encryptedPrivateKey);
  } catch (error) {
    console.error('Error encrypting private key:', error);
    throw error;
  }
};

// 加密对称密钥
export const encryptSymmetricKey = async (symmetricKey, publicKey) => {
  try {
    const exportedSymmetricKey = await window.crypto.subtle.exportKey('raw', symmetricKey);
    const encryptedSymmetricKey = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      exportedSymmetricKey
    );
    return new Uint8Array(encryptedSymmetricKey);
  } catch (error) {
    console.error('Error encrypting symmetric key:', error);
    throw error;
  }
};

// 解密私钥
export const decryptPrivateKey = async (encryptedPrivateKey, hashedPassword, iv) => {
  try {
    console.log('Decrypting private key with the following parameters:');
    console.log('Encrypted Private Key:', encryptedPrivateKey);
    console.log('Hashed Password:', hashedPassword);
    console.log('IV:', iv);

    // 导入加密密钥
    const key = await window.crypto.subtle.importKey(
      'raw',
      hashedPassword,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    console.log('Imported AES-GCM key:', key);

    // 解密私钥
    const decryptedPrivateKey = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encryptedPrivateKey
    );

    console.log('Decrypted Private Key:', decryptedPrivateKey);

    // 导入解密后的私钥
    return await window.crypto.subtle.importKey(
      'pkcs8',
      decryptedPrivateKey,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
      },
      true,
      ['decrypt']
    );
  } catch (error) {
    console.error('Error decrypting private key:', error);
    throw error;
  }
};






// 解密对称密钥
export const decryptSymmetricKey = async (encryptedSymmetricKey, privateKey) => {
  try {
    const symmetricKey = await window.crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateKey,
      encryptedSymmetricKey
    );
    return window.crypto.subtle.importKey(
      'raw',
      symmetricKey,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    );
  } catch (error) {
    console.error('Error decrypting symmetric key:', error);
    throw error;
  }
};

// 加密数据
export const encryptData = async (data, key) => {
  try {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      key,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      cryptoKey,
      encodedData
    );
    return JSON.stringify({
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encryptedData))
    });
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw error;
  }
};

// 解密数据
export const decryptData = async (encryptedData, key) => {
  try {
    const { iv, data } = JSON.parse(encryptedData);
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      key,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    const decryptedData = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      cryptoKey,
      new Uint8Array(data)
    );
    return new TextDecoder().decode(decryptedData);
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw error;
  }
};

// 生成初始化向量（IV）
export const generateIV = () => {
  try {
    return window.crypto.getRandomValues(new Uint8Array(12));
  } catch (error) {
    console.error('Error generating IV:', error);
    throw error;
  }
};