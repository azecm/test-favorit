import { useEffect, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetGoodsQuery, errorOptions } from "../services/apiGoods.js";
import { useSelector } from "react-redux";
import { selectUserId } from "../features/user/userSlice.js";
import OffersTable from "./OffersTable.jsx";
import { ButtonRefetch } from "../elements/ButtonRefetch.jsx";
import { MessageWarning } from "../elements/MessageWarning.jsx";

function useDebounce(value = "", delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function BrandSearch() {
  const userId = useSelector(selectUserId) || "";

  const [number, setNumber] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const normalizedNumber = number.trim();
  const debouncedNumber = useDebounce(normalizedNumber);

  const isDebouncing = normalizedNumber !== debouncedNumber;
  const canSearch = Boolean(debouncedNumber) && !isDebouncing;

  const {
    currentData = {},
    isFetching,
    isError,
    isSuccess,
    refetch,
  } = useGetGoodsQuery(canSearch ? { number: debouncedNumber, key: userId } : skipToken);

  const isLoading = Boolean(normalizedNumber) && (isDebouncing || isFetching);

  /** @param {import('react').ChangeEvent<HTMLInputElement>} event */
  function handleNumberChange(event) {
    setNumber(event.target.value);
    setSelectedBrand("");
  }

  /** @param {import('react').ChangeEvent<HTMLSelectElement>} event */
  function handleBrandChange(event) {
    const brand = event.target.value;
    setSelectedBrand(brand);
  }

  const showResults = canSearch && !isFetching && isSuccess;
  const showError = canSearch && !isFetching && isError;

  const resultItems = (currentData.goods ?? []).filter((row) => !!row.brand.trim());

  const analogues = !resultItems.find((r) => r.brand === selectedBrand)?.count;

  return (
    <section className="card shadow-sm" aria-busy={isLoading}>
      <div className="card-body d-flex flex-column gap-2">
        <h2 className="h5">Поиск автозапчасти</h2>

        <div>
          <label htmlFor={`${userId}-number`} className="form-label">
            Артикул детали
          </label>

          <input
            id={`${userId}-number`}
            type="text"
            className="form-control"
            value={number}
            onChange={handleNumberChange}
            placeholder="Например, 7160500039S"
            autoComplete="off"
            spellCheck={false}
            aria-describedby={`${userId}-hint`}
          />

          <div id={`${userId}-hint`} className="form-text">
            Введите артикул - производители загрузятся автоматически.
          </div>
        </div>

        <div role="status">
          {isLoading && (
            <div className="d-flex align-items-center gap-2 text-secondary">
              <span className="spinner-border spinner-border-sm" aria-hidden="true" />
              Ищем производителей…
            </div>
          )}

          {showResults && resultItems.length === 0 && (
            <MessageWarning text="По этому артикулу производители не найдены." />
          )}
          {showResults && typeof currentData.error === "string" && (
            <MessageWarning
              text={
                errorOptions[currentData.error] || `Неопределенная ошибка: ${currentData.error}`
              }
            />
          )}
        </div>

        {showError && <ButtonRefetch refetch={refetch} />}

        {showResults && resultItems.length > 0 && (
          <div>
            <label htmlFor={`${userId}-brand`} className="form-label">
              Производитель
            </label>

            <select
              id={`${userId}-brand`}
              className="form-select"
              value={selectedBrand}
              onChange={handleBrandChange}
            >
              <option value="">Выберите производителя</option>

              {resultItems.map((row) => (
                <option key={row.brand} value={row.brand}>
                  {`${row.brand} [${row.count ? row.count : "только аналоги"}]`}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedBrand && normalizedNumber && (
          <OffersTable
            key={`${normalizedNumber}:${selectedBrand}`}
            number={normalizedNumber}
            brand={selectedBrand}
            analogues={analogues}
          />
        )}
      </div>
    </section>
  );
}
