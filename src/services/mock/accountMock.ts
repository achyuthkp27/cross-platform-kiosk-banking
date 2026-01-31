/**
 * Mock implementation for Account Service
 */

import { IAccountService } from '../../types/serviceInterfaces';
import { ApiResponse, Account, AccountStatement } from '../../types/services';
import { MOCK_ACCOUNTS, delay, generateMockRefId } from './mockData';

export const accountMock: IAccountService = {
    async getAccounts(customerId: string): Promise<ApiResponse<Account[]>> {
        await delay(500);

        const accounts = MOCK_ACCOUNTS[customerId] || [];

        return {
            success: true,
            data: accounts
        };
    },

    async getBalance(accountId: number): Promise<ApiResponse<{ balance: number; available: number }>> {
        await delay(300);

        // Find account across all customers
        for (const accounts of Object.values(MOCK_ACCOUNTS)) {
            const account = accounts.find(a => a.id === accountId);
            if (account) {
                return {
                    success: true,
                    data: {
                        balance: account.balance,
                        available: account.availableBalance
                    }
                };
            }
        }

        return {
            success: false,
            message: 'Account not found'
        };
    },

    async getStatement(accountId: number): Promise<ApiResponse<AccountStatement[]>> {
        await delay(800);

        // Generate mock statement
        const statements: AccountStatement[] = [
            {
                id: 1,
                txnType: 'CREDIT',
                amount: 25000,
                balanceAfter: 50000,
                description: 'Salary Credit',
                referenceId: generateMockRefId(),
                txnDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 2,
                txnType: 'DEBIT',
                amount: 1500,
                balanceAfter: 48500,
                description: 'ATM Withdrawal',
                referenceId: generateMockRefId(),
                txnDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 3,
                txnType: 'DEBIT',
                amount: 500,
                balanceAfter: 48000,
                description: 'Bill Payment - Electricity',
                referenceId: generateMockRefId(),
                txnDate: new Date().toISOString()
            }
        ];

        return {
            success: true,
            data: statements
        };
    }
};
