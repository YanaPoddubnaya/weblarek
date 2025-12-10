import {ensureElement} from "../../../utils/utils.ts";
import { ProductBaseView } from "./ProductBaseView.ts";
import { categoryMap } from "../../../utils/constants.ts";

export type CategoryKey = keyof typeof categoryMap;

interface IProductViewItemActions {
    onAddToCartClick(event: MouseEvent): void;
}

export class ProductViewItem extends ProductBaseView {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _description: HTMLElement;
    protected _buyButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected actions: IProductViewItemActions) {
        super(container);

        this._image = ensureElement<HTMLImageElement> ('.card__image', this.container);
        this._category = ensureElement<HTMLElement>('.card__category', this.container);
        this._description = ensureElement<HTMLElement>('.card__text', this.container);
        this._buyButton = ensureElement<HTMLButtonElement>('.card__button', this.container)

        this._buyButton.addEventListener('click', (event) => {
            actions.onAddToCartClick(event);
        });
    }

    set image(value: string) {
        this._image.src = value;
        this._image.alt = value;
    }

    set category(value: string) {
        this._category.textContent = value;
        this._setCategoryClass(value as CategoryKey);
    }

    set description (value: string) {
        this._description.textContent = value;
    }

    protected _setCategoryClass(value: CategoryKey): void {
        const categoryClass = this._getCategoryClassByCategory(value as CategoryKey)
        this._category.classList.add(categoryClass);
    }
}