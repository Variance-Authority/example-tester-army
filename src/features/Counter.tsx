import { useState } from 'react';

const LIMIT = 5;

export function Counter() {
  const [count, setCount] = useState(0);

  function increment() {
    if (count >= LIMIT) return;
    setCount(count + 1);
  }

  function reset() {
    setCount(0);
  }

  return (
    <>
      <h1 className="title">Count to five</h1>
      <p className="lede">Each press adds one, up to {LIMIT}.</p>

      <div className="row">
        <button className="button" type="button" onClick={increment} disabled={count >= LIMIT}>
          Add one
        </button>
        <button className="button" type="button" onClick={reset}>
          Reset
        </button>
      </div>
      <p className="status" role="status">
        {count === LIMIT ? `Reached ${LIMIT}.` : `Count: ${count}`}
      </p>
    </>
  );
}
