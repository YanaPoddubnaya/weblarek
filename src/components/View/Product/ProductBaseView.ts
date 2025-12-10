import {ensureElement} from "../../../utils/utils.ts";
import {Component} from "../../base/Component.ts"
import {IProduct} from "../../../types";
import {CategoryKey} from "./ProductViewItem.ts";
import {categoryMap} from "../../../utils/constants.ts";

export class ProductBaseView<T extends IProduct = IProduct> extends Component<T> {
    private _title: HTMLElement;
    private _price: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', this.container);
        this._price = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number | null) {
        this._price.textContent = value ? `${value} синапсов` : "Бесценно";
    }

    protected _getCategoryClassByCategory(key: CategoryKey): string {
        return categoryMap[key] || '';
    }
}