import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useProtectedApi, apis } from "../../../APIs/api";
import { toast } from "react-toastify";
import { useUser } from "../../../contexts/UserContext";
import { getSocket } from "../../../APIs/socket";

const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
  const { protectedGet } = useProtectedApi();
  const socket = getSocket();
  const { user } = useUser();

  const [products, setProducts] = useState(null);
  const [saved, setSaved] = useState(null);
  const [categories, setCategories] = useState(null);
  const [update, setUpdate] = useState(0);

  const joinedRooms = useMemo(() => new Set(), []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await protectedGet(apis.getProducts);
        setProducts(res.data.products);
        res.data.products.forEach((element) => {
          if (!joinedRooms.has(element.id)) {
            socket.emit("join-room", element.id);
            joinedRooms.add(element.id);
          }
        });
      } catch (error) {
        toast.error("Failed to fetch products!");
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await protectedGet(apis.getCategories);
        setCategories(res.data.categories);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch categories!");
      }
    };

    if (user !== null) {
      fetchProducts();
      fetchCategories();
    }
  }, [protectedGet, setCategories, user, socket, joinedRooms]);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await protectedGet(apis.getSaved);
        setSaved(res.data.products);
        res.data.products.forEach((element) => {
          if (!joinedRooms.has(element.id)) {
            socket.emit("join-room", element.id);
            joinedRooms.add(element.id);
          }
        });
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch saved items!");
      }
    };
    if (user !== null) fetchSaved();
  }, [protectedGet, update, user, socket, joinedRooms]);

  const unsave = (itemId) => {
    setSaved((prev) => prev.filter((item) => item.id !== itemId));
  };

  useEffect(() => {
    if (!socket) return;

    const updateHandler = (data) => {
      setProducts((prev) =>
        prev?.map((item) =>
          String(item.id) === String(data.productId)
            ? { ...item, bidCount: data.bids.length, price: data.bids[0].price, highestBidUpdatedAt: new Date(data.bids[0].createdAt) }
            : item
        )
      );
  
      setSaved((prev) =>
        prev?.map((item) =>
          String(item.id) === String(data.productId)
            ? { ...item, bidCount: data.bids.length, price: data.bids[0].price, highestBidUpdatedAt: new Date(data.bids[0].createdAt) }
            : item
        )
      );
    };
  
    socket.on("bid-update", updateHandler);
  
    return () => {
      socket.off("bid-update", updateHandler);
    };
  }, [socket]);
  

  return (
    <ItemsContext.Provider
      value={{ saved, products, categories, unsave, setUpdate }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => useContext(ItemsContext);
