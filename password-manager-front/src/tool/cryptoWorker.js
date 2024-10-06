self.onmessage = async (event) => {
  const { type, data, key, iv } = event.data;

  const encode = (data) => new TextEncoder().encode(data);
  const decode = (data) => new TextDecoder().decode(data);

  const importKey = async (keyData) => {
    return await crypto.subtle.importKey(
      'raw',
      new Uint8Array(keyData),
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  };

  if (type === 'encrypt') {
    const secretKey = await importKey(key);
    const ivArray = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: ivArray },
      secretKey,
      encode(data)
    );
    self.postMessage({ iv: Array.from(ivArray), encrypted: Array.from(new Uint8Array(encrypted)) });
  } else if (type === 'decrypt') {
    const secretKey = await importKey(key);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      secretKey,
      new Uint8Array(data)
    );
    self.postMessage({ decrypted: decode(decrypted) });
  }
};