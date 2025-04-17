import React, { useCallback, useEffect, useRef, useState } from "react";
import { useItems } from "../context/ItemsContext";
import { useProtectedApi } from "../../../APIs/api";
import { getSocket } from "../../../APIs/socket";
import { toast } from "react-toastify";
import ItemLoader from "./ItemLoader";
import Item from "./Item";

const InfiniteProducts = ({
  shimmerCount = 24,
  products,
  setProducts,
  offset,
  setOffset,
  fetchFunction,
}) => {
  const { joinedRooms } = useItems();
  const { protectedGet } = useProtectedApi();
  const socket = getSocket();
  const itemsContainerRef = useRef(null);

  const [gridCount, setGridCount] = useState(0);

  const [limit, setLimit] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const offsetRef = useRef(offset);

  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  useEffect(() => {
    const grid = itemsContainerRef?.current;
    if (!grid) return;

    const gridColumnCount = window
      .getComputedStyle(grid)
      .getPropertyValue("grid-template-columns")
      .split(" ").length;

    setGridCount(gridColumnCount);

    const visibleRows = Math.ceil((window.innerHeight - 120) / 280);
    const calculatedLimit = gridColumnCount * Math.ceil(visibleRows * 1.5);
    setLimit(calculatedLimit);
  }, []);

  useEffect(() => {
    if (!limit) return;

    const fetchInitialProducts = async () => {
      try {
        const res = await fetchFunction({ limit, offset: 0 });
        const newProducts = res.data.products;

        setProducts(newProducts);
        setOffset(1);
        setHasMore(newProducts.length >= limit);

        newProducts.forEach((item) => {
          if (!joinedRooms.has(item.id)) {
            socket.emit("join-room", item.id);
            joinedRooms.add(item.id);
          }
        });
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch products!");
      }
    };

    fetchInitialProducts();
  }, [
    limit,
    joinedRooms,
    protectedGet,
    setProducts,
    socket,
    fetchFunction,
    setOffset,
  ]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);

    try {
      const res = await fetchFunction({
        limit,
        offset: offsetRef.current,
      });

      const newProducts = res.data.products;
      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const uniqueNew = newProducts.filter((p) => !existingIds.has(p.id));
        return [...prev, ...uniqueNew];
      });

      setOffset((prev) => prev + 1);
      setHasMore(newProducts.length >= limit);

      newProducts.forEach((item) => {
        if (!joinedRooms.has(item.id)) {
          socket.emit("join-room", item.id);
          joinedRooms.add(item.id);
        }
      });
    } catch {
      toast.error("Failed to load more items");
    } finally {
      setIsLoading(false);
    }
  }, [
    limit,
    hasMore,
    isLoading,
    joinedRooms,
    setProducts,
    socket,
    fetchFunction,
    setOffset,
  ]);

  const throttle = (func, delay) => {
    let lastCall = 0;
    return (...args) => {
      const now = new Date().getTime();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  };

  useEffect(() => {
    const onScroll = throttle(() => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 200
      ) {
        loadMore();
      }
    }, 300);

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [loadMore]);

  return (
    <div className="items-container" ref={itemsContainerRef}>
      {products === null
        ? Array.from({ length: shimmerCount }).map((_, index) => (
            <div key={index} style={{ width: "100%", aspectRatio: "1" }}>
              <ItemLoader key={index} />
            </div>
          ))
        : products.map((product) => (
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
      {hasMore &&
        Array.from({ length: gridCount }).map((_, index) => (
          <div key={index} style={{ width: "100%", aspectRatio: "1" }}>
            <ItemLoader key={index} />
          </div>
        ))}
    </div>
  );
};

export default InfiniteProducts;
