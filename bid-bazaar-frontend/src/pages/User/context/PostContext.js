import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import { apis, useProtectedApi } from "../../../APIs/api";
import { toast } from "react-toastify";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const { protectedGet } = useProtectedApi();
  
  const [formStage, setFormStage] = useState(0);
  const [formValues, setFormValues] = useState({
    title: "",
    images: [],
    category: "",
    condition: "",
    description: "",
    price: "",
    minimumRaise: "",
  });
  const [categorySpecifications, setCategorySpecifications] = useState([]);
  const [specificationForm, setSpecificationForm] = useState(null);

  useEffect(() => {
    if (formValues.category) {
      const fetchSpecifications = async () => {
        document.getElementById('loading-animation').showModal(); 
  
        try {
          const res = await protectedGet(`${apis.getSpecifications}/${formValues.category}`);
          setCategorySpecifications(res.data.specifications);
  
          const newSpecifications = {};
          res.data.specifications.forEach((spec) => {
            newSpecifications[spec.id] = "";
          });
  
          setSpecificationForm(newSpecifications);
          document.getElementById('loading-animation').close();
        } catch (error) {
          toast.error("Failed to fetch specifications!");
        }
      };
      fetchSpecifications();
    }
  }, [formValues.category, protectedGet]);
  

  const reset = () => {
    setFormStage(0);
    setFormValues({
    title: "",
    images: [],
    category: "",
    condition: "",
    description: "",
    price: "",
    minimumRaise: "",
  })
  setSpecificationForm(null);
  setCategorySpecifications([]);
};

  const updateFormStage = useCallback((value) => {
    setFormStage(value);
  }, []);

  const updateFormValues = useCallback((key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateSpecificationValues = useCallback((key, value) => {
    setSpecificationForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const contextValue = useMemo(() => ({ 
    formStage, 
    updateFormStage, 
    formValues, 
    updateFormValues, 
    categorySpecifications, 
    specificationForm, 
    updateSpecificationValues, 
    reset 
  }), [formStage, updateFormStage, formValues, updateFormValues, categorySpecifications, specificationForm, updateSpecificationValues]);

  return <PostContext.Provider value={contextValue}>{children}</PostContext.Provider>;
};

export const usePost = () => useContext(PostContext);
