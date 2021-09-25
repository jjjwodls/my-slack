import { Dispatch, SetStateAction, useCallback, useState } from 'react';

type ReturnTypes<T> = [T, (e: any) => void, Dispatch<SetStateAction<T>>];
//customhook
const useInput = <T>(initialData: T): ReturnTypes<T> => {
  //타입을 추가하여 안정성을 추구하고 제네릭으로 처리하자.
  //useCallback에 대한 타입 매개변수.
  const [value, setValue] = useState(initialData);
  const handler = useCallback((e: any) => {
    //우선 any로 처리.
    setValue(e.target.value);
  }, []);
  return [value, handler, setValue];
};

export default useInput;
