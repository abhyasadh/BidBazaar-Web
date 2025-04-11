import React, { useCallback, useState } from "react";
import CustomTextField from "../../../../components/CustomTextField";
import { Sms, User } from "iconsax-react";
import CustomButton from "../../../../components/CustomButton";
import { useUser } from "../../../../contexts/UserContext";
import { apis, useProtectedApi } from "../../../../APIs/api";
import { toast } from "react-toastify";
import { useFunctions } from "../../../../contexts/CommonFunctions";

const Profile = () => {
  const [verificationError, setVerificationError] = useState("");
  const [detailsErrorTrigger, setDetailsErrorTrigger] = useState(0);

  const {
    validateFirstName,
    validateLastName,
    validateEmail,
    validateImageUpload,
  } = useFunctions();

  const { protectedPut } = useProtectedApi();
  const { user, setUser } = useUser();

  const [formValues, setFormValues] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    profileImage: user.profilePicture,
    citizenshipFront: user.citizenshipImage ? user.citizenshipImage[0] : null,
    citizenshipBack: user.citizenshipImage ? user.citizenshipImage[1] : null,
  });

  const updateFormValues = useCallback((key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (validateImageUpload(file) !== null) {
      toast.error(validateImageUpload(file));
      return;
    }
    updateFormValues("profileImage", file);
  };

  const handleCitizenshipFront = (e) => {
    const file = e.target.files[0];
    if (validateImageUpload(file) !== null) {
      setVerificationError(validateImageUpload(file));
      return;
    }
    setVerificationError("");
    updateFormValues("citizenshipFront", file);
  };

  const handleCitizenshipBack = (e) => {
    const file = e.target.files[0];
    if (validateImageUpload(file) !== null) {
      setVerificationError(validateImageUpload(file));
      return;
    }
    setVerificationError("");
    updateFormValues("citizenshipBack", file);
  };

  const handleDetailsSubmit = async () => {
    if (
      formValues.email === user.email &&
      formValues.firstName === user.firstName &&
      formValues.lastName === user.lastName &&
      typeof formValues.profileImage === "string"
    ) {
      toast.success("Profile updated successfully!");
      return;
    }

    const emailValidation = validateEmail(formValues.email);
    const firstNameValidation = validateFirstName(formValues.firstName);
    const lastNameValidation = validateLastName(formValues.lastName);

    if (
      emailValidation === null &&
      firstNameValidation === null &&
      lastNameValidation === null
    ) {
      try {
        const formData = new FormData();

        formData.append("firstName", formValues.firstName);
        formData.append("lastName", formValues.lastName);
        formData.append("email", formValues.email);

        if (formValues.profileImage instanceof File) {
          formData.append("profileImage", formValues.profileImage);
        }

        const response = await protectedPut(apis.updateUser, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.data.success) {
          toast.success("Profile updated successfully!");
          setUser(response.data.user);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setDetailsErrorTrigger((prev) => prev + 1);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();

    if (
      formValues.citizenshipFront !== null &&
      formValues.citizenshipBack !== null
    ) {
      if (
        formValues.citizenshipFront instanceof File &&
        formValues.citizenshipBack instanceof File
      ) {
        const formData = new FormData();
        formData.append("citizenshipFront", formValues.citizenshipFront);
        formData.append("citizenshipBack", formValues.citizenshipBack);

        try {
          const response = await protectedPut(apis.updateUser, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          if (response.data.success) {
            toast.success("Verification request sent successfully!");
            setUser(response.data.user);
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      setVerificationError("Please upload the documents!");
    }
  };

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <div>
        <div>
          <h1 className="label">Profile Details</h1>
          <form
            className="fields"
            autoComplete="off"
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: "20px",
            }}
          >
            <div
              className="profile-picture-upload"
              style={{ width: "180px", height: "180px" }}
            >
              {user.isVerified !== "Verified" ? (
                <>
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
                        src={
                          typeof formValues.profileImage === "string"
                            ? formValues.profileImage
                            : URL.createObjectURL(formValues.profileImage)
                        }
                        alt="Profile"
                        className="profile-picture-preview"
                        style={{
                          width: "180px",
                          height: "180px",
                          objectFit: "cover",
                          borderRadius: "50%",
                          cursor: "pointer",
                        }}
                      />
                    ) : (
                      <div style={{ width: "180px", height: "180px" }}></div>
                    )}
                  </label>
                </>
              ) : (
                <img
                  src={formValues.profileImage}
                  alt="Profile"
                  className="profile-picture-preview"
                  style={{
                    width: "180px",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                />
              )}
            </div>
            <div style={{ height: 8 }}></div>

            <div style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                  width: "100%",
                }}
              >
                <CustomTextField
                  label="Name"
                  hintText="First Name..."
                  icon={<User size={16} color="grey" />}
                  value={formValues.firstName}
                  setValue={(value) => {
                    user.isVerified !== "Pending" &&
                      user.isVerified !== "Verified" &&
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
                  errorTrigger={detailsErrorTrigger}
                />
                <CustomTextField
                  id="last-name"
                  label="&nbsp;"
                  hintText="Last Name..."
                  icon={<User size={16} color="grey" />}
                  value={formValues.lastName}
                  setValue={(value) => {
                    user.isVerified !== "Pending" &&
                      user.isVerified !== "Verified" &&
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
                  user.isVerified !== "Pending" &&
                    user.isVerified !== "Verified" &&
                    updateFormValues("email", value);
                }}
                validator={validateEmail}
                type="email"
                errorTrigger={detailsErrorTrigger}
              />
              {user.isVerified !== "Pending" &&
                user.isVerified !== "Verified" && (
                  <CustomButton
                    id="detailsButton"
                    type="button"
                    className="submit"
                    text="SAVE CHANGES"
                    style={{ width: "100%", marginTop: "30px" }}
                    onClick={handleDetailsSubmit}
                  />
                )}
            </div>
            <hr
              style={{
                width: "8px",
                height: "220px",
                border: "none",
                borderRadius: "12px",
                backgroundColor: "rgba(128, 128, 128, 0.5)",
                margin: "0 20px",
              }}
            />
            <div className="info" style={{ margin: "0", padding: "20px" }}>
              <p style={{ fontSize: "14px" }}>
                {user.isVerified !== "Verified" ? (
                  <>
                    Your name and profile picture will also be considered for
                    verification.
                    <br />
                    <br />- Upload a Passport Size Photo (preferred) or a photo
                    in which your face is clearly seen.
                    <br />
                    <br />- Your name should be same as in your citizenship
                    document.
                  </>
                ) : (
                  <>
                    Your profile is verified.
                    <br />
                    <br />- You can not update your details once verified.
                    <br />
                    <br />- If you want to update your details, please contact
                    us.
                  </>
                )}
              </p>
            </div>
          </form>
        </div>
      </div>
      <hr
        style={{
          padding: "0px",
          margin: "40px 0",
          border: "none",
          backgroundColor: "rgba(128, 128, 128, 0.5)",
          height: "4px",
        }}
      />
      <div>
        <h1 className="label">
          Verification <span>Status:</span>
          <span
            style={{
              color:
                user.isVerified === "Verified"
                  ? "var(--success-color)"
                  : user.isVerified === "Pending"
                  ? "orange"
                  : "var(--error-color)",
            }}
          >
            {" "}
            {user.isVerified}
          </span>
        </h1>
        <form className="fields" autoComplete="off">
          <div
            style={{
              display: "flex",
              gap: "40px",
              marginTop: "16px",
              marginBottom: "10px",
              width: "75%",
            }}
          >
            {user.isVerified === "Not Verified" ||
            user.isVerified === "Rejected" ? (
              <>
                <input
                  type="file"
                  id="citizenshipFront"
                  style={{ display: "none" }}
                  onChange={handleCitizenshipFront}
                />
                <label
                  htmlFor="citizenshipFront"
                  className="file-upload"
                  style={{
                    width: "calc(50% - 20px)",
                    aspectRatio: "4/3",
                    display: "flex",
                    border:
                      verificationError !== ""
                        ? "2px dashed var(--error-color)"
                        : formValues.citizenshipFront
                        ? "2px solid transparent"
                        : "2px dashed rgba(128, 128, 128, 0.5)",
                    borderRadius: "12px",
                    cursor: "pointer",
                    overflow: "hidden",
                  }}
                >
                  {formValues.citizenshipFront ? (
                    <img
                      src={
                        typeof formValues.citizenshipFront === "string"
                          ? formValues.citizenshipFront
                          : URL.createObjectURL(formValues.citizenshipFront)
                      }
                      alt="Citizenship Front"
                      style={{
                        width: "100%",
                        aspectRatio: "4/3",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
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
                      <span style={{ fontSize: "20px" }}>
                        Citizenship Front
                      </span>
                    </div>
                  )}
                </label>

                <input
                  type="file"
                  id="citizenshipBack"
                  style={{ display: "none" }}
                  onChange={handleCitizenshipBack}
                />
                <label
                  htmlFor="citizenshipBack"
                  className="file-upload"
                  style={{
                    width: "calc(50% - 20px)",
                    aspectRatio: "4/3",
                    display: "flex",
                    border:
                      verificationError !== ""
                        ? "2px dashed var(--error-color)"
                        : formValues.citizenshipBack
                        ? "2px solid transparent"
                        : "2px dashed rgba(128, 128, 128, 0.5)",
                    borderRadius: "12px",
                    cursor: "pointer",
                    overflow: "hidden",
                  }}
                >
                  {formValues.citizenshipBack ? (
                    <img
                      src={
                        typeof formValues.citizenshipBack === "string"
                          ? formValues.citizenshipBack
                          : URL.createObjectURL(formValues.citizenshipBack)
                      }
                      alt="Citizenship Back"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
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
                      <span style={{ fontSize: "20px" }}>Citizenship Back</span>
                    </div>
                  )}
                </label>
              </>
            ) : (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  gap: "40px",
                  marginTop: "16px",
                  marginBottom: "30px",
                }}
              >
                <img
                  src={user.citizenshipImage[0]}
                  alt="Citizenship Front"
                  style={{
                    width: "calc(50% - 20px)",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
                <img
                  src={user.citizenshipImage[1]}
                  alt="Citizenship Back"
                  style={{
                    width: "calc(50% - 20px)",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              </div>
            )}
          </div>
          {verificationError !== "" && (
            <span
              style={{
                marginTop: "0",
                marginLeft: "10px",
                marginBottom: "0",
                fontFamily: "Blinker",
                fontSize: "12px",
                color: "var(--error-color)",
                whiteSpace: "pre-line",
              }}
            >
              {verificationError}
            </span>
          )}
          {user.isVerified !== "Pending" && user.isVerified !== "Verified" && (
            <CustomButton
              type="button"
              className="submit"
              text="REQUEST VERIFICATION"
              style={{ width: "75%", marginBottom: "40px" }}
              onClick={handleVerificationSubmit}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
