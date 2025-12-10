import type { IEvents } from "../base/Events";
import { ProductGalleryItem } from "../View/Product/ProductGallery.ts";
import { Modal} from "../View/Modal.ts";
import {ProductViewItem} from "./Product/ProductViewItem.ts";

// Тип данных модели товара
export interface IProductModel {
    title: string;
    price: number | null;
    image: string;
    category: string;
}

export class ProductPresenter {
    constructor(
        private model: IProductModel,
        private view: ProductGalleryItem,
        private events: IEvents
    ) {
        // Устанавливаем данные из модели в view
        this.view.image = this.model.image;
        this.view.category = this.model.category;

        this.view.onClick(() => {
            this.events.emit('product:select', this.model);
        });

    }
}

export class ModalPresenter {
    constructor(private modal: Modal, private events: IEvents) {
        this.events.on('product:select', (product: IProductModel) => {
            const content = document.createElement('div');
            const productView = new ProductViewItem(content, this.events);
            productView.image = product.image;
            productView.category = product.category as any;
            productView.description = product.title;

            this.modal.content = productView.render();
            this.modal.open();
        });

        // Закрытие модалки
        this.events.on('modal:close', () => {
            this.modal.close();
        });
    }
}



