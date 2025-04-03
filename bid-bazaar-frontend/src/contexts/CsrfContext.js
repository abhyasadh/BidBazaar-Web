import { createContext, useContext, useState, useEffect } from "react";
import { getCsrfTokenApi } from "../APIs/api";

const CsrfContext = createContext();

export const CsrfProvider = ({ children }) => {
  const [csrfToken, setCsrfToken] = useState(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await getCsrfTokenApi();
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.log("Failed to fetch CSRF token.");
      }
    };
    fetchCsrfToken();
  }, []);

  return (
    <CsrfContext.Provider value={{ csrfToken }}>
      {children}
    </CsrfContext.Provider>
  );
};

export const useCsrf = () => useContext(CsrfContext);
