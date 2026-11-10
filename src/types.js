/**
 * @typedef {Object} DataResultGoods
 * @property {Array<DataGoodsRow>} [goods] - Список товаров
 * @property {string} [error]  - Код ошибки
 */

/**
 * @typedef {Object} DataGoodsRow
 * @property {string} goodsID - Идентификатор товара
 * @property {string} brand  - Производитель
 * @property {string} number - Номер детали
 * @property {string} name - Наименование детали
 * @property {number} count - Остаток на всех складах
 * @property {number} rate - Кратность
 * @property {boolean} notRefund - Невозвратная позиция
 * @property {Array<DataGoodsRow>} analogues - Массив с аналогами, если «analogues=on» и brand
 * @property {Array<DataWarehouse>} warehouses - Массив складов на которых имеется товар
 */

/**
 * @typedef {Object} DataWarehouse
 * @property {string} code - Сокращенное наименование склада
 * @property {string} id - Внутренний идентификатор склада
 * @property {boolean} own - Товар находиться на нашем складе
 * @property {string} shipmentDate - Поле содержит Дату и Время
 * @property {number} price - Цена
 * @property {number} stock - Остаток на этом складе
 * @property {boolean} notRefund - Невозвратная позиция
 */
