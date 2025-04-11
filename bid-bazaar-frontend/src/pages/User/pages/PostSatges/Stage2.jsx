import React, { useState, useMemo, useCallback } from "react";
import CustomSelect from "../../../../components/CustomSelect";
import { Award, Category } from "iconsax-react";
import CustomTextArea from "../../../../components/CustomTextArea";
import { usePost } from "../../context/PostContext";
import CustomButton from "../../../../components/CustomButton";
import CustomTable from "../../components/CustomTable";
import { useItems } from "../../context/ItemsContext";

const Stage2 = () => {
  const {
    updateFormStage,
    formValues,
    updateFormValues,
    categorySpecifications,
    specificationForm,
  } = usePost();
  const { categories } = useItems();

  const [categoryErrorTrigger, setCategoryErrorTrigger] = useState(0);
  const [specsErrorTrigger, setSpecsErrorTrigger] = useState(0);
  const [conditionErrorTrigger, setConditionErrorTrigger] = useState(0);
  const [descriptionErrorTrigger, setDescriptionErrorTrigger] = useState(0);

  const categoryOptions = useMemo(
    () =>
      categories
        .filter((category) => category.name !== "All")
        .map((category) => ({
          value: category.id,
          label: category.name,
        })),
    [categories]
  );

  const validateCategory = useCallback((value) => {
    return !value || value.trim() === "" ? "Category can't be empty!" : "";
  }, []);

  const validateSpecifications = useCallback(() => {
    const errors = {};
    if (categorySpecifications.length === 0) return null;

    categorySpecifications.forEach((value) => {
      const validating = specificationForm[value.id];

      if (value.required === 1 && (!validating || validating.trim() === "")) {
        switch (value.type) {
          case "text": {
            errors[value.id] = `${value.name} is required!`;
            break;
          }
          case "number": {
            errors[value.id] = `${value.name} is required!`;
            break;
          }
          case "dropdown": {
            errors[value.id] = `${value.name} is required!`;
            break;
          }
          default: {
            return null;
          }
        }
      } else if (
        value.type === "number" &&
        validating !== "" &&
        !/^\d+$/.test(validating)
      ) {
        errors[value.id] = `${value.name} should be a number!`;
      }
    });
    return errors;
  }, [categorySpecifications, specificationForm]);

  const validateCondition = useCallback((value) => {
    return !value || value.trim() === "" ? "Condition can't be empty!" : "";
  }, []);

  const validateDescription = useCallback((value) => {
    return !value || value.trim() === "" ? "Description can't be empty!" : "";
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const categoryError = validateCategory(formValues.category);
        const specsError = validateSpecifications();
        const conditionError = validateCondition(formValues.condition);
        const descriptionError = validateDescription(formValues.description);

        if (
          !categoryError &&
          categorySpecifications.length !== 0 ? Object.keys(specsError).length === 0 : true &&
          !conditionError &&
          !descriptionError
        ) {
          updateFormStage((prev) => prev + 1);
        } else {
          setCategoryErrorTrigger((prev) => prev + 1);
          setSpecsErrorTrigger((prev) => prev + 1);
          setConditionErrorTrigger((prev) => prev + 1);
          setDescriptionErrorTrigger((prev) => prev + 1);
        }
      }}
      style={{ width: "100%" }}
    >
      <CustomSelect
        label="Category"
        hintText="Select Category..."
        icon={<Category size={16} color="grey" />}
        value={formValues.category}
        setValue={(value) => {
          updateFormValues("category", value);
          setCategoryErrorTrigger(0);
        }}
        validator={validateCategory}
        errorTrigger={categoryErrorTrigger}
        options={categoryOptions}
      />
      <div style={{ height: "16px" }}></div>

      {categorySpecifications.length > 0 && (
        <CustomTable
          label={"Specifications"}
          data={categorySpecifications}
          validator={validateSpecifications}
          errorTrigger={specsErrorTrigger}
        />
      )}

      {categorySpecifications.length > 0 && (
        <div style={{ height: "16px" }}></div>
      )}

      <CustomSelect
        label="Condition"
        hintText="Select Condition..."
        icon={<Award size={16} color="grey" />}
        value={formValues.condition}
        setValue={(value) => {
          updateFormValues("condition", value);
          setConditionErrorTrigger(0);
        }}
        validator={validateCondition}
        errorTrigger={conditionErrorTrigger}
        options={[
          { value: "Brand New", label: "Brand New" },
          { value: "Like New", label: "Like New" },
          { value: "Used", label: "Used" },
          { value: "Not Working", label: "Not Working" },
        ]}
      />
      <div style={{ height: "16px" }}></div>

      <CustomTextArea
        label="Description"
        hintText="A short description of the product..."
        value={formValues.description}
        setValue={(value) => {
          updateFormValues("description", value);
          setDescriptionErrorTrigger(0);
        }}
        validator={validateDescription}
        errorTrigger={descriptionErrorTrigger}
        type="text"
      />
      <CustomButton type="submit" className="submit" text="NEXT" />
    </form>
  );
};

export default Stage2;
