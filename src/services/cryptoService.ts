/**
 * Bank-Grade Crypto Service
 * Uses Web Crypto API for performance and security.
 * Algorithm: AES-256-GCM
 * Key Derivation: HKDF-SHA256
 */

const MASTER_SECRET = process.env.EXPO_PUBLIC_MASTER_SECRET || 'DEFAULT_INSECURE_SECRET_CHANGE_ME_IMMEDIATELY_1234567890';
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;

// Convert string to Uint8Array
const enc = new TextEncoder();
const dec = new TextDecoder();

async function importMasterKey(): Promise<CryptoKey> {
    return window.crypto.subtle.importKey(
        'raw',
        enc.encode(MASTER_SECRET),
        { name: 'HKDF' },
        false,
        ['deriveKey']
    );
}

async function deriveKey(salt: Uint8Array): Promise<CryptoKey> {
    const masterKey = await importMasterKey();
    return window.crypto.subtle.deriveKey(
        {
            name: 'HKDF',
            hash: 'SHA-256',
            salt: salt,
            info: enc.encode('kiosk-api'),
        },
        masterKey,
        { name: ALGORITHM, length: KEY_LENGTH },
        false,
        ['encrypt', 'decrypt']
    );
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

export const cryptoService = {
    encrypt: async (payload: any, aadStr: string = '') => {
        const plaintext = enc.encode(JSON.stringify(payload));
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const aad = enc.encode(aadStr);

        const key = await deriveKey(salt);

        const ciphertext = await window.crypto.subtle.encrypt(
            {
                name: ALGORITHM,
                iv: iv,
                additionalData: aad,
            },
            key,
            plaintext
        );

        return {
            iv: arrayBufferToBase64(iv),
            salt: arrayBufferToBase64(salt),
            ciphertext: arrayBufferToBase64(ciphertext),
            aad: aadStr,
        };
    },

    decrypt: async (encryptedFields: { iv: string; salt: string; ciphertext: string; aad: string }) => {
        const iv = new Uint8Array(base64ToArrayBuffer(encryptedFields.iv));
        const salt = new Uint8Array(base64ToArrayBuffer(encryptedFields.salt));
        const ciphertext = base64ToArrayBuffer(encryptedFields.ciphertext);
        const aad = enc.encode(encryptedFields.aad);

        const key = await deriveKey(salt);

        try {
            const decrypted = await window.crypto.subtle.decrypt(
                {
                    name: ALGORITHM,
                    iv: iv,
                    additionalData: aad,
                },
                key,
                ciphertext
            );
            return JSON.parse(dec.decode(decrypted));
        } catch (e) {
            console.error('Decryption failed', e);
            throw new Error('Integrity Check Failed');
        }
    }
};
