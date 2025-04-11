import React, { useState } from "react";
import CustomTextField from "../../../components/CustomTextField";
import { Call, Lock1 } from "iconsax-react";
import { useUser } from "../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apis, useProtectedApi } from "../../../APIs/api";
import { useAuth } from "../context/AuthContext";
import CustomButton from "../../../components/CustomButton";
import { useFunctions } from "../../../contexts/CommonFunctions";
import { connectSocket } from "../../../APIs/socket";

const Login = () => {
  const navigate = useNavigate();

  const { setUser } = useUser();

  const { updateFormState } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loginErrorTrigger, setLoginErrorTrigger] = useState(0);

  const { validatePhone, validateUserPassword } = useFunctions();

  const { protectedPost } = useProtectedApi();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (
      validatePhone(phone) === null &&
      validateUserPassword(password) === null
    ) {
      try {
        const res = await protectedPost(apis.login, { phone, password });
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          setUser(res.data.user);
          connectSocket(res.data.user.id);
          navigate("/", { replace: true });
        }
      } catch (err) {
        toast.error("Server error!");
        console.log(err.message);
      }
    } else {
      console.log("Error");
      setLoginErrorTrigger((prev) => prev + 1);
    }
  };

  return (
    <div className="form">
      <div className="fields-container" onBlur={() => setLoginErrorTrigger(0)}>
        <span className="heading" style={{ marginBottom: "32px" }}>
          Welcome Back!
        </span>
        <form
          className="fields"
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
        >
          <CustomTextField
            type="tel"
            label="Phone"
            hintText="Enter Your Phone Number..."
            icon={<Call size={16} color="grey" />}
            value={phone}
            setValue={setPhone}
            validator={validatePhone}
            errorTrigger={loginErrorTrigger}
            onSubmit={() => document.getElementById("loginButton")?.click()}
          />
          <div style={{ height: 16 }}></div>
          <CustomTextField
            label="Password"
            hintText="Enter Your Password..."
            icon={<Lock1 size={15} color="grey" />}
            value={password}
            setValue={setPassword}
            validator={validateUserPassword}
            type="password"
            errorTrigger={loginErrorTrigger}
            onSubmit={() => document.getElementById("loginButton")?.click()}
          />
          <div className="forgot">
            <label style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                name="checkbox"
                value="value"
                style={{ margin: "0 8px 0 2px" }}
              />
              Remember Me
            </label>
            <span
              onClick={() => {
                updateFormState("activeForm", "forgotPassword");
                updateFormState("formStage", 0);
              }}
            >
              Recover Password
            </span>
          </div>
          <CustomButton
            id="loginButton"
            type="submit"
            className="submit"
            text="LOGIN"
            style={{ marginTop: "24px" }}
            onClick={handleLoginSubmit}
          />
          <div className="signup-link">
            <span>Don't have an account? </span>
            <span
              className="link"
              onClick={() => {
                setPhone("");
                setPassword("");
                updateFormState("activeForm", "signup");
                updateFormState("formStage", 0);
              }}
            >
              Sign Up
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
