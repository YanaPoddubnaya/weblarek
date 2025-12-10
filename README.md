# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

git@github.com:YanaPoddubnaya/weblarek.git



### Данные:
 IProduct
  `id: string` - уникальный идентификатор товара
  `description: string` - описание товара
  `image: string` - ссылка на изображение товара
  `title: string` - название товара
  `category: string` - категория, к которой принадлежит товар
  `price: number | null` - цена товара, может отсутствовать

 IBuyer
  `payment: 'card'|'cash'` - способ оплаты: карта или наличные
  `email: string` - адрес электронной почты покупателя
  `phone: string` - номер телефона
  `address: string` - адрес покупателя

### Класс Catalog
Хранит массив всех товаров, доступных в магазине, и выбранный для подробного отображения товар.

Методы класса: 
`setProducts(products: IProduct[]): void` - сохранение массива товаров полученного в параметрах метода;
`getProducts(): IProduct[]` - получение массива товаров из модели;
`getProductById(id: string): IProduct | undefined` - получение одного товара по его id;
`setSelectedProduct(product: IProduct): void` - сохранение товара для подробного отображения;
`getSelectedProduct(): IProduct | null` - получение товара для подробного отображения. 
 
### Класс Cart 
Хранит массив товаров, выбранных покупателем для покупки.

`items: IProduct[]` — товары в корзине
 
Методы класса:
`getItems(): IProduct[]` - возвращение массива товаров, которые находятся в корзине;
`addItem(item: IProduct): void` - добавление товара, который был получен в параметре, в массив корзины;
`removeItem(item: IProduct): void` - удаление товара, полученного в параметре из массива корзины;
`clear(): void` - очистка корзины;
`getTotalPrice(): number` - получение стоимости всех товаров в корзине;
`getItemCount(): number` - возвращение количества товаров в корзине;
`hasItem(id: string): boolean` - проверка наличия товара в корзине по его id, полученного в параметр метода.
 
### Класс Buyer
Хранит и управляет данными покупателя, необходимыми для заказа.

Методы класса:
`setData(data: Partial<IBuyer>): void` - сохранение данных в модели. Один общий метод или отдельные методы для каждого поля. Важно учесть, что должна быть реализована возможность сохранить только одно значение, например, только адрес или только телефон, не удалив при этом значения других полей, которые уже могут храниться в классе;
`getData(): IBuyer` - возвращает всех данных покупателя;
`clear(): void` - очистка данных покупателя;
`validate(): {[key in keyof IBuyer]?: string}` - валидация данных. Обратите внимание, что правила валидации описаны в функциональных требованиях. Поле является валидным, если оно не пустое. Метод валидации должен давать возможность определить не только валидность каждого отдельного поля, но и предоставлять информацию об ошибке, связанной с проверкой конкретного значения.

Поля:
 `payment: 'card' | 'cash' | null` — способ оплаты
 `email: string | null` — электронная почта
 `phone: string | null` — телефон
 `address: string | null` — адрес

 ### Слой коммуникации
ApiService — класс, отвечающий за коммуникацию с сервером. Использует экземпляр класса Api для выполнения HTTP-запросов.

Основной метод fetchProducts() асинхронно получает с сервера объект с массивом товаров и возвращает массив IProduct[].

Обрабатывает ошибки запроса, при неудаче возвращает пустой массив.

Реализована композиция: в конструктор передается экземпляр Api.

Пример использования:
const api = new Api();
const apiService = new ApiService(api);
const products = await apiService.fetchProducts();
console.log('Полученные товары:', products);

### View
Слой представления

### class Component
Поля:
`container: HTML Element`;
Методы класса:
`render(data?: Partial<T>): HTMLElement`;

### class Header
Поля:
`basketButton: HTMLButtonElement`;
`counterElement: HTMLElement`;

Методы класса:
`set counter(value:number)`;

Interface:
`HeaderData(counter:number)`;

### class Gallery
Методы класса:
`set catalog(items: HTMLElement[])`;

Interface:
`GalleryData (Catalog: HTMLElement[])`;

### class Modal
Поля:
`contentElement : HTMLElement`;
`closeButton: HTMLButtonElement`;

Методы класса: 
`set content (item: HTML Element)`;

Interface: 
`Modal Window (content: HTML Element)`;

### class ProductBaseView
Поля:
`private _title: HTMLElement`;
`private _price: HTMLElement`;

Методы класса:
`set title (value: string)`;
`set price (value: number)`;

### class ProductCartItem
Поля:
`index: HTMLElement`;
`deleteButton: HTMLButtonElement`;

Методы класса:
`set index(value: number)`;

Interface:
`IProductCartItemActions(onRemoveCartClick(event: MouseEvent): void;)`;
`ICartProduct(index:number)`;

### class ProductViewItem
Поля:
`_image: HTMLImageElement`;
`_category: HTMLElement`;
`_description: HTMLElement`;
`_buyButton: HTMLButtonElement`;

Методы класса:
`set _image (value: string)`;
`set _category (value: string)`;
`set _description (value: string)`;

Interface:
`IProductViewItemActions(onAddToCartClick(event: MouseEvent): void) `;

### class ProductGalleryItem
Поля:
`image: HTMLImageElement`;
`category: HTMLElement`;

Методы класса:
`set image (value: string)`;
`set category (value: string)`;

Interface:
`IProductViewItemActions(onAddToCartClick(event: MouseEvent): void) `;


### class CartView
Поля:
`itemsContainer: HTMLElement`;
`totalPriceEl: number`;
`orderButton: HTMLElement`; 

Методы класса:
`set items(value: HTMLElement[])`;
`set totalPrice(value:number)`;

Interface:
CartData
`items: HTMLElement[]`;
`totalPrice: number`;

### class BaseForm
Поля:
`actionButton: HTMLButtonElement`;
`errorElement: HTMLElement`;

### class ContactsForm
Поля:
`emailInput: HTMLInputElement`;
`phoneInput: HTMLInputElement`;

### class OrderFrom
Поля:
`cardButton: HTMLButtonElement`;
`cashButton: HTMLButtonElement`;
`inputAddres: HTMLInputElement`;

### class OrderSuccess
Поля:
`description: HTMLElement`;
`doneButton: HTMLButtonElement`;

Методы класса: 
`set totalPrice(value:number)`;

Interface
`IOrderSuccess (totalPrice: number)`;


### Presenter
`catalog:change` - получение массива товаров и создание карточек для галереи;
`cart:change` - обновляет количество товаров в шапке и рендерит корзину;
`buyer:change` - обрабатывает валидацию данных формы;
`product:select` - добавляет товар в корзину и обновляет корзину;
`basket:open` - рендерит содержимое корзины и открывает модальное окно;
`cart:paymentDetails` - подставляет форму оплаты (OrderForm) в модальное окно;
`cart:contactDetails` - подставляет форму контактов (ContactsForm) в модальное окно;
`form:paymentMethodChange` - обновляет данные в модели Buyer и проверяет валидацию;
`form:detailsChange` - обновляет данные покупателя и проверяет валидацию;
`cart:done` - открывает окно успешного завершения заказа (OrderSuccess), очищает корзину и данные покупателя;
`order:done` - закрывает модальное окно;
`modal:close` - закрывает модальное окно;

