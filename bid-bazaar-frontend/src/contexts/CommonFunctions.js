import { createContext, useCallback, useContext } from "react";

const FunctionsContext = createContext();
export const FunctionsProvider = ({ children }) => {

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const validatePhone = useCallback((value) => {
    if (value.trim() === "") return "Phone number can't be empty!";
    const regex =
      /^([+]\d{1,3}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return regex.test(value) ? null : "Invalid phone number!";
  }, []);

  const validateEmail = useCallback((value) => {
    if (value.trim() === "") return "Email can't be empty!";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) ? null : "Invalid email format!";
  }, []);

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

  const validateUserPassword = useCallback((value) => {
    if (value === "") {
      return "Password can't be empty!";
    }
    return null;
  }, []);

  const validatePassword = useCallback((value) => {
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

  const validateImageUpload = useCallback((value) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedTypes.includes(value.type)) {
      return "Invalid file type! Only JPEG and PNG are allowed.";
    } else if (value.size > 4 * 1024 * 1024) {
      return "File size should be less than 4MB!";
    }

    return null;
  }, []);

  return (
    <FunctionsContext.Provider
      value={{
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
