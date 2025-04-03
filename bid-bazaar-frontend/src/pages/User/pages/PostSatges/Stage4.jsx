import React from "react";
import Item from "../../components/Item";
import CustomButton from "../../../../components/CustomButton";
import { toast } from "react-toastify";
import { usePost } from "../../context/PostContext";
import { apis, useProtectedApi } from "../../../../APIs/api";

const Stage4 = () => {
  const { formValues, specificationForm, reset } = usePost();
  const { protectedPost } = useProtectedApi();

  const handleProductPost = async () => {
    try {
      const formData = new FormData();

      for (const key in formValues) {
        if (key === "images" && Array.isArray(formValues[key])) {
          formValues[key].forEach((file) => {
            formData.append("images", file);
          });
        } else {
          formData.append(key, formValues[key]);
        }
      }

      formData.append("specifications", JSON.stringify(specificationForm));

      const productRes = await protectedPost(apis.productPost, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (productRes.data.success) {
        toast.success("Product published successfully!");
        document.getElementById("new-post").close();
        reset();
      } else {
        toast.error(productRes.data.message);
      }
    } catch (err) {
      toast.error("Product post failed!");
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} style={{ width: "100%" }}>
      <label className="label">Preview of Your Auction</label>
      <div
        style={{
          marginTop: "16px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "260px", marginBottom: "-20px" }}>
          <Item
            itemId={1}
            imageLink={URL.createObjectURL(formValues.images[0])}
            title={formValues.title}
            price={formValues.price.toString()}
            bidCount={10}
            endsIn={new Date().getTime() + 21600000}
            previewMode={true}
          />
        </div>
      </div>
      <CustomButton
        type="submit"
        className="submit"
        text="PUBLISH"
        onClick={async (e) => {
          e.preventDefault();
          await handleProductPost();
        }}
      />
    </form>
  );
};

export default Stage4;
