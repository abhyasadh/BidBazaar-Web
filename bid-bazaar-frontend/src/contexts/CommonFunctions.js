import { createContext, useContext } from "react";

const FunctionsContext = createContext();
export const FunctionsProvider = ({ children }) => {
  const formatDuration = (timestamp) => {
    const now = new Date();
    const timestampDate = new Date(timestamp);
    const endsInFuture = now < timestampDate;
    const difference = endsInFuture ? timestampDate - now : now - timestampDate;
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);

    return `${endsInFuture ? "Ends In:" : "Ended:"} ${
      days !== 0 ? days + "D" : ""
    } ${hours}H ${minutes}M`;
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const validatePhone = (value) => {
    if (value.trim() === "") return "Phone number can't be empty!";
    const regex =
      /^([+]\d{1,3}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return regex.test(value) ? null : "Invalid phone number!";
  };

  const validateEmail = (value) => {
    if (value.trim() === "") return "Email can't be empty!";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) ? null : "Invalid email format!";
  };

  const validateFirstName = (value) => {
    if (value.trim() === "") {
      return "First name can't be empty!";
    }
    return null;
  };

  const validateLastName = (value) => {
    if (value.trim() === "") {
      return "Last name can't be empty!";
    }
    return null;
  };

  const validateUserPassword = (value) => {
    if (value === "") {
      return "Password can't be empty!";
    }
    return null;
  };

  const validatePassword = (value) => {
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
  };

  const validateImageUpload = (value) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedTypes.includes(value.type)) {
      return "Invalid file type! Only JPEG and PNG are allowed.";
    } else if (value.size > 4 * 1024 * 1024) {
      return "File size should be less than 4MB!";
    }

    return null;
  };

  return (
    <FunctionsContext.Provider
      value={{
        formatDuration,
        generateSlug,
        validatePhone,
        validateEmail,
        validateFirstName,
        validateLastName,
        validateUserPassword,
        validatePassword,
        validateImageUpload,
      }}
    >
      {children}
    </FunctionsContext.Provider>
  );
};

export const useFunctions = () => useContext(FunctionsContext);
