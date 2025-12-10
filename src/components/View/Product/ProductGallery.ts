import {ensureElement} from "../../../utils/utils.ts";
import { ProductBaseView } from "./ProductBaseView.ts";
import {CategoryKey} from "./ProductViewItem.ts";

interface IProductGalleryItemActions {
    onClick(event: MouseEvent): void;
}

export class ProductGalleryItem extends ProductBaseView {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;

    constructor(container: HTMLElement, protected actions: IProductGalleryItemActions) {
        super(container);

        this._image = ensureElement<HTMLImageElement>('.card__image', this.container);
        this._category = ensureElement<HTMLElement>('.card__category', this.container);
        this.container.addEventListener('click', actions.onClick);
    }

    set image(value: string) {
        this._image.src = value;
        this._image.alt = value;
    }

    set category(value: string) {
        this._category.textContent = value;
        this._setCategoryClass(value as CategoryKey);
    }

    protected _setCategoryClass(value: CategoryKey): void {
        const categoryClass = this._getCategoryClassByCategory(value as CategoryKey)
        this._category.classList.add(categoryClass);
    }
}
