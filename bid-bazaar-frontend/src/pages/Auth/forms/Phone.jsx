import React, { useState } from "react";
import BackButton from "../components/BackButton";
import { apis, useProtectedApi } from "../../../APIs/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import CustomTextField from "../../../components/CustomTextField";
import { Call } from "iconsax-react";
import CustomButton from "../../../components/CustomButton";
import { useFunctions } from "../../../contexts/CommonFunctions";

const Phone = () => {

  const [phoneErrorTrigger, setPhoneErrorTrigger] = useState(0);

  const { formValues, updateFormValues, formState, updateFormState } = useAuth();
  const { protectedPost } = useProtectedApi();
  const { validatePhone } = useFunctions();

  const handleSendOtp = async () => {
    if (validatePhone(formValues.phone) != null){
      setPhoneErrorTrigger((prev) => prev + 1);
      return;
    }
    try {
      const res = await protectedPost(apis.sendOtp, {
        phone: formValues.phone,
        type: formState.activeForm === "signup" ? "register" : "reset",
      });
      if (res.data.success === true) {
        updateFormState("formStage", 1);
        toast.success("OTP sent successfully!");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to send OTP");
    }
  };

  return (
    <div className="form">
      <div className="fields-container" onBlur={() => setPhoneErrorTrigger(0)}>
        <span className="heading" style={{ marginBottom: "4px" }}>
          {formState.activeForm === "signup"
            ? "Enter Your Number"
            : "Forgot Password?"}
        </span>
        <span className="sub-heading" style={{ marginBottom: "14px" }}>
          {formState.activeForm === "signup"
            ? "An OTP will be sent to this number for verification."
            : "Enter your registered number for OTP."}
        </span>
        <form className="fields" autoComplete="off" onSubmit={(e)=>e.preventDefault()}>
          <CustomTextField
            label="Phone"
            hintText="Enter Your Phone Number..."
            icon={<Call size={16} color="grey" />}
            value={formValues.phone}
            setValue={(value) => {
              updateFormValues("phone", value);
            }}
            validator={validatePhone}
            type="tel"
            focusOnLoad={true}
            errorTrigger={phoneErrorTrigger}
            onSubmit={
              () => document.getElementById("phoneButton")?.click()
            }
          />
          <CustomButton
            id="phoneButton"
            type="submit"
            className="submit"
            text="CONTINUE"
            onClick={handleSendOtp}
          />
          <BackButton toForm={"login"} toStage={0} />
        </form>
      </div>
    </div>
  );
};

export default Phone;
