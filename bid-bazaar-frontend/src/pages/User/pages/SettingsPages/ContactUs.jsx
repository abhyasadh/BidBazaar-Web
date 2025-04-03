import { CloseSquare, Sms } from "iconsax-react";
import React, { useCallback, useState } from "react";
import CustomTextArea from "../../../../components/CustomTextArea";
import CustomButton from "../../../../components/CustomButton";
import CustomTextField from "../../../../components/CustomTextField";
import { toast } from "react-toastify";
import { apis, useProtectedApi } from "../../../../APIs/api";

const ContactUs = () => {
  const { protectedPost } = useProtectedApi();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [contactErrorTrigger, setContactErrorTrigger] = useState(0);

  const closeModal = () => {
    setSubject("");
    setMessage("");
    setContactErrorTrigger(0);
    document.getElementById("contact-us").close();
  };

  const validateSubject = useCallback((value) => {
    if (value.trim() === "") {
      return "Subject can't be empty!";
    }
    return null;
  }, []);

  const validateMessage = useCallback((value) => {
    if (value.trim() === "") {
      return "Message can't be empty!";
    }
    return null;
  }, []);

  return (
    <dialog
      id="contact-us"
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
            Contact Us
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
            label="Subject"
            hintText="Enter Message Subject..."
            icon={<Sms size={16} color="grey" />}
            value={subject}
            setValue={(value) => {
              setSubject(value);
            }}
            validator={validateSubject}
            type="text"
            onSubmit={() => {}}
            errorTrigger={contactErrorTrigger}
          />
          <div style={{ height: "20px" }}></div>
          <CustomTextArea
            label="Message"
            hintText="Explain what the problem is..."
            maxLength={8}
            value={message}
            setValue={(value) => {
              setMessage(value);
            }}
            validator={validateMessage}
            type="text"
            errorTrigger={contactErrorTrigger}
          />
        </div>
        <div className="footer">
          <CustomButton
            text={"SUBMIT"}
            onClick={async (e) => {
              e.preventDefault();
              const subjectValidation = validateSubject(subject);
              const messageValidation = validateMessage(message);

              if (subjectValidation === null && messageValidation === null) {
                try {
                  const res = await protectedPost(apis.contact, {
                    subject,
                    message,
                  });
                  if (res.data.success === true) {
                    toast.success(res.data.message);
                    closeModal();
                  } else {
                    toast.error(res.data.message);
                  }
                } catch (e) {
                  toast.error(e.message);
                }
              } else {
                setContactErrorTrigger((prev) => prev + 1);
              }
            }}
          />
        </div>
      </div>
    </dialog>
  );
};

export default ContactUs;
