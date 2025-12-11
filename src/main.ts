import "./scss/styles.scss";

import { ProductGalleryItem } from "./components/View/Product/ProductGalleryItem.ts";
import { EventEmitter } from "./components/base/Events";
import Catalog from './components/Models/Catalog';
import Cart from './components/Models/Cart';
import Buyer from './components/Models/Buyer';
import ApiService from './components/Api/ApiService.ts';
import {Api} from './components/base/Api';
import {Gallery} from "./components/View/Gallery.ts";

import {apiProducts} from './utils/data';
import {cloneTemplate} from "./utils/utils.ts";
import {API_URL, CDN_URL} from "./utils/constants";

import {IProduct} from "./types";
import {Modal} from "./components/View/Modal.ts";
import {ProductItemView} from "./components/View/Product/ProductItemView.ts";
import {Header} from "./components/View/Header.ts";
import {ProductCartItemView} from "./components/View/Product/ProductCartItemView.ts";
import { CartView } from "./components/View/CartView.ts";
import {OrderForm} from "./components/View/Forms/OrderForm.ts";
import {ContactsForm} from "./components/View/Forms/ContactsForm.ts";
import {OrderSuccess} from "./components/View/Order.ts";

//создаем экземпляры классов
const events = new EventEmitter();
const catalog = new Catalog(CDN_URL, events);
const cart = new Cart(events);
const buyer = new Buyer(events);

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
        const products = await apiService.fetchProducts();
        catalog.setProducts(products);
        console.log('Каталог товаров:', catalog.getProducts());
    } catch (error) {
        console.error('Ошибка получения каталога:', error);
    }
}

fetchAndSaveProducts();

// header
const headerEl = document.querySelector('.header') as HTMLElement;
const header = new Header(events, headerEl);
///

/// MODAL
const modalTmpl = document.querySelector('#modal-container') as HTMLElement;
const modal = new Modal(modalTmpl, events);
////

const galleryEl = document.querySelector('.gallery') as HTMLElement;
const cardCatalogTmpl = document.querySelector('#card-catalog') as HTMLTemplateElement;
const modalItemTmpl = document.querySelector('#card-preview') as HTMLTemplateElement;

// gallery
const gallery = new Gallery(galleryEl);
const galleryItems = catalog.getProducts().map((product: IProduct) => {
    const cardView = new ProductGalleryItem(
        cloneTemplate(cardCatalogTmpl),
        {
            onClick: () => events.emit('product:select', product),
        }
    );

    return cardView.render(product);
});

gallery.render({ catalog: galleryItems});


// cart
const cartItemTmpl = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTmpl = document.querySelector('#order') as HTMLTemplateElement;
const contactsFormTmpl = document.querySelector('#contacts') as HTMLTemplateElement;
const orderSuccessTmpl = document.querySelector('#success') as HTMLTemplateElement;
const cartBasketEl = document.querySelector('#basket') as HTMLTemplateElement;
const cartView = new CartView(cloneTemplate(cartBasketEl), events);
const orderForm = new OrderForm(cloneTemplate(orderTmpl), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsFormTmpl), events);
const orderSuccess = new OrderSuccess(events, cloneTemplate(orderSuccessTmpl));


// events

function renderBasketModal() {
    const cartItems = cart.getItems().map((product: IProduct, index) => {
        const cartItem = new ProductCartItemView(
            cloneTemplate(cartItemTmpl),
            {
                onRemoveCartClick() {
                    cart.removeItem(product);
                    events.emit("cart:change", product);

                    renderBasketModal();
                },
            },
        );

        return cartItem.render({
            index: index + 1,
            ...product,
        });
    });

    modal.content = cartView.render({
        orderButtonActive: cart.getItemCount() > 0,
        items: cartItems,
        totalPrice: cart.getTotalPrice(),
    });
}

events.on("basket:open", () => {
    renderBasketModal();

    modal.open();
});

events.on("cart:paymentDetails", () => {
    modal.content = orderForm.render();
});

events.on("cart:contactDetails", () => {
    modal.content = contactsForm.render();
});

events.on("form:paymentMethodChange", (event: any) => {
    const fields = ['payment', 'address'];

    if (fields.includes(event.field)) {
        buyer.setData({ [event.field]: event.value });
    }

    const errors = buyer.validate();
    const formErrors = Object.entries(errors)
        .filter(([key]) => fields.includes(key));

    if (formErrors.length) {
        orderForm.setError(formErrors[0][1]);

        return;
    }

    orderForm.clearError();
});

events.on("form:detailsChange", (event: any) => {
    const fields = ['phone', 'email'];

    if (fields.includes(event.field)) {
        buyer.setData({ [event.field]: event.value });
    }

    const errors = buyer.validate();
    const formErrors = Object.entries(errors)
        .filter(([key]) => fields.includes(key));

    if (formErrors.length) {
        contactsForm.setError(formErrors[0][1]);

        return;
    }

    contactsForm.clearError();
});

events.on("cart:done", () => {
    modal.content = orderSuccess.render({
        totalPrice: cart.getTotalPrice(),
    });

    cart.clear();
    buyer.clear();
});

events.on("order:done", () => {
    events.emit('modal:close');
});

events.on("modal:close", () => {
    modal.close();
});

events.on("cart:modalAddItem", (product: IProduct) => {
    cart.addItem(product);
    renderProductViewItemModal(product);
});

events.on("cart:modalRemoveItem", (product: IProduct) => {
    cart.removeItem(product);
    renderProductViewItemModal(product);
});

events.on("cart:addItem", () => {
    events.emit("cart:change");
});

events.on("cart:removeItem", () => {
    events.emit("cart:change");
});

events.on("cart:clear", () => {
    events.emit("cart:change");
});

events.on("cart:change", () => {
    header.render({
        counter: cart.getItemCount(),
    });
});

function renderProductViewItem(product: IProduct): HTMLElement {
    const modalItem = new ProductItemView(
        cloneTemplate(modalItemTmpl),
        {
            onCartBtnClick() {
                let event = "cart:modalAddItem";

                if (cart.hasItem(product.id)) {
                    event = "cart:modalRemoveItem";
                }

                events.emit(event, product);
            },
        },
    );

    let buyButtonText = 'Купить';

    if (typeof product.price !== "number") {
        buyButtonText = 'Недоступно';
    } else if (cart.hasItem(product.id)) {
        buyButtonText = 'Удалить из корзины';
    }

    return modalItem.render({
        buyAllowed: typeof product.price == "number",
        buyButtonText,
        ...product,
    });
}

function renderProductViewItemModal(product: IProduct) {
    modal.content = renderProductViewItem(product);
}

events.on("product:select", (product: IProduct) => {
    renderProductViewItemModal(product);
    modal.open();

    console.log("Каталог — карточка нажата!", product);
});