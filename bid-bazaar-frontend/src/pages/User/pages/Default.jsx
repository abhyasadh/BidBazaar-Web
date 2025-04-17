import React, { useCallback, useState } from "react";
import ContentLoader from "react-content-loader";
import Empty from "../components/Empty";
import { useItems } from "../context/ItemsContext";
import { apis, useProtectedApi } from "../../../APIs/api";
import InfiniteProducts from "../components/InfiniteProducts";

const Default = () => {
  const { products, setProducts } = useItems();
  const [offset, setOffset] = useState(0);
  const { protectedGet } = useProtectedApi();

  const fetchFunction = useCallback(
    ({ limit, offset }) =>
      protectedGet(`${apis.getProducts}?limit=${limit}&offset=${offset}`),
    [protectedGet]
  );

  return (
    <>
      {products === null ? (
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
      ) : products.length === 0 ? (
        <Empty height={"calc(100vh - 122px)"} />
      ) : (
        products && products.length > 0 && <h2 className="label">Ending Soon</h2>
      )}
      <InfiniteProducts
        products={products}
        setProducts={setProducts}
        offset={offset}
        setOffset={setOffset}
        fetchFunction={fetchFunction}
      />
    </>
  );
};

export default Default;
