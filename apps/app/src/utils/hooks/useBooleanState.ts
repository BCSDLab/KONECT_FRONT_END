import { useState } from 'react';

function useBooleanState(defaultValue?: boolean) {
  const [value, setValue] = useState(!!defaultValue);

  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  const toggle = () => setValue((x) => !x);

  return { value, setTrue, setFalse, toggle, setValue };
}

export default useBooleanState;
