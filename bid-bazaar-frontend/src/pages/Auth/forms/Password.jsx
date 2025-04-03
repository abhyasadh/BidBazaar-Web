import React, { useCallback, useState } from "react";
import { apis, useProtectedApi } from "../../../APIs/api";
import CustomTextField from "../../../components/CustomTextField";
import { Lock1 } from "iconsax-react";
import BackButton from "../components/BackButton";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import CustomButton from "../../../components/CustomButton";

const Password = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrorTrigger, setPasswordErrorTrigger] = useState(0);
  const { protectedPost, protectedPut } = useProtectedApi();
  const { formValues, updateFormValues, formState, updateFormState, reset } =
    useAuth();

  const validateNewPassword = useCallback((value) => {
    if (value === null || value === "") {
      return "Password can't be empty!";
    }
    const requiredLength = 8;
    const missingRequirements = [];

    if (value.length < requiredLength) {
      const missingLength = requiredLength - value.length;
      missingRequirements.push(` ● At least ${missingLength} more characters`);
    }

    if (!/[A-Z]/.test(value)) {
      missingRequirements.push(" ● An uppercase letter");
    }
    if (!/[a-z]/.test(value)) {
      missingRequirements.push(" ● A lowercase letter");
    }
    if (!/[0-9]/.test(value)) {
      missingRequirements.push(" ● A number");
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(value)) {
      missingRequirements.push(" ● A special character");
    }

    if (missingRequirements.length === 0) {
      return null;
    } else {
      return `The password is missing:\n${missingRequirements.join(",\n")}`;
    }
  }, []);

  const validatePasswordMatch = useCallback((value) => {
    if (!value) return "Confirm password can't be empty!";
    return formValues.password === value ? null : "Passwords do not match!";
  }, [formValues.password]);

  const handleSignup = async () => {
    const passwordValidation = validateNewPassword(formValues.password);
    const confirmPasswordValidation = validatePasswordMatch(confirmPassword);

    if (passwordValidation === null && confirmPasswordValidation === null) {
      try {
        const formData = new FormData();
        for (const key in formValues) {
          if (key === "images") {
            formValues.images.forEach((image) => {
              formData.append("images", image);
            });
          } else formData.append(key, formValues[key]);
        }
        const res = await protectedPost(apis.signup, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.data.success === true) {
          toast.success("Account created successfully!");
          updateFormState("activeForm", "login");
          updateFormState("formStage", 0);
          reset();
        } else {
          toast.error(res.data.message);
        }
      } catch (err) {
        toast.error("Signup failed!");
      }
    } else {
      setPasswordErrorTrigger((prev) => prev + 1);
    }
  };

  const handlePasswordReset = async () => {
    const passwordValidation = validateNewPassword(formValues.password);
    const confirmPasswordValidation = validatePasswordMatch(confirmPassword);

    if (passwordValidation === null && confirmPasswordValidation === null) {
      try {
        const res = await protectedPut(apis.resetPassword, {
          password: formValues.password,
        });

        if (res.status === 200) {
          toast.success("Password reset successfully!");
          updateFormState("activeForm", "login");
          updateFormState("formStage", 0);
        }
      } catch (err) {
        toast.error("Password reset failed");
      }
    } else {
      setPasswordErrorTrigger((prev) => prev + 1);
    }
  };

  return (
    <div className="form">
      <div
        className="fields-container"
        onBlur={() => setPasswordErrorTrigger(0)}
      >
        <span className="heading" style={{ marginBottom: "32px" }}>
          {formState.activeForm === "signup"
            ? "Create a Password"
            : "Enter New Password"}
        </span>
        <form
          className="fields"
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
        >
          <CustomTextField
            label="Password"
            hintText="Create a Password..."
            icon={<Lock1 size={16} color="grey" />}
            value={formValues.password}
            setValue={(value) => {
              updateFormValues("password", value);
            }}
            validator={validateNewPassword}
            type="password"
            focusOnLoad={true}
            errorTrigger={passwordErrorTrigger}
          />
          <div style={{ height: 16 }}></div>
          <CustomTextField
            label="Confirm Password"
            hintText="Confirm Your Password..."
            icon={<Lock1 size={16} color="grey" />}
            value={confirmPassword}
            setValue={setConfirmPassword}
            validator={validatePasswordMatch}
            type="password"
            errorTrigger={passwordErrorTrigger}
            onSubmit={() => document.getElementById("passwordButton")?.click()}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginTop: "auto",
            }}
          >
            <BackButton
              toForm={formState.activeForm}
              toStage={formState.activeForm === "signup" ? 2 : 0}
            />
            <CustomButton
              id="passwordButton"
              type="submit"
              className="submit"
              text="CONTINUE"
              style={{ width: "calc(100% - 56px)", marginTop: "auto" }}
              onClick={
                formState.activeForm === "signup"
                  ? handleSignup
                  : handlePasswordReset
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Password;
