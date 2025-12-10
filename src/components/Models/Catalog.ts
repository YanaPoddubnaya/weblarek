import { IProduct } from '../../types';

class Catalog {
    private products: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    constructor(private _imageCDN: string) {
    }

    setProducts(products: IProduct[]): void {
        this.products = products.map((product) => {
            product.image = this._imageCDN + product.image;

            return product;
        });
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}

export default Catalog;