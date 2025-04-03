import React, { useEffect, useState } from "react";
import Item from "../components/Item";
import { apis, useProtectedApi } from "../../../APIs/api";
import { toast } from "react-toastify";

const Default = () => {
  const [products, setProducts] = useState(null);
  const { protectedGet } = useProtectedApi();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await protectedGet(apis.getProducts);
        setProducts(res.data.products);
      } catch (error) {
        toast.error("Failed to fetch categories!");
      }
    };
    fetchProducts();
  }, [protectedGet]);

  return (
    <>
      <h2 className="label">Trending</h2>
      <div className="items-container">
        {products &&
          products.map((product) => (
            <Item
              key={product.id}
              itemId={product.id}
              imageLink={product.image}
              title={product.name}
              price={product.highestBid ?? product.price}
              bidCount={product.bidCount ?? 0}
              endsIn={
                product.highestBidUpdatedAt
                  ? new Date(product.highestBidUpdatedAt).getTime() + 21600000
                  : new Date(product.createdAt).getTime() + 21600000 * 4
              }
            />
          ))}
        ;
      </div>
    </>
  );
};

export default Default;
