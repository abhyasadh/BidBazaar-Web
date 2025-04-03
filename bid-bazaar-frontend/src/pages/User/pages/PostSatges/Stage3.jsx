import React, { useCallback, useState } from "react";
import { usePost } from "../../context/PostContext";
import CustomTextField from "../../../../components/CustomTextField";
import CustomButton from "../../../../components/CustomButton";
import { InfoCircle } from "iconsax-react";

const Stage3 = () => {
  const { updateFormStage, formValues, updateFormValues } = usePost();

  const [priceErrorTrigger, setPriceErrorTrigger] = useState(0);
  const [raiseErrorTrigger, setRaiseErrorTrigger] = useState(0);

  const validatePrice = useCallback((value) => {
    if (!value || value.trim() === "") {
      updateFormValues("minimumRaise", "");
      return "Price can't be empty!";
    }
    if (!/^\d+$/.test(value)) {
      return "Invalid number!";
    }

    let minIncrement = Math.ceil(parseInt(value) * 0.02);
    if (minIncrement % 5 !== 0) {
      minIncrement = Math.ceil(minIncrement / 5) * 5;
    }

    updateFormValues("minimumRaise", minIncrement.toString());
    return null;
  }, [updateFormValues]);

  const validateRaise = useCallback((value) => {
    if (!value || value.trim() === "") {
      return "Raise can't be empty!";
    } else if (!/^\d+$/.test(value)) {
      return "Invalid number!";
    } else if (parseInt(value) > parseInt(formValues.price)) {
      return "Raise must be lower than the price!";
    }
    return null;
  }, [formValues.price]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const priceError = validatePrice(formValues.price);
        const raiseError = validateRaise(formValues.minimumRaise);

        if (!priceError && !raiseError) {
          updateFormStage((prev) => prev + 1);
        } else {
          setPriceErrorTrigger((prev) => prev + 1);
          setRaiseErrorTrigger((prev) => prev + 1);
        }
      }}
      style={{ width: "100%" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <CustomTextField
          label="Price"
          hintText="Starting Price..."
          prefix={"Rs."}
          value={formValues.price}
          setValue={(value) => {
            updateFormValues("price", value);
            setPriceErrorTrigger(0);
          }}
          validator={validatePrice}
          type="text"
          errorTrigger={priceErrorTrigger}
        />

        <CustomTextField
          label="Minimum Raise"
          hintText="Raise..."
          prefix={"Rs."}
          value={formValues.minimumRaise}
          setValue={(value) => {
            updateFormValues("minimumRaise", value);
            setRaiseErrorTrigger(0);
          }}
          validator={validateRaise}
          type="text"
          errorTrigger={raiseErrorTrigger}
        />
      </div>

      <div className="info">
        <InfoCircle size={16} color="#ff6c44" />
        <p>
          When anyone bids, the timer will increase by 6 hours.<br/> If you reach a favorable price, you can end the auction anytime in Settings {`>`} Listed Auctions.
        </p>
      </div>

      <CustomButton type="submit" className="submit" text="NEXT" />
    </form>
  );
};

export default Stage3;
