import React from "react";

const CategoryItem = ({ name, image, color, filter, setFilter }) => {
  const styles = {
    parentDiv: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      gap: "4px",
    },
    imageDiv: {
      width: "48px",
      height: "48px",
      backgroundColor: color + "70",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border:
        "3.5px solid " + color + (filter.categories.includes(name) ? "" : "00"),
    },
  };

  return (
    <div
      onClick={() => {
        if (name === "All") {
          setFilter((prevFilter) => ({
            ...prevFilter,
            categories: ["All"],
          }));
          return;
        } else {
          if (filter.categories.includes("All")) {
            setFilter((prevFilter) => ({
              ...prevFilter,
              categories: [name],
            }));
            return;
          }
        }
        setFilter((prevFilter) => ({
          ...prevFilter,
          categories: prevFilter.categories.includes(name)
            ? prevFilter.categories.filter((category) => category !== name)
            : [...prevFilter.categories, name],
        }));
      }}
      style={styles.parentDiv}
    >
      <div style={styles.imageDiv}>
        <img width={28} height={28} src={image} alt={name} />
      </div>
      <span style={{ fontSize: "13px" }}>{name}</span>
    </div>
  );
};

export default CategoryItem;
