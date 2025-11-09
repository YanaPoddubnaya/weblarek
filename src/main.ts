import "./scss/styles.scss";

import {apiProducts} from '../src/utils/data';
import Catalog from './components/Models/Catalog';
import Cart from './components/Models/Cart';
import Buyer from './components/Models/Buyer';
import ApiService from './components/Models/ApiService';
import {Api} from './components/base/Api';
import {API_URL} from "./utils/constants";

//создаем экземпляры классов
const catalog = new Catalog();
const cart = new Cart();
const buyer = new Buyer();

// Создаем экземпляры Api и ApiService
const api = new Api(API_URL);
const apiService = new ApiService(api);

//проверка методов
catalog.setProducts(apiProducts.items);
console.log('Массив товаров из каталога:', catalog.getProducts());
const idToCheck = apiProducts.items[0].id;
console.log('Товар по id:', catalog.getProductById(idToCheck));

cart.addItem(apiProducts.items[0]);
if (cart.hasItem(idToCheck)) {
    console.log(`Товар с id ${idToCheck} есть в корзине.`);
} else {
    console.log(`Товара с id ${idToCheck} в корзине нет.`);
}

//console.log('Добавление товара в корзину:', cart.addItem())
console.log('Товары в корзине:', cart.getItems());
console.log('Количество товаров в корзине:', cart.getItemCount());
console.log('Общая стоимость:', cart.getTotalPrice());
const itemToRemove = cart.getItems()[0];
console.log('Удаление товара из корзины:', cart.removeItem(itemToRemove));
console.log('Очистка корзины:', cart.clear());


buyer.setData({payment: 'card', email: 'user@example.com', phone: '12345', address: 'г.Москва, ул.Ленина 372'});
console.log('Данные покупателя:', buyer.getData());
console.log('Очистка данных покупки:', buyer.clear());
console.log('Ошибки валидации:', buyer.validate());


const validationErrors = buyer.validate();
if (Object.keys(validationErrors).length > 0) {
    // есть ошибки, показываем пользователю
    console.log('Ошибки валидации:', validationErrors);
} else {
    // ошибок нет, можно продолжать
}

async function fetchAndSaveProducts() {
    try {
        const products = await apiService.fetchProducts(); // вызов реального API
        catalog.setProducts(products);
        console.log('Каталог товаров:', catalog.getProducts());
    } catch (error) {
        console.error('Ошибка получения каталога:', error);
    }
}

fetchAndSaveProducts();
