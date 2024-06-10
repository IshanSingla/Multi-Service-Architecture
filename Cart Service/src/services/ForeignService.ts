import axios from 'axios';

var data: any;
class ForeignService {
    private static productServiceUrl: string =
        process.env.PRODUCT_SERVICE_URL ?? '';
    static authServiceUrl = process.env.AUTH_SERVICE_URL ?? '';

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
    static async getProductDetails(productId: string): Promise<any> {
        try {
            const response = await axios.get(
                `${process.env.PRODUCT_SERVICE_URL}/private/products?id=${productId}`
            );
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data ??
                    'Product not found'
            );
        }
    }
}

export default ForeignService;
