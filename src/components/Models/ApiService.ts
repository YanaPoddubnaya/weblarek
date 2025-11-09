import { IApi, IProduct, ApiPostMethods } from '../../types';

class ApiService {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    async fetchProducts(): Promise<IProduct[]> {
        try {
            const response = await this.api.get<{ items: IProduct[] }>('/product');
            return response.items;
        } catch (error) {
            console.error('Ошибка получения товаров:', error);
            return [];
        }
    }

    async sendOrder(orderData: object): Promise<boolean> {
        try {
            await this.api.post('/orders', orderData, 'POST' as ApiPostMethods);
            return true;
        } catch (error) {
            console.error('Ошибка отправки заказа:', error);
            return false;
        }
    }
}

export default ApiService;