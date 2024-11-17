import { useState } from "react";

function useCounter() {
  const [counter, setCounter] = useState(0);

  return {
    counter,
    incrementCounter() {
      setCounter((value) => value + 1);
    },
  };
}

export default function () {
  const { counter, incrementCounter } = useCounter();

  return (
    <>
      <button onClick={incrementCounter}>Counter is {counter}</button>
    </>
  );
}
