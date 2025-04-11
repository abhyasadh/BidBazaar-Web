import React from "react";
import ContentLoader from "react-content-loader";

const ItemLoader = () => {
  return (
    <div style={{ width: "100%", aspectRatio: "1" }}>
      <ContentLoader
        speed={1.5}
        width="100%"
        height="100%"
        viewBox="0 0 400 400"
        backgroundColor="var(--color-scheme-primary)"
        foregroundColor="var(--color-scheme-secondary)"
      >
        <rect x="0" y="0" rx="20" ry="20" width="100%" height="320" />
        <rect x="0" y="332" rx="10" ry="10" width="80%" height="28" />
        <rect x="0" y="372" rx="10" ry="10" width="50%" height="28" />
      </ContentLoader>
    </div>
  );
};

export default ItemLoader;
