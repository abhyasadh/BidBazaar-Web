import { createContext, useContext, useEffect, useState } from "react";
import { useProtectedApi, apis } from "../../../APIs/api";
import { toast } from "react-toastify";

const SavedContext = createContext();

export const SavedProvider = ({ children }) => {
  const { protectedGet } = useProtectedApi();
  const [saved, setSaved] = useState([]);
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await protectedGet(apis.getSaved);
        setSaved(res.data.products);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch saved items!");
      }
    };
    fetchSaved();
  }, [protectedGet, update]);

  const unsave = (itemId) => {
    setSaved((prev) => prev.filter((item) => item.id !== itemId));
  }

  return (
    <SavedContext.Provider value={{ saved, unsave, setUpdate }}>{children}</SavedContext.Provider>
  );
};

export const useSaved = () => useContext(SavedContext);
