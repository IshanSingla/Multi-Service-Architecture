import axios from 'axios';

var data: any;
class ForeignService {
    static async getJWKS() {
        try {
            if (data) {
                return data;
            }
            const response = await axios.get(
                `${process.env.AUTH_SERVICE_URL}/private/jwks.json`
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
                `${process.env.CART_SERVICE_URL}/private/get`,
                { headers: { 'x-user-id': userId } }
            );
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch cart');
        }
    }
}

export default ForeignService;
