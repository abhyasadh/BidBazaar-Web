import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { apis, useProtectedApi } from "../../../APIs/api";
import { useAuth } from "../context/AuthContext";
import CustomTextField from "../../../components/CustomTextField";
import { Sms } from "iconsax-react";
import CustomButton from "../../../components/CustomButton";
import CountdownTimer from "../components/CountdownTimer";

const OTP = () => {
  const [otp, setOtp] = useState("");
  const [resendOTP, setResendOTP] = useState(false);
  const { formValues, formState, updateFormState } = useAuth();

  const { protectedPost } = useProtectedApi();

  const handleSendOtp = async () => {
    try {
      const res = await protectedPost(apis.sendOtp, {
        phone: formValues.phone,
        type: formState.activeForm === "signup" ? "register" : "reset",
      });
      if (res.data.success === true) {
        toast.success("OTP sent successfully!");
        setResendOTP(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6 || !/^[0-9]{6,6}$/.test(otp)) {
      toast.error("Incorrect OTP!");
      return;
    }
    try {
      const res = await protectedPost(apis.verifyOtp, {
        phone: formValues.phone,
        otp: otp,
      });
      if (res.data.success === true) {
        updateFormState("formStage", 2);
        toast.success("OTP verified successfully!");
        setOtp("");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Incorrect OTP!");
    }
  };

  return (
    <div className="form">
      <div className="fields-container">
        <span className="heading" style={{ marginBottom: "4px" }}>
          Enter the OTP
        </span>
        <span className="sub-heading" style={{ marginBottom: "14px" }}>
          OTP was sent to +977 {formValues.phone}.{" "}
          <span
            className="link"
            onClick={() => {
              updateFormState("formStage", 0);
            }}
          >
            Change
          </span>
        </span>
        <form
          className="fields"
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
        >
          <CustomTextField
            label="OTP"
            hintText="Enter OTP..."
            icon={<Sms size={16} color="grey" />}
            value={otp}
            setValue={setOtp}
            type="text"
            maxLength={6}
            validator={useCallback(() => null, [])}
            focusOnLoad={true}
            onSubmit={() => {
              document.getElementById("otpButton")?.click();
            }}
          />
          <CustomButton
            id="otpButton"
            type="submit"
            className="submit"
            text="CONTINUE"
            onClick={handleVerifyOtp}
          />
          <div className="signup-link">
            {resendOTP ? (
              <span onClick={handleSendOtp}>OTP expired!&nbsp;</span>
            ) : (
              <span>Request new OTP in: </span>
            )}
            {resendOTP ? (
              <span className="link" onClick={handleSendOtp}>
                Resend
              </span>
            ) : (
              <CountdownTimer
                timeInSeconds={60}
                onComplete={() => {
                  setResendOTP(true);
                }}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTP;
