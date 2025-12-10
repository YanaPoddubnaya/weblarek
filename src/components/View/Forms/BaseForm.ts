import {ensureElement} from "../../../utils/utils.ts";
import {Component} from "../../base/Component.ts"
import type { IEvents } from "../../base/Events.ts";

export class BaseForm extends Component<any>{
    protected actionButton: HTMLButtonElement;
    protected errorElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.actionButton = ensureElement<HTMLButtonElement>('.button', this.container);
        this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container);
    }

    public setError(message: string) {
        this.errorElement.textContent = message;
        this.actionButton.disabled = true;
    }

    public clearError() {
        this.errorElement.textContent = '';
        this.actionButton.disabled = false;
    }
}