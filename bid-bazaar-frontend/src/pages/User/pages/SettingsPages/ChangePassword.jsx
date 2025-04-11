import React, { useCallback, useState } from "react";
import { apis, useProtectedApi } from "../../../../APIs/api";
import { useFunctions } from "../../../../contexts/CommonFunctions";
import { toast } from "react-toastify";
import { CloseSquare, Lock1 } from "iconsax-react";
import CustomTextField from "../../../../components/CustomTextField";
import CustomButton from "../../../../components/CustomButton";

const ChangePassword = () => {
  const { protectedPut } = useProtectedApi();

  const [passwordErrorTrigger, setPasswordErrorTrigger] = useState(0);

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { validateUserPassword, validatePassword } = useFunctions();
  const validateConfirmPassword = useCallback(
    (value) => {
      if (!value || value === "") return "Confirm password can't be empty!";
      return newPassword === value ? null : "Passwords do not match!";
    },
    [newPassword]
  );

  const closeModal = () => {
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordErrorTrigger(0);
    document.getElementById("change-password").close();
  };

  const handlePasswordSubmit = async () => {
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validateConfirmPassword(confirmPassword);

    if (passwordValidation === null && confirmPasswordValidation === null) {
      try {
        const response = await protectedPut(apis.resetPassword, {
          password: newPassword,
          previousPassword: password,
        });
        if (response.data.success) {
          toast.success("Password changed successfully!");
        } else {
          toast.error(response.data.message);
        }
        closeModal();
      } catch (error) {
        console.error(error);
      }
    } else {
      setPasswordErrorTrigger((prev) => prev + 1);
    }
  };

  return (
    <dialog
      id="change-password"
      onClick={(e) => {
        e.preventDefault();
        closeModal();
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <div
          className="header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "28px",
          }}
        >
          <span
            style={{
              color: "var(--primary-color)",
              fontSize: "26px",
              fontWeight: 600,
              marginLeft: "10px",
              marginTop: "6px",
            }}
          >
            Change Password
          </span>
          <button
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              padding: 0,
              border: "none",
              background: "none",
              cursor: "pointer",
              outline: "none",
            }}
            onClick={(e) => {
              e.preventDefault();
              closeModal();
            }}
          >
            <CloseSquare color="grey" size={30} />
          </button>
        </div>
        <div className="content">
          <CustomTextField
            label="Previous Password"
            hintText="Enter Your Password..."
            icon={<Lock1 size={16} color="grey" />}
            value={password}
            setValue={setPassword}
            validator={validateUserPassword}
            type="password"
            errorTrigger={passwordErrorTrigger}
          />
          <div style={{ height: "20px" }}></div>
          <CustomTextField
            label="New Password"
            hintText="Create New Password..."
            icon={<Lock1 size={16} color="grey" />}
            value={newPassword}
            setValue={setNewPassword}
            validator={validatePassword}
            type="password"
            errorTrigger={passwordErrorTrigger}
          />
          <div style={{ height: "20px" }}></div>
          <CustomTextField
            label="Confirm Password"
            hintText="Confirm Password..."
            icon={<Lock1 size={16} color="grey" />}
            value={confirmPassword}
            setValue={setConfirmPassword}
            validator={validateConfirmPassword}
            type="password"
            errorTrigger={passwordErrorTrigger}
          />
        </div>
        <div className="footer">
          <CustomButton
            text={"CHANGE PASSWORD"}
            onClick={async () => {
              handlePasswordSubmit();
            }}
          />
        </div>
      </div>
    </dialog>
  );
};

export default ChangePassword;
