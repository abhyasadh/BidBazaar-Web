import React, { useEffect, useState } from "react";
import { useFilter } from "../context/FilterContext";
import { apis, useProtectedApi } from "../../../APIs/api";
import { toast } from "react-toastify";
import Item from "../components/Item";
import { useLocation } from "react-router-dom";
import { useItems } from "../context/ItemsContext";
import ItemLoader from "../components/ItemLoader";
import Empty from "../components/Empty";

const FilteredItems = () => {
  const location = useLocation();
  const { saved, categories } = useItems();

  const { filter, resetFilter } = useFilter();
  const filters = [];

  if (filter.categories.length && !filter.categories.includes("All")) {
    filter.categories.forEach((selectedCategory) => {
      const categoryData = categories.find(
        (item) => item.name === selectedCategory
      );
      if (categoryData) {
        filters.push({ name: selectedCategory, color: categoryData.color });
      }
    });
  }

  if (filter.price.min && filter.price.max) {
    filters.push({
      name: `Rs. ${filter.price.min} - Rs. ${filter.price.max}`,
      color: "var(--success-color)",
    });
  } else if (filter.price.min) {
    filters.push({
      name: `Minimum: Rs. ${filter.price.min}`,
      color: "var(--success-color)",
    });
  } else if (filter.price.max) {
    filters.push({
      name: `Maximum: Rs. ${filter.price.max}`,
      color: "var(--success-color)",
    });
  }

  if (filter.endsIn.min !== 0 || filter.endsIn.max !== 24) {
    filters.push({
      name: `Ends in: ${filter.endsIn.min} - ${filter.endsIn.max} Hours`,
      color: "red",
    });
  }

  if (filter.sortBy !== "None") {
    filters.push({
      name: `Sorted by: ${filter.sortBy} (${
        filter.lowToHigh ? "Low to High" : "High to Low"
      })`,
      color: "orange",
    });
  }

  const [allProducts, setAllProducts] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const { protectedPost } = useProtectedApi();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await protectedPost(apis.getFilteredProducts, filter);
        setAllProducts(res.data.products);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchProducts();
  }, [protectedPost, filter]);

  useEffect(() => {
    const currentPage = location.pathname;
    if (currentPage.startsWith("/saved") && allProducts) {
      setFilteredProducts(
        allProducts.filter((product) =>
          saved.some((item) => item.id === product.id)
        )
      );
    } else {
      setFilteredProducts(allProducts);
    }
  }, [location.pathname, allProducts, saved]);

  return (
    <div className="user-dashboard">
      <div style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
        <button
          onClick={() => {
            resetFilter();
          }}
          style={{
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            padding: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "32px",
          }}
        >
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
              fill="var(--text-color)"
            />
          </svg>
        </button>
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {filters.map((filter, index) => (
            <span
              key={index}
              style={{
                border: `2px solid ${filter.color}`,
                padding: "4px 10px",
                borderRadius: "10px",
                color: "var(--text-color)",
                whiteSpace: "nowrap",
              }}
            >
              {filter.name}
            </span>
          ))}
        </div>
      </div>
      <h2 className="label">Filtered Items</h2>
      {filteredProducts && filteredProducts.length === 0 ? (
        <Empty height={"100%"}/>
      ) : (
        <div className="items-container">
          {filteredProducts === null ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ width: "100%", aspectRatio: "1" }}>
                <ItemLoader />
              </div>
            ))
          ) : (
            filteredProducts.map((product) => (
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
            ))
          )}
          ;
        </div>
      )}
    </div>
  );
};

export default FilteredItems;
