import { ApiError } from '../types/api';
import { router } from 'expo-router';
import { cryptoService } from './cryptoService';

// Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/v1'; // Default to local backend
const IS_REAL_MODE = process.env.EXPO_PUBLIC_DATA_MODE === 'REAL';
const TOKEN_KEY = 'kiosk_auth_token';
const REFRESH_TOKEN_KEY = 'kiosk_refresh_token';

class ApiClient {
    private baseUrl: string;
    private mockMode: boolean = false; // Mock mode is determined by Environment
    private token: string | null = null;
    private refreshToken: string | null = null;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        // Try to hydrate token from storage if available (safe for browser env)
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem(TOKEN_KEY);
            this.refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        }
    }



    setToken(token: string, refreshToken?: string) {
        this.token = token;
        if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, token);
            if (refreshToken) {
                this.refreshToken = refreshToken;
                localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
            }
        }
    }

    getRefreshToken(): string | null {
        return this.refreshToken;
    }

    clearToken() {
        this.token = null;
        this.refreshToken = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
        }
    }


    /**
     * Generic request handler
     */
    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        // Strict guard: In MOCK mode, ApiClient should NOT be used.
        if (!IS_REAL_MODE) {
            console.error(`[API] Attempted to call real API in MOCK mode: ${endpoint}`);
            throw new Error('API_CLIENT_DISABLED_IN_MOCK_MODE');
        }

        const url = `${this.baseUrl}${endpoint}`;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        // Add Idempotency Key if provided
        if ((options as any).idempotencyKey) {
            headers['Idempotency-Key'] = (options as any).idempotencyKey;
        }

        // ENCRYPTION (REAL MODE ONLY)
        let requestBody = options.body;
        if (IS_REAL_MODE) {
            headers['X-Encryption-Mode'] = 'TRUE';
            
            if (requestBody && typeof requestBody === 'string') {
                // Parse existing JSON string to encrypt it
                try {
                    const rawBody = JSON.parse(requestBody);
                    const encrypted = await cryptoService.encrypt(rawBody, endpoint); // Use endpoint as AAD
                    requestBody = JSON.stringify(encrypted);
                } catch (e) {
                    console.error('[API] Failed to encrypt request body', e);
                    throw e;
                }
            }
        }

        try {
            const response = await fetch(url, { ...options, body: requestBody, headers });

            if (response.status === 401 || response.status === 403) {
                 // Token expired or invalid
                 this.clearToken();
                 console.warn('[API] Unauthorized access - clearing token');
                 
                 // Dispatch event for SessionContext to handle
                 if (typeof window !== 'undefined') {
                     window.dispatchEvent(new Event('kiosk:auth:expired'));
                 }
                 
                 throw {
                     code: 'AUTH_EXPIRED',
                     message: 'Session expired. Please login again.',
                 } as ApiError;
            }

            // Read Body Text first
            const responseText = await response.text();
            let data: any;

            if (!response.ok) {
                 // Try to parse error as JSON (might be encrypted or plaintext?)
                 // If status is 4xx/5xx, filter might catch it and return plaintext or encrypted error. 
                 // Our filter catches exceptions and returns plaintext or encrypted?
                 // Filter logic: `response.getWriter().write(...)`.
                 // If the filter crashed, it returns plaintext.
                 
                try {
                    data = JSON.parse(responseText);
                    // Check if data is encrypted error
                    if (data.ciphertext && IS_REAL_MODE) {
                        data = await cryptoService.decrypt(data);
                    }
                } catch {
                    data = { message: response.statusText };
                }

                throw {
                    code: `HTTP_${response.status}`,
                    message: (data as ApiError).message || 'An unexpected error occurred',
                    details: data
                } as ApiError;
            }

            // Some endpoints might return empty body (204)
            if (response.status === 204 || !responseText) {
                return {} as T;
            }

            data = JSON.parse(responseText);

            // DECRYPTION (REAL MODE ONLY)
            if (IS_REAL_MODE && data.ciphertext && data.iv && data.salt) {
                try {
                    data = await cryptoService.decrypt(data);
                } catch (e) {
                     console.error('[API] Decryption failed', e);
                     throw {
                         code: 'SECURITY_VIOLATION',
                         message: 'Response integrity check failed.'
                     } as ApiError;
                }
            }

            return data as T;
        } catch (error) {
            // Check if it's already an ApiError
            if ((error as any).code) throw error;

            throw {
                code: 'NETWORK_ERROR',
                message: error instanceof Error ? error.message : 'Network request failed',
            } as ApiError;
        }
    }

    get<T>(endpoint: string) {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    post<T>(endpoint: string, body: unknown) {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    put<T>(endpoint: string, body: unknown) {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    delete<T>(endpoint: string) {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

export const apiClient = new ApiClient(API_BASE_URL);
