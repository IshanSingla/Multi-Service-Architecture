import axios from 'axios';
import { env } from '../configs/env';

var data: any;
class ForeignService {
    static async getJWKS() {
        try {
            if (data) {
                return data;
            }
            const response = await axios.get(
                `${env.AUTH_SERVICE_URL}/private/jwks.json`
            );
            data = response.data;
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch JWKS');
        }
    }

    static async getProductDetails(): Promise<any[]> {
        try {

            const response = await axios.get(
                `${env.PRODUCT_SERVICE_URL}/private/products`
            );
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data ?? 'Product not found'
            );
        }
    }
    static async getProductDetailsById(
        productId: string
    ): Promise<any[]> {
        try {
            const response = await axios.get(
                `${env.PRODUCT_SERVICE_URL}/private/products?id=${productId}`
            );
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data ?? 'Product not found'
            );
        }
    }
}

export default ForeignService;
