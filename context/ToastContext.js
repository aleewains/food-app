import React, { createContext, useState, useContext } from "react";
import ToastView from "../components/ToastView";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });

    setTimeout(() => {
      setToast({ visible: false, message: "", type: "success" });
    }, 2000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && <ToastView toast={toast} />}
    </ToastContext.Provider>
  );
};
