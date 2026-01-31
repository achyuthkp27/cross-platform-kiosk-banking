import { apiClient } from '../apiClient';
import { ApiResponse } from '../../types/services';

export interface CustomerAddress {
    line1: string;
    line2: string;
    city: string;
    pin: string;
}

export const customerApi = {
    async getAddress(): Promise<ApiResponse<CustomerAddress>> {
        return apiClient.get(`/customer/address`);
    },

    async updateAddress(address: CustomerAddress): Promise<ApiResponse<CustomerAddress>> {
        return apiClient.put(`/customer/address`, address);
    }
};
