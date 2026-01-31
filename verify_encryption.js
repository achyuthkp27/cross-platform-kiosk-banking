/**
 * Verification Script for E2E Encryption
 * usage: ts-node verify_encryption.ts
 */

const { webcrypto } = require('crypto');
// Polyfill for Node environment if needed, but modern Node has global crypto
if (!global.crypto) {
    global.crypto = webcrypto;
}

const fetch = require('node-fetch');

const MASTER_SECRET = 'TEST_MASTER_SECRET_1234567890_CHANGE_ME';
const API_URL = 'http://localhost:8080/v1';

const enc = new TextEncoder();
const dec = new TextDecoder();

async function deriveKey(salt) {
    const masterKey = await crypto.subtle.importKey(
        'raw',
        enc.encode(MASTER_SECRET),
        { name: 'HKDF' },
        false,
        ['deriveKey']
    );

    return crypto.subtle.deriveKey(
        {
            name: 'HKDF',
            hash: 'SHA-256',
            salt: salt,
            info: enc.encode('kiosk-api'),
        },
        masterKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

function arrayBufferToBase64(buffer) {
    return Buffer.from(buffer).toString('base64');
}

function base64ToArrayBuffer(base64) {
    return Buffer.from(base64, 'base64');
}

async function encrypt(payload, aadStr) {
    const plaintext = enc.encode(JSON.stringify(payload));
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const aad = enc.encode(aadStr);

    const key = await deriveKey(salt);

    const ciphertext = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
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
}

async function decrypt(encryptedFields) {
    const iv = base64ToArrayBuffer(encryptedFields.iv);
    const salt = base64ToArrayBuffer(encryptedFields.salt);
    const ciphertext = base64ToArrayBuffer(encryptedFields.ciphertext);
    const aad = enc.encode(encryptedFields.aad);

    const key = await deriveKey(salt);

    const decrypted = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv,
            additionalData: aad,
        },
        key,
        ciphertext
    );

    return JSON.parse(dec.decode(decrypted));
}

async function runTest() {
    console.log('--- Starting E2E Encryption Verification ---');
    
    // 0. Test Health Check (Encrypted)
    console.log('0. Testing Health Check (GET /v1/health) with Encryption...');
    try {
        const healthResponse = await fetch(`${API_URL}/health`, {
            method: 'GET',
            headers: {
                'X-Encryption-Mode': 'TRUE'
            }
        });
        const healthText = await healthResponse.text();
        console.log('   Health Status:', healthResponse.status);
        if (healthResponse.status === 200) {
             const healthEnc = JSON.parse(healthText);
             const healthDec = await decrypt(healthEnc);
             console.log('   Health Decrypted:', healthDec);
        } else {
             console.log('   Health Failed:', healthText);
        }
    } catch(e) { console.error('Health Check Error', e); }

    // 1. Simulate Login Request (Encrypted)
    const loginPayload = {
        userId: 'admin',
        pin: '1234'
    };
    
    console.log('1. Encrypting Payload:', loginPayload);
    const encryptedRequest = await encrypt(loginPayload, '/v1/auth/login');
    console.log('   Ciphertext Payload:', encryptedRequest);

    try {
        console.log('2. Sending Request to Backend...');
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Encryption-Mode': 'TRUE'
            },
            body: JSON.stringify(encryptedRequest)
        });

        const text = await response.text();
        console.log('3. Received Response Status:', response.status);
        console.log('   Raw Response Body:', text);

        if (response.status === 200) {
            const encryptedResponse = JSON.parse(text);
            console.log('4. Decrypting Response...');
            const decryptedResponse = await decrypt(encryptedResponse);
            console.log('   SUCCESS! Decrypted Response:', decryptedResponse);
            
            if (decryptedResponse.token) {
                console.log('   Token received, Auth flow valid.');
            }
        } else {
            console.error('   Request Failed:', text);
            // Try to decrypt error if it looks encrypted
            try {
                 const err = JSON.parse(text);
                 if(err.ciphertext) {
                     console.log('   Decrypting Error Response...');
                     console.log('   Decrypted Error:', await decrypt(err));
                 }
            } catch(e) {}
        }

    } catch (e) {
        console.error('ERROR:', e);
    }
}

runTest();
