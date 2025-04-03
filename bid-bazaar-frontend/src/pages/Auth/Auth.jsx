import { Moon, Sun1 } from "iconsax-react";
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import Login from "./forms/Login";
import { useAuth } from "./context/AuthContext";
import Phone from "./forms/Phone";
import OTP from "./forms/OTP";
import Details from "./forms/Details";
import Password from "./forms/Password";

const Auth = () => {
  const { theme, toggleTheme } = useTheme();
  const { formState } = useAuth();

  const renderForm = () => {
    if (formState.activeForm === "login") {
      return <Login />;
    }

    switch (formState.formStage) {
      case 0:
        return <Phone />;
      case 1:
        return <OTP />;
      case 2:
        return formState.activeForm === "signup" ? <Details /> : <Password />;
      case 3:
        return <Password />;
      default:
        return <Login />;
    }
  };

  return (
    <>
      <div
        className="logo-container"
      >
        <img
          src="https://res.cloudinary.com/dprvuiiat/image/upload/v1740547105/Logo/logo_trans_sgpgeh.png"
          alt="logo"
          style={{ height: "100%" }}
        />
        <span
          style={{
            color: "var(--primary-color)",
            fontWeight: "700",
            marginLeft: "6px",
          }}
        >
          Bid
        </span>
        <span style={{ color: "var(--text-color)" }}>Bazaar</span>
      </div>
      <button
        onClick={toggleTheme}
        className="theme-toggle"
      >
        {theme === "light" ? (
          <Moon color="black" size={20} />
        ) : (
          <Sun1 color="white" size={24} />
        )}
      </button>
      <div className="form-container" id="home">
        <div className="image"></div>
        {renderForm()}
      </div>
    </>
  );
};

export default Auth;
