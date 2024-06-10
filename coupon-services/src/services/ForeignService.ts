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

    static async getCartofUser(userId: string) {
        try {
            const response = await axios.get(
                `${env.CART_SERVICE_URL}/private/get`,
                { headers: { 'x-user-id': userId } }
            );
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch cart');
        }
    }
}

export default ForeignService;
