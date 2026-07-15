/**
 * Simple client-side XOR-based encryption helper for secure data backup.
 */
export function encryptData(data: string, secretKey: string): string {
  if (!secretKey) return btoa(encodeURIComponent(data));
  
  let result = '';
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i);
    const keyChar = secretKey.charCodeAt(i % secretKey.length);
    result += String.fromCharCode(charCode ^ keyChar);
  }
  return btoa(encodeURIComponent(result));
}

export function decryptData(encrypted: string, secretKey: string): string {
  const decoded = decodeURIComponent(atob(encrypted));
  if (!secretKey) return decoded;
  
  let result = '';
  for (let i = 0; i < decoded.length; i++) {
    const charCode = decoded.charCodeAt(i);
    const keyChar = secretKey.charCodeAt(i % secretKey.length);
    result += String.fromCharCode(charCode ^ keyChar);
  }
  return result;
}
