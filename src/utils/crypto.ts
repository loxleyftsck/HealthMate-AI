/**
 * Production-grade AES-256-GCM client-side encryption helper using Web Crypto API.
 */

async function deriveKey(secretKey: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(secretKey),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const saltBuffer = new Uint8Array(salt).buffer;

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer as ArrayBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts data using AES-256-GCM.
 */
export async function encryptData(data: string, secretKey: string): Promise<string> {
  if (!secretKey) {
    return btoa(encodeURIComponent(data));
  }

  try {
    const enc = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(secretKey, salt);

    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv as unknown as BufferSource },
      key,
      enc.encode(data)
    );

    // Buffer structure: salt (16 bytes) + iv (12 bytes) + ciphertext
    const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(ciphertext), salt.length + iv.length);

    // Convert to base64
    let binary = '';
    const bytes = combined;
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch (err) {
    console.error('[Crypto] Encryption error:', err);
    throw new Error('Gagal mengenkripsi data');
  }
}

/**
 * Decrypts AES-256-GCM data with fallback for legacy unencrypted/XOR formats.
 */
export async function decryptData(encrypted: string, secretKey: string): Promise<string> {
  if (!encrypted) return '';

  // Safe base64 decode check (BUG-06)
  let rawBinary = '';
  try {
    rawBinary = atob(encrypted);
  } catch {
    throw new Error('Format data terenkripsi tidak valid');
  }

  if (!secretKey) {
    try {
      return decodeURIComponent(rawBinary);
    } catch {
      return rawBinary;
    }
  }

  try {
    const bytes = new Uint8Array(rawBinary.length);
    for (let i = 0; i < rawBinary.length; i++) {
      bytes[i] = rawBinary.charCodeAt(i);
    }

    // Minimum size: 16 (salt) + 12 (iv) + 16 (AES-GCM tag) = 44 bytes
    if (bytes.length >= 44) {
      const salt = bytes.slice(0, 16);
      const iv = bytes.slice(16, 28);
      const ciphertext = bytes.slice(28);

      const key = await deriveKey(secretKey, salt);
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv as unknown as BufferSource },
        key,
        ciphertext as unknown as BufferSource
      );

      const dec = new TextDecoder();
      return dec.decode(decrypted);
    }
  } catch {
    // If AES-GCM decryption fails, attempt legacy XOR fallback for backward compatibility
    try {
      const decoded = decodeURIComponent(rawBinary);
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i);
        const keyChar = secretKey.charCodeAt(i % secretKey.length);
        result += String.fromCharCode(charCode ^ keyChar);
      }
      return result;
    } catch {
      // Ignore fallback failure
    }
  }

  throw new Error('Kunci enkripsi salah atau data backup terdistorsi');
}
