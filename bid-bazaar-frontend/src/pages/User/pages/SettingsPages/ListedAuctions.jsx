import React, { useCallback, useEffect, useState } from "react";
import { apis, useProtectedApi } from "../../../../APIs/api";
import Empty from "../../components/Empty";
import InfiniteProducts from "../../components/InfiniteProducts";
import ItemLoader from "../../components/ItemLoader";
import ContentLoader from "react-content-loader";

const ListedAuctions = () => {
  const { protectedGet } = useProtectedApi();

  const [products, setProducts] = useState(null);
  const [active, setActive] = useState([]);
  const [ended, setEnded] = useState([]);

  const [offset, setOffset] = useState(0);

  const fetchFunction = useCallback(
    ({ limit, offset }) =>
      protectedGet(`${apis.getOwnProducts}?limit=${limit}&offset=${offset}`),
    [protectedGet]
  );

  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        const res = await fetchFunction({ limit: 24, offset: 0 });
        const newProducts = res.data.products;

        setProducts(newProducts);
        setOffset(1);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchInitialProducts();
  }, [fetchFunction, setProducts, setOffset]);

  useEffect(() => {
    if (!products) return;

    const newActive = [];
    const newEnded = [];

    products.forEach((product) => {
      const bidEnd = product.highestBidUpdatedAt
        ? new Date(product.highestBidUpdatedAt).getTime() + 21600000
        : new Date(product.createdAt).getTime() + 21600000 * 4;

      if (bidEnd > Date.now()) {
        newActive.push(product);
      } else {
        newEnded.push(product);
      }
    });

    setActive(newActive);
    setEnded(newEnded);
  }, [products]);

  if (products === null) {
    return (
      <>
        <h1 className="label">Listed Auctions</h1>
        <div style={{ width: "100px", height: "46px" }}>
          <ContentLoader
            speed={1.5}
            width="150"
            height="36"
            viewBox="0 0 150 36"
            backgroundColor="var(--color-scheme-primary)"
            foregroundColor="var(--color-scheme-secondary)"
          >
            <rect x="0" y="0" rx="10" ry="10" width="150" height="32" />
          </ContentLoader>
        </div>
        <div className="items-container">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} style={{ width: "100%", aspectRatio: "1" }}>
              <ItemLoader key={index} />
            </div>
          ))}
        </div>
      </>
    );
  }

  if (products && products.length === 0) {
    return <Empty height={"calc(100vh - 50px)"} />;
  }

  return (
    <>
      <h1 className="label">Listed Auctions</h1>
      {active.length > 0 && (
        <>
          <h2 className="label">Active</h2>
          <InfiniteProducts
            products={active}
            setProducts={setProducts}
            offset={offset}
            setOffset={setOffset}
            fetchFunction={fetchFunction}
          />
        </>
      )}
      {active.length > 0 && ended.length > 0 && (
        <hr
          style={{
            padding: "0px",
            margin: "30px 0 10px 0",
            border: "none",
            backgroundColor: "rgba(128, 128, 128, 0.5)",
            height: "4px",
            borderRadius: "2px",
          }}
        />
      )}
      {ended.length > 0 && (
        <>
          <h2 className="label">Ended</h2>
          <InfiniteProducts
            products={ended}
            setProducts={setProducts}
            offset={offset}
            setOffset={setOffset}
            fetchFunction={fetchFunction}
          />
        </>
      )}
    </>
  );
};

export default ListedAuctions;
