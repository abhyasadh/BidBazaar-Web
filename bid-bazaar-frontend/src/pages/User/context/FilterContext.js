import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProtectedApi, apis } from "../../../APIs/api";
import { toast } from "react-toastify";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { protectedGet } = useProtectedApi();

  const getFiltersFromURL = () => {
    const params = new URLSearchParams(location.search);
    return {
      applied: params.get("filtered") === "true",
      categories:
        params.getAll("category").length > 0
          ? params.getAll("category")
          : ["All"],
      price: {
        min: params.get("minPrice") || "",
        max: params.get("maxPrice") || "",
      },
      endsIn: {
        min: Number(params.get("minEndsIn") || 0),
        max: Number(params.get("maxEndsIn") || 24),
      },
      sortBy: params.get("sortBy") || "None",
      lowToHigh: params.get("sortBy") ?? (params.get("lowToHigh") || "true"),
    };
  };

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await protectedGet(apis.getCategories);
        setCategories(res.data.categories);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch categories!");
      }
    };
    fetchCategories();
  }, [protectedGet]);

  const [filter, setFilter] = useState(getFiltersFromURL);

  const resetFilter = useCallback(() => {
    setFilter({
      applied: false,
      categories: ["All"],
      price: { min: "", max: "" },
      endsIn: { min: 0, max: 24 },
      sortBy: "None",
      lowToHigh: true,
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter.applied) {
      params.set("filtered", "true");

      if (filter.categories.length && !filter.categories.includes("All")) {
        filter.categories.forEach((category) =>
          params.append("category", category)
        );
      }

      if (filter.price.min) params.set("minPrice", filter.price.min);
      if (filter.price.max) params.set("maxPrice", filter.price.max);

      if (filter.endsIn.min !== 0) params.set("minEndsIn", filter.endsIn.min);
      if (filter.endsIn.max !== 24) params.set("maxEndsIn", filter.endsIn.max);
      if (filter.sortBy !== "None") params.set("sortBy", filter.sortBy);
      if (filter.sortBy !== "None") params.set("lowToHigh", filter.lowToHigh);

      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    } else {
      navigate(location.pathname, { replace: true });
    }
  }, [filter, navigate, location.pathname]);

  return (
    <FilterContext.Provider
      value={{ filter, setFilter, resetFilter, categories }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
