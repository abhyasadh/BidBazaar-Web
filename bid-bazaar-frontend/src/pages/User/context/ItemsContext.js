import { createContext, useContext, useEffect, useState } from "react";
import { useProtectedApi, apis } from "../../../APIs/api";
import { toast } from "react-toastify";
import { useUser } from "../../../contexts/UserContext";
import { getSocket } from "../../../APIs/socket";

const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
  const { protectedGet } = useProtectedApi();
  const { user } = useUser();

  const [products, setProducts] = useState(null);
  const [saved, setSaved] = useState(null);
  const [categories, setCategories] = useState(null);
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await protectedGet(apis.getProducts);
        setProducts(res.data.products);
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
  }, [protectedGet, setCategories, user]);

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
    if (user !== null) fetchSaved();
  }, [protectedGet, update, user]);

  const unsave = (itemId) => {
    setSaved((prev) => prev.filter((item) => item.id !== itemId));
  };

  useEffect(() => {
    const socket = getSocket();

    if (socket) {
      socket.on("new-bid", (data) => {
        console.log("New Bid Data:", data);
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === data.productId
              ? {
                  ...product,
                  bidCount: data.bids.length,
                  highestBid: data.bids[0].price,
                  highestBidUpdatedAt: data.bids[0].createdAt,
                }
              : product
          )
        );
      });
    }

    return () => {
      if (socket) {
        socket.off("new-bid");
      }
    };
  }, []);

  return (
    <ItemsContext.Provider
      value={{ saved, products, categories, unsave, setUpdate }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => useContext(ItemsContext);
