import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useGlobalContext } from "./GlobalProvider";

export const ErrorContext = createContext<{
  setErrorMessage: (message: string) => void;
} | null>(null);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const globalContext = useGlobalContext();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const clearErrorMessage = useCallback(() => {
    setErrorMessage("");
  }, []);

  useEffect(() => {
    clearErrorMessage();
  }, [globalContext.step]);

  return (
    <ErrorContext.Provider value={{ setErrorMessage }}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {errorMessage && <Alert message={errorMessage} />}
        {children}
      </div>
    </ErrorContext.Provider>
  );
};

export const Alert = ({ message }: { message: string }) => {
  return (
    <div className="alert">
      <div className="icon icon--warning" />
      <p className="error-message">{message}</p>
    </div>
  );
};

export const useErrorContext = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useErrorContext must be used within a ErrorProvider");
  }
  return context;
};
