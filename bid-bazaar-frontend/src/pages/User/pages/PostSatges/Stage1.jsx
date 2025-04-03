import React, { useCallback, useMemo, useState } from "react";
import { usePost } from "../../context/PostContext";
import { CloseCircle, Text } from "iconsax-react";
import CustomTextField from "../../../../components/CustomTextField";
import CustomButton from "../../../../components/CustomButton";

const Stage1 = () => {
  const { updateFormStage, formValues, updateFormValues } = usePost();

  const handleImageUpload = useCallback((e) => {
    const files = [...e.target.files];
    const uploads = files.slice(0, 5 - formValues.images.length);

    updateFormValues("images", [...formValues.images, ...uploads]);
    setImageError("");

    e.target.value = null;
  }, [formValues.images, updateFormValues]);

  const imagePreviews = useMemo(
    () =>
      formValues.images.map((image) => ({
        url: URL.createObjectURL(image),
        file: image,
      })),
    [formValues.images]
  );

  const validateTitle = useCallback((value) => {
    if (!value || value.trim() === "") return "Title can't be empty!";
    else setTitleErrorTrigger(1);
  }, []);

  const validateImage = useCallback(() => {
    if (formValues.images.length === 0) {
      setImageError("At least 1 image is required!");
      return "At least 1 image is required!";
    } else {
      setImageError("");
      return null;
    }
  }, [formValues.images]);

  const [titleErrorTrigger, setTitleErrorTrigger] = useState(0);
  const [imageError, setImageError] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const titleError = validateTitle(formValues.title);
        const imageError = validateImage();

        if (!titleError && !imageError) {
          updateFormStage((prev) => prev + 1);
        } else {
          setTitleErrorTrigger((prev) => prev + 1);
        }
      }}
      style={{ width: "100%" }}
    >
      <CustomTextField
        label="Title"
        hintText="Product Name..."
        icon={<Text size={16} color="grey" />}
        value={formValues.title}
        setValue={(value) => {
          updateFormValues("title", value);
        }}
        validator={validateTitle}
        type="text"
        errorTrigger={titleErrorTrigger}
        onSubmit={() => {}}
      />
      <div style={{ height: "16px" }}></div>
      <label className="label">Images</label>
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          marginTop: "10px",
        }}
      >
        {imagePreviews.map((image, index) => {
          return (
            <div
              key={index}
              alt=""
              style={{
                width: "calc(25% - 12px)",
                aspectRatio: "4/3",
                borderRadius: "12px",
                backgroundImage: `url(${image.url})`,
                backgroundSize: "cover",
                position: "relative",
              }}
            >
              <button
                style={{
                  padding: "0",
                  background: "none",
                  border: "none",
                  outline: "none",
                  cursor: "pointer",
                  position: "absolute",
                  right: "4px",
                  top: "4px",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  updateFormValues(
                    "images",
                    formValues.images.filter((_, i) => i !== index)
                  );
                }}
              >
                <CloseCircle size={14} color="#00000099" />
              </button>
            </div>
          );
        })}
        <input
          type="file"
          id="images"
          style={{ display: "none" }}
          multiple
          onChange={handleImageUpload}
        />
        {formValues.images.length < 5 ? (
          <label
            htmlFor="images"
            className="file-upload"
            style={{
              width: "calc(25% - 16px)",
              aspectRatio: "4/3",
              display: "flex",
              border: `2px dashed ${
                imageError !== ""
                  ? "var(--error-color)"
                  : "rgba(128, 128, 128, 0.5)"
              }`,
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                color: "rgba(128, 128, 128, 0.7)",
              }}
            >
              <span style={{ fontSize: "20px" }}>+</span>
              <span style={{ fontSize: "10px" }}>
                {formValues.images.length + 1} of 5 Images
              </span>
            </div>
          </label>
        ) : null}
      </div>
      {imageError && (
        <span
          style={{
            marginTop: "6px",
            marginLeft: "10px",
            marginBottom: "0",
            fontFamily: "Blinker",
            fontSize: "12px",
            color: "var(--error-color)",
            whiteSpace: "pre-line",
          }}
        >
          {imageError}
        </span>
      )}
      <CustomButton type="submit" className="submit" text="NEXT" />
    </form>
  );
};

export default Stage1;
