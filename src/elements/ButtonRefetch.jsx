import { messageNetworkError } from "../const.js";

/**
 * @param {Object} options
 * @param {Function} options.refetch
 */
export function ButtonRefetch({ refetch }) {
  return (
    <div className="alert alert-danger mt-4 mb-4" role="alert">
      <div>{messageNetworkError}</div>
      <button
        type="button"
        className="btn btn-outline-danger btn-sm mt-2"
        onClick={() => refetch()}
      >
        Повторить
      </button>
    </div>
  );
}
