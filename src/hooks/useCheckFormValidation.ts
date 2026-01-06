import { useRef, useState } from "react";

export const useCheckFormValidation = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = () => {
    if (formRef.current) {
      setIsFormValid(formRef.current.checkValidity());
    }
  };

  return [isFormValid, formRef, handleInputChange] as const;
};
