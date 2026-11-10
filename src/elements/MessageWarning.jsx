/**
 * @param {Object} options
 * @param {string} options.text
 */
export function MessageWarning({ text }) {
  return (
    <div className="alert alert-warning mb-0" role="status">
      {text}
    </div>
  );
}
