import React, { useState } from "react";
import { useProtectedApi, apis } from "../../../../APIs/api";
import { useUser } from "../../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "../../../../contexts/ThemeContext";
import {
  ArrowRight2,
  DocumentText1,
  InfoCircle,
  Judge,
  Logout,
  MessageQuestion,
  Moon,
  NotificationBing,
  PasswordCheck,
  Sms,
} from "iconsax-react";
import ContactUs from "../SettingsPages/ContactUs";
import ChangePassword from "./ChangePassword";
import { disconnectSocket } from "../../../../APIs/socket";

const Default = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { protectedPost } = useProtectedApi();
  const { theme, toggleTheme } = useTheme();
  const { setUser } = useUser();

  const [notification, setNotification] = useState(
    Notification.permission === "default"
  );

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
          src={
            user.profilePicture
              ? user.profilePicture
              : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='1.6 1.6 20.8 20.8'%3E%3Cpath d='M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.71997 11.28 8.71997 9.50998C8.71997 7.69998 10.18 6.22998 12 6.22998C13.81 6.22998 15.28 7.69998 15.28 9.50998C15.27 11.28 13.88 12.72 12.12 12.78Z' stroke='%239e9e9e' stroke-width='0.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M18.74 19.3801C16.96 21.0101 14.6 22.0001 12 22.0001C9.40001 22.0001 7.04001 21.0101 5.26001 19.3801C5.36001 18.4401 5.96001 17.5201 7.03001 16.8001C9.77001 14.9801 14.25 14.9801 16.97 16.8001C18.04 17.5201 18.64 18.4401 18.74 19.3801Z' stroke='%239e9e9e' stroke-width='0.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z' stroke='%239e9e9e' stroke-width='0.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"
          }
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
            Verification Status:{" "}
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
              {user.isVerified}
            </span>
          </p>
        </div>
        <div style={{ marginRight: "16px" }}>
          <ArrowRight2 color="var(--text-color)" size={24} />
        </div>
      </div>

      <SettingsButton
        style={{ marginBottom: "32px" }}
        icon={<Judge color="var(--primary-color)" size={30} />}
        title="Listed Auctions"
        description="All the auctions that you have posted so far."
        endButton={<ArrowRight2 color="var(--text-color)" size={24} />}
        onClick={() => {
          navigate("/settings/listings");
        }}
      />
      <SettingsButton
        icon={<PasswordCheck color="var(--primary-color)" size={30} />}
        title="Change Password"
        description="Frequently update your password for security."
        endButton={<ArrowRight2 color="var(--text-color)" size={24} />}
        onClick={() => {
          document.getElementById("change-password").showModal();
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
        style={{ cursor: "default", marginBottom: "32px" }}
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

      {notification ? (
        <SettingsButton
          style={{ cursor: "default" }}
          icon={<NotificationBing color="var(--primary-color)" size={30} />}
          title="Notifications"
          description="Receive alerts and updates about your auctions."
          endButton={
            <button
              onClick={async () => {
                if (!("Notification" in window)) {
                  alert("Browser does not support notifications!");
                } else if (Notification.permission !== "denied") {
                  await Notification.requestPermission().then((permission) => {
                    setNotification(permission === "default");
                  });
                }
              }}
              style={{
                width: "48px",
                height: "28px",
                padding: "0",
                borderRadius: "15px",
                border: `2px solid var(--text-color)`,
                backgroundColor: "var(--color-scheme-secondary)",
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
                  left: "2px",
                  transition: "left 0.8s ease-in-out",
                }}
              ></div>
            </button>
          }
        />
      ) : (
        <div className="info">
          <InfoCircle size={24} color="#ff6c44" style={{ width: "50px" }} />
          <p style={{ fontSize: "16px" }}>
            Notifications are{" "}
            {Notification.permission === "granted" ? "enabled" : "disabled"}.
            You can{" "}
            {Notification.permission === "granted" ? "disable" : "enable"} them
            in your browser settings.
          </p>
        </div>
      )}

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
            disconnectSocket();
            navigate("/auth", { replace: true });
            toast.success("Logged Out!");
          } catch (error) {
            toast.error("Error logging out!");
          }
        }}
      />
      <ContactUs />
      <ChangePassword />
    </>
  );
};

export default Default;
