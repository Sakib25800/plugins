import { ChangeEvent, useState } from "react";

type FormState<T> = {
  [K in keyof T]: T[K];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useForm<T extends Record<string, any>>(initialState: T) {
  const [formState, setFormState] = useState<FormState<T>>(initialState);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormState(initialState);
  };

  return {
    formState,
    setFormState,
    handleChange,
    resetForm,
  };
}

export default useForm;
