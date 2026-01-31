// Re-export Card from services to ensure single source of truth
import { Card } from './services';

export type { Card };
export type CardType = 'DEBIT' | 'CREDIT';
export type CardStatus = 'ACTIVE' | 'BLOCKED' | 'FROZEN';
export type CardNetwork = 'VISA' | 'MASTERCARD' | 'RUPAY';

export interface CardActionState {
    loading: boolean;
    error: string | null;
    success: boolean;
}
