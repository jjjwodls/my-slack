import { ChangeEvent, Dispatch, SetStateAction, useCallback, useState } from 'react';

type ReturnTypes<T> = [T, (e: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>];
//customhook
const useInput = <T>(initialData: T): ReturnTypes<T> => {
  //타입을 추가하여 안정성을 추구하고 제네릭으로 처리하자.
  //useCallback에 대한 타입 매개변수.
  const [value, setValue] = useState(initialData);
  const handler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    //우선 any로 처리.
    setValue(e.target.value as unknown as T); //타입을 강제로 바꿔줌.
  }, []);
  return [value, handler, setValue];
};

export default useInput;
