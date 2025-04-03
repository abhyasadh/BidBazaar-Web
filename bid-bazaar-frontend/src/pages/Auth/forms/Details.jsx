import React, { useCallback, useState } from "react";
import BackButton from "../components/BackButton";
import { useAuth } from "../context/AuthContext";
import CustomTextField from "../../../components/CustomTextField";
import { Sms, User } from "iconsax-react";
import CustomButton from "../../../components/CustomButton";

const Details = () => {
  const [detailsErrorTrigger, setDetailsErrorTrigger] = useState(0);
  const { formValues, updateFormValues, updateFormState } = useAuth();

  const validateFirstName = useCallback((value) => {
    if (value.trim() === "") {
      return "First name can't be empty!";
    }
    return null;
  }, []);

  const validateLastName = useCallback((value) => {
    if (value.trim() === "") {
      return "Last name can't be empty!";
    }
    return null;
  }, []);

  const validateEmail = useCallback((value) => {
    if (!value) return "Email can't be empty!";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) ? null : "Invalid email format!";
  }, []);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    updateFormValues("profileImage", file);
  };

  return (
    <div className="form">
      <div
        className="fields-container"
        onBlur={() => setDetailsErrorTrigger(0)}
      >
        <span className="heading" style={{ marginBottom: "14px" }}>
          Personal Details
        </span>
        <form
          className="fields"
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            const emailValidation = validateEmail(formValues.email);
            const firstNameValidation = validateFirstName(formValues.firstName);
            const lastNameValidation = validateLastName(formValues.lastName);

            if (
              emailValidation === null &&
              firstNameValidation === null &&
              lastNameValidation === null
            ) {
              updateFormState("formStage", 3);
            } else {
              setDetailsErrorTrigger((prev) => prev + 1);
            }
          }}
        >
          <div className="profile-picture-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              style={{ display: "none" }}
              id="profile-picture-input"
            />
            <label
              htmlFor="profile-picture-input"
              className="profile-picture-label"
            >
              {formValues.profileImage ? (
                <img
                  src={URL.createObjectURL(formValues.profileImage)}
                  alt="Profile"
                  className="profile-picture-preview"
                  style={{
                    width: "66px",
                    height: "66px",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <div style={{ width: "70px", height: "70px" }}></div>
              )}
            </label>
          </div>
          <div style={{ height: 8 }}></div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <CustomTextField
              label="Name"
              hintText="First Name..."
              icon={<User size={16} color="grey" />}
              value={formValues.firstName}
              setValue={(value) => {
                updateFormValues("firstName", value);
              }}
              validator={validateFirstName}
              onChange={(value) => {
                if (value[value.length - 1] === " ") {
                  updateFormValues("firstName", value.trim());
                  document.getElementById("last-name").focus();
                }
              }}
              type="text"
              focusOnLoad={true}
              errorTrigger={detailsErrorTrigger}
            />
            <CustomTextField
              id="last-name"
              label="&nbsp;"
              hintText="Last Name..."
              icon={<User size={16} color="grey" />}
              value={formValues.lastName}
              setValue={(value) => {
                updateFormValues("lastName", value);
              }}
              validator={validateLastName}
              onChange={(value) => {
                if (value[value.length - 1] === " ") {
                  updateFormValues("lastName", value.trim());
                  document.getElementById("email").focus();
                }
              }}
              type="text"
              errorTrigger={detailsErrorTrigger}
            />
          </div>
          <div style={{ height: 16 }}></div>
          <CustomTextField
            id="email"
            label="Email"
            hintText="Enter Your Email..."
            icon={<Sms size={16} color="grey" />}
            value={formValues.email}
            setValue={(value) => {
              updateFormValues("email", value);
            }}
            validator={validateEmail}
            type="email"
            errorTrigger={detailsErrorTrigger}
            onSubmit={() => document.getElementById("detailsButton")?.click()}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginTop: "auto",
            }}
          >
            <BackButton toForm={"signup"} toStage={0} />
            <CustomButton
              id="detailsButton"
              type="submit"
              className="submit"
              text="CONTINUE"
              style={{ width: "calc(100% - 56px)", marginTop: "auto" }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Details;