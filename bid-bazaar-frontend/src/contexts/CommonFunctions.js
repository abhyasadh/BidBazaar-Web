import { createContext, useContext } from "react";

const FunctionsContext = createContext();
export const FunctionsProvider = ({ children }) => {
  const formatDuration = (timestamp) => {
    const now = new Date();
    const timestampDate = new Date(timestamp);
    const endsInFuture = now < timestampDate;
    const difference = endsInFuture ? timestampDate - now : now - timestampDate;
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);

    return `${endsInFuture ? "Ends In:" : "Ended:"} ${
      days !== 0 ? days + "D" : ""
    } ${hours}H ${minutes}M`;
  };

  function generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  return (
    <FunctionsContext.Provider value={{ formatDuration, generateSlug }}>
      {children}
    </FunctionsContext.Provider>
  );
};

export const useFunctions = () => useContext(FunctionsContext);
