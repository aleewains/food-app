import React, { createContext, useContext, useState } from "react";
import ToastView from "../components/ToastView";
import ErrorModal from "../components/ErrorModal";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  const showError = (message) => {
    setError(message);
  };

  const hideError = () => setError(null);

  return (
    <UIContext.Provider value={{ showToast, showError }}>
      {children}

      {/* GLOBAL UI LAYERS */}
      {toast && <ToastView toast={toast} />}

      {error && <ErrorModal message={error} onClose={hideError} />}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
