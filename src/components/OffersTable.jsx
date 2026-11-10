import { useMemo } from "react";
import { useGetGoodsQuery } from "../services/apiGoods.js";
import { useSelector } from "react-redux";
import { selectUserId } from "../features/user/userSlice.js";
import { ButtonRefetch } from "../elements/ButtonRefetch.jsx";
import { MessageWarning } from "../elements/MessageWarning.jsx";

const priceFormatter = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** @param {number} price */
function formatPrice(price) {
  return typeof price === "number" && Number.isFinite(price) ? priceFormatter.format(price) : "-";
}

/** @param {import('../types.js').DataGoodsRow} product */
function isRealProduct(product) {
  return Boolean(product?.number || product?.brand || product?.name);
}

/**
 * @typedef {Object} ResultRow
 * @property {string} key
 * @property {string} type
 * @property {import('../types.js').DataGoodsRow} product
 * @property {import('../types.js').DataWarehouse | null} warehouse
 */

/**
 * @param {Array<import('../types.js').DataGoodsRow>} goods
 * @returns {Array<ResultRow>}
 */
function buildRows(goods) {
  /** @type {Array<ResultRow>} */
  const rows = [];

  /**
   * @param {import('../types.js').DataGoodsRow} product
   * @param {string} type
   * @param {string} productKey
   */
  function addProduct(product, type, productKey) {
    if (!isRealProduct(product)) {
      return;
    }

    const warehouses = Array.isArray(product.warehouses) ? product.warehouses : [];

    if (warehouses.length) {
      warehouses.forEach((warehouse, index) => {
        rows.push({
          key: `${productKey}-${warehouse.id ?? "warehouse"}-${index}`,
          type,
          product,
          warehouse,
        });
      });
    }
  }

  goods.forEach((product, index) => {
    if (!product) return;

    const productKey = `${product.goodsID ?? "product"}-${index}`;

    addProduct(product, "Искомая деталь", productKey);

    if (Array.isArray(product.analogues)) {
      product.analogues.forEach((analogue, analogueIndex) => {
        addProduct(analogue, "Аналог", `${productKey}-analogue-${analogueIndex}`);
      });
    }
  });

  return rows;
}

/**
 * @param {Object} options
 * @param {string} options.number
 * @param {string} options.brand
 * @param {boolean} options.analogues
 */
export default function OffersTable({ number, brand, analogues }) {
  const userId = useSelector(selectUserId) || "";
  const {
    currentData = {},
    isFetching,
    isError,
    refetch,
  } = useGetGoodsQuery({
    number,
    brand,
    key: userId,
    info: "on",
    ...(analogues ? { analogues: "on" } : null),
  });

  const rows = useMemo(() => buildRows(currentData.goods ?? []), [currentData.goods]);

  if (isFetching) {
    return (
      <div className="d-flex align-items-center gap-2" role="status">
        <span className="spinner-border spinner-border-sm text-primary" aria-hidden="true" />
        Загружаем предложения и аналоги…
      </div>
    );
  }

  if (isError) {
    return <ButtonRefetch refetch={refetch} />;
  }

  if (rows.length === 0) {
    return <MessageWarning text="Для выбранной детали предложения и аналоги не найдены." />;
  }

  return (
    <section className="mt-2">
      <h2 className="h5">Предложения и аналоги</h2>

      <div className="d-flex justify-content-between">
        <div className="text-secondary">
          Артикул: <strong>{number}</strong>
          {" · "}
          Производитель: <strong>{brand}</strong>
        </div>
        <div className="text-secondary d-none d-lg-block">
          <strong>НП</strong> - невозвратная позиция*
        </div>
      </div>

      <div>
        <table className="table table-striped table-hover align-middle">
          <caption>Цена и остаток указаны отдельно для каждого склада.</caption>

          <thead className="sticky-top bg-white">
            <tr>
              <th scope="col" className="d-none d-md-table-cell">
                Тип
              </th>
              <th scope="col">Название / Производитель</th>
              <th scope="col" className="d-none d-md-table-cell">
                Артикул
              </th>
              <th scope="col" className="d-none d-md-table-cell">
                Склад
              </th>
              <th scope="col" className="text-end">
                Цена
              </th>
              <th scope="col" className="text-end">
                Остаток
              </th>
              <th
                scope="col"
                className="text-center d-none d-lg-table-cell"
                title="Невозвратная позиция"
              >
                НП
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map(({ key, type, product, warehouse }) => (
              <tr key={key}>
                <td className="d-none d-md-table-cell">
                  <span
                    className={`badge ${
                      type === "Аналог" ? "text-bg-secondary" : "text-bg-primary"
                    }`}
                  >
                    {type}
                  </span>
                </td>

                <td>
                  <div className="fw-semibold">{product.name || "Без названия"}</div>
                  <div className="small text-secondary">{product.brand || "-"}</div>
                </td>

                <td className="text-nowrap d-none d-md-table-cell">{product.number || "-"}</td>

                <td className="d-none d-md-table-cell">
                  {warehouse ? warehouse.code || warehouse.id || "Не указан" : "Нет предложений"}
                </td>

                <td className="text-end text-nowrap">{formatPrice(warehouse?.price ?? 0)}</td>

                <td className="text-end">{warehouse?.stock ?? "-"}</td>

                <td className="text-center d-none d-lg-table-cell fs-3">
                  {warehouse?.notRefund ? <span title="Невозвратная позиция">✔</span> : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
