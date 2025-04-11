import React, { useEffect, useMemo, useState } from "react";
import { useFilter } from "../context/FilterContext";
import { CloseSquare } from "iconsax-react";
import CategoryItem from "../components/CategoryItem";
import CustomTextField from "../../../components/CustomTextField";
import CustomButton from "../../../components/CustomButton";
import RangeSlider from "react-range-slider-input";
import ContentLoader from "react-content-loader";
import { useItems } from "../context/ItemsContext";

const Filter = () => {
  const { filter, setFilter, resetFilter } = useFilter();
  const { categories } = useItems();

  const initFilter = useMemo(
    () => ({
      categories: filter.categories,
      price: { min: filter.price.min, max: filter.price.max },
      endsIn: { min: filter.endsIn.min, max: filter.endsIn.max },
      sortBy: filter.sortBy ?? "None",
      lowToHigh: filter.lowToHigh,
    }),
    [filter]
  );

  const [tempFilter, setTempFilter] = useState(initFilter);

  useEffect(() => {
    setTempFilter(initFilter);
  }, [filter, initFilter]);

  useEffect(() => {
    if (
      tempFilter.categories.length === 0 ||
      tempFilter.categories.length === categories.length - 1
    ) {
      setTempFilter({ ...tempFilter, categories: ["All"] });
    }
  }, [tempFilter, categories]);

  function closeModal() {
    const modal = document.getElementById("filter-modal");
    modal.classList.add("closing");

    setTimeout(() => {
      modal.classList.remove("closing");
      modal.close();
    }, 200);
  }

  const CategoryLoader = () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ContentLoader
          speed={1.5}
          width="54.67"
          height="71.67"
          viewBox="0 0 54.67 71.67"
          backgroundColor="var(--color-scheme-primary)"
          foregroundColor="var(--color-scheme-secondary)"
        >
          <rect x="0" y="0" rx="10" ry="10" width="54.67" height="54.67" />
          <rect x="3" y="59" rx="2" ry="2" width="48.67" height="12.67" />
        </ContentLoader>
      </div>
    );
  };

  return (
    <dialog id="filter-modal" onClick={closeModal}>
      <div className="filter-content" onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <span>Filters</span>
          <button onClick={closeModal}>
            <CloseSquare color="grey" size={30} />
          </button>
        </div>
        <div className="content">
          <div
            className="categories"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
              gap: "12px",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {categories.length > 0
              ? categories.map((category) => (
                  <CategoryItem
                    key={category.id}
                    name={category.name}
                    image={category.image}
                    color={category.color}
                    filter={tempFilter}
                    setFilter={setTempFilter}
                  />
                ))
              : Array.from({ length: 14 }).map((_, index) => (
                  <CategoryLoader key={index} />
                ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <CustomTextField
              label="Price"
              hintText="Minimum"
              value={tempFilter.price.min}
              maxLength={8}
              setValue={(value) => {
                setTempFilter({
                  ...tempFilter,
                  price: { ...tempFilter.price, min: value },
                });
              }}
              validator={() => {}}
              type="number"
            />
            <CustomTextField
              label="&nbsp;"
              hintText="Maximum"
              value={tempFilter.price.max}
              maxLength={8}
              setValue={(value) => {
                setTempFilter({
                  ...tempFilter,
                  price: { ...tempFilter.price, max: value },
                });
              }}
              validator={() => {}}
              type="text"
            />
          </div>
          <div className="time-left">
            <span className="label">Time Left</span>
            <div className="range-slider-container">
              <RangeSlider
                min={0}
                max={24}
                step={1}
                defaultValue={[0, 24]}
                value={[tempFilter.endsIn.min, tempFilter.endsIn.max]}
                onInput={(value) => {
                  setTempFilter({
                    ...tempFilter,
                    endsIn: { min: value[0], max: value[1] },
                  });
                }}
              />
            </div>
            <div className="range-slider-values">
              <span>{tempFilter.endsIn.min} Hour(s)</span>
              <span>{tempFilter.endsIn.max} Hour(s)</span>
            </div>
          </div>
          <hr
            style={{
              padding: "0px",
              margin: "0",
              border: "none",
              backgroundColor: "rgba(128, 128, 128, 0.5)",
              height: "1px",
            }}
          />
          <div className="sort-by">
            <span className="label">Sort By:</span>
            <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
              <div className="select-div" style={{ flex: 7 }}>
                <select
                  value={tempFilter.sortBy}
                  onChange={(e) => {
                    setTempFilter({ ...tempFilter, sortBy: e.target.value });
                  }}
                  id="sort-select"
                >
                  <option value="None">None</option>
                  <option value="Time Left">Time Left</option>
                  <option value="Price">Price</option>
                  <option value="Bids Placed">Bids Placed</option>
                </select>
              </div>
              <div
                style={{
                  backgroundColor: "var(--color-scheme-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 0",
                  fontSize: "14px",
                  borderRadius: "10px",
                  flex: 4,
                  cursor: "pointer",
                  color:
                    tempFilter.sortBy !== "None"
                      ? "var(--text-color)"
                      : "rgba(128, 128, 128, 0.5)",
                }}
                onClick={() => {
                  if (tempFilter.sortBy !== "None")
                    setTempFilter({
                      ...tempFilter,
                      lowToHigh: !tempFilter.lowToHigh,
                    });
                }}
              >
                <span style={{ wordSpacing: "5px" }}>
                  {tempFilter.lowToHigh ? `Low → High` : "High → Low"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <CustomButton
            text={"Reset"}
            style={{
              fontWeight: 600,
              backgroundColor: "grey",
              boxShadow: "none",
              color: "var(--inverted-text-color)",
              margin: 0,
            }}
            onClick={() => {
              setTempFilter({
                categories: ["All"],
                price: { min: "", max: "" },
                endsIn: { min: 0, max: 24 },
                sortBy: "None",
                lowToHigh: true,
              });
              resetFilter();
            }}
          />
          <CustomButton
            text={"Apply"}
            style={{
              fontWeight: 600,
              boxShadow: "none",
              color: "var(--inverted-text-color)",
              margin: 0,
            }}
            onClick={() => {
              if (
                !tempFilter.categories.includes("All") ||
                tempFilter.price.min ||
                tempFilter.price.max ||
                tempFilter.endsIn.min !== 0 ||
                tempFilter.endsIn.max !== 24 ||
                tempFilter.sortBy !== "None"
              ) {
                setFilter({ ...tempFilter, applied: true });
                closeModal();
              } else {
                setFilter({ ...tempFilter, applied: false });
                closeModal();
              }
            }}
          />
        </div>
      </div>
    </dialog>
  );
};

export default Filter;
