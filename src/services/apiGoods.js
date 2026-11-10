import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../const.js";

/**
 * @typedef {Object} QueryParam
 * @property {string} key - Уникальный ключ покупателя
 * @property {string} number - Номер детали
 * @property {string} [brand] - Производитель (не обязательный параметр)
 * @property {string} [analogues] - Если указать значение «on» и заполнить параметр brand – будут возвращаться аналоги детали
 * @property {string} [info] - Если указать значение «on», то в ответе будет признак невозвратных позиций
 */

export const apiGoods = createApi({
  reducerPath: "apiGoods",
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),

  endpoints: (builder) => ({
    getGoods: builder.query({
      /** @param {QueryParam} params */
      query: (params) => ({
        url: "hsprice/",
        params: Object.fromEntries(
          Object.entries(params).map(([k, v]) => [k, encodeURIComponent(v)]),
        ),
      }),

      /** @param {import('../types.js').DataResultGoods} response */
      transformResponse: (response) => response,

      keepUnusedDataFor: 60,
    }),
  }),
});

/** @type Object.<string, string> */
export const errorOptions = {
  "Empty key!": "Не указан ключ покупателя",
  "Invalid key client!": "Неверный ключ покупателя, покупатель не найден",
  "Empty number goods!": "Не указан номер детали",
  "Request quota exceeded!":
    "Вы превысили лимит запросов по грузовому ассортименту (у нас для каждого клиента есть ограничения на поиск грузовых запчастей)",
};

export const { useGetGoodsQuery } = apiGoods;
