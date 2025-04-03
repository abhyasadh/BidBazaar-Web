import React, { createContext, useContext, useState, useMemo, useCallback } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [formState, setFormState] = useState({
    activeForm: "login",
    formStage: 0,
  });

  const [formValues, setFormValues] = useState({
    phone: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profileImage: null,
  });

  const reset = () => setFormValues({
    phone: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profileImage: null,
  });

  const updateFormState = useCallback((key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateFormValues = useCallback((key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const contextValue = useMemo(() => ({ formState, updateFormState, formValues, updateFormValues, reset }), [formState, formValues, updateFormState, updateFormValues]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
