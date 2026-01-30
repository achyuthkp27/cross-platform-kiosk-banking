export type CardType = 'DEBIT' | 'CREDIT';
export type CardStatus = 'ACTIVE' | 'BLOCKED' | 'FROZEN';
export type CardNetwork = 'VISA' | 'MASTERCARD' | 'RUPAY';

export interface Card {
    id: string;
    number: string; // Last 4 digits or masked
    holderName: string;
    expiryDate: string; // MM/YY
    cvv: string;
    type: CardType;
    network: CardNetwork;
    status: CardStatus;
    balance?: number; // For Debit
    limit?: number;   // For Credit
    used?: number;    // For Credit
    color: string;    // Visually distinct color for UI
}

export interface CardActionState {
    loading: boolean;
    error: string | null;
    success: boolean;
}
