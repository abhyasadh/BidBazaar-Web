import React from "react";
import { useProtectedApi, apis } from "../../../../APIs/api";
import { useUser } from "../../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "../../../../contexts/ThemeContext";
import {
  ArrowRight2,
  DocumentText1,
  Judge,
  Logout,
  MessageQuestion,
  Moon,
  Sms,
} from "iconsax-react";
import ContactUs from "../SettingsPages/ContactUs";

const Default = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { protectedPost } = useProtectedApi();
  const { theme, toggleTheme } = useTheme();
  const { setUser } = useUser();

  const SettingsButton = React.memo(
    ({
      icon,
      title,
      description,
      endButton,
      onClick = () => {},
      style = {},
    }) => {
      return (
        <div
          style={{
            display: "flex",
            backgroundColor: "var(--color-scheme-primary)",
            borderRadius: "20px",
            alignItems: "center",
            cursor: "pointer",
            transition: "0.3s ease",
            ...style,
          }}
          onClick={(e) => {
            e.preventDefault();
            onClick();
          }}
        >
          <div style={{ padding: "20px" }}>{icon}</div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "4px",
            }}
          >
            <span
              style={{
                margin: 0,
                color: "var(--text-color)",
                fontSize: "22px",
              }}
            >
              {title}
            </span>
            <p
              style={{
                margin: 0,
                color: "grey",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              {description}
            </p>
          </div>
          <div style={{ marginRight: "16px" }}>{endButton}</div>
        </div>
      );
    }
  );
  return (
    <>
      <h2 className="label">Profile</h2>
      <div
        style={{
          display: "flex",
          alignItems: "start",
          cursor: "pointer",
          transition: "0.3s ease",
          margin: "16px 0 32px 0",
        }}
        onClick={(e) => {
          e.preventDefault();
          navigate("/settings/profile");
        }}
      >
        <img
          width={50}
          height={50}
          style={{
            borderRadius: "50%",
            objectFit: "cover",
            padding: "0px 20px",
          }}
          src={user.profilePicture}
          alt="profile"
        />
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          <span
            style={{
              margin: 0,
              color: "var(--primary-color)",
              fontSize: "22px",
              fontWeight: "600",
            }}
          >
            {user.firstName + " " + user.lastName}
          </span>
          <p
            style={{
              margin: 0,
              color: "grey",
              fontSize: "14px",
              fontWeight: "400",
            }}
          >
            {user.email}
          </p>
        </div>
        <div style={{ marginRight: "16px" }}>
          <ArrowRight2 color="var(--text-color)" size={24} />
        </div>
      </div>
      <SettingsButton
        icon={<Judge color="var(--primary-color)" size={30} />}
        title="Listed Auctions"
        description="All the auctions that you have posted so far."
        endButton={<ArrowRight2 color="var(--text-color)" size={24} />}
        onClick={() => {
          navigate("/settings/listings");
        }}
      />
      <hr
        style={{
          padding: "0px",
          margin: "30px 0 10px 0",
          border: "none",
          backgroundColor: "rgba(128, 128, 128, 0.5)",
          height: "4px",
          borderRadius: "2px",
        }}
      />
      <h2 className="label">System Settings</h2>
      <SettingsButton
        style={{ cursor: "default" }}
        icon={<Moon color="var(--primary-color)" size={30} />}
        title="Dark Mode"
        description="Adjust appearance to reduce glare and give your eyes a break."
        endButton={
          <button
            onClick={toggleTheme}
            style={{
              width: "48px",
              height: "28px",
              padding: "0",
              borderRadius: "15px",
              border: `2px solid ${
                theme === "light" ? "var(--text-color)" : "var(--primary-color)"
              }`,
              backgroundColor:
                theme === "light"
                  ? "var(--color-scheme-secondary)"
                  : "var(--primary-color)",
              display: "flex",
              alignItems: "center",
              position: "relative",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "var(--text-color)",
                position: "absolute",
                left: theme === "light" ? "2px" : "calc(100% - 22px)",
                transition: "left 0.8s ease-in-out",
              }}
            ></div>
          </button>
        }
      />

      <hr
        style={{
          padding: "0px",
          margin: "30px 0 10px 0",
          border: "none",
          backgroundColor: "rgba(128, 128, 128, 0.5)",
          height: "4px",
          borderRadius: "2px",
        }}
      />
      <h2 className="label">More</h2>
      <SettingsButton
        style={{ marginBottom: "32px" }}
        icon={<MessageQuestion color="var(--primary-color)" size={30} />}
        title="FAQs"
        description="Find answers to common questions."
        endButton={<ArrowRight2 color="var(--text-color)" size={24} />}
        onClick={() => {
          navigate("/settings/faq");
        }}
      />
      <SettingsButton
        style={{ marginBottom: "32px" }}
        icon={<Sms color="var(--primary-color)" size={30} />}
        title="Contact Us"
        description="Get in touch for support or inquiries."
        endButton={<ArrowRight2 color="var(--text-color)" size={24} />}
        onClick={() => {
          document.getElementById("contact-us").showModal();
        }}
      />
      <SettingsButton
        style={{ marginBottom: "32px" }}
        icon={<DocumentText1 color="var(--primary-color)" size={30} />}
        title="Terms and Conditions"
        description="Understand the rules and policies."
        endButton={<ArrowRight2 color="var(--text-color)" size={24} />}
        onClick={() => {
          navigate("/settings/terms-and-conditions");
        }}
      />
      <SettingsButton
        style={{ border: "2px solid var(--error-color)", marginBottom: "32px" }}
        icon={<Logout color="var(--error-color)" size={30} />}
        title="Logout"
        description="Securely sign out and exit your account."
        onClick={async () => {
          try {
            await protectedPost(apis.logout);
            setUser(null);
            navigate("/auth", { replace: true });
            toast.success("Logged Out!");
          } catch (error) {
            toast.error("Error logging out!");
          }
        }}
      />
      <ContactUs />
    </>
  );
};

export default Default;
