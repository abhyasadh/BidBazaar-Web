import { CloseSquare } from "iconsax-react";
import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import CustomSelect from "../../../components/CustomSelect";
import CustomTextArea from "../../../components/CustomTextArea";
import CustomButton from "../../../components/CustomButton";
import { apis, useProtectedApi } from "../../../APIs/api";
import CustomTextField from "../../../components/CustomTextField";
import { useShareReportModal } from "../context/ShareAndReportContext";

const Report = () => {
  const { selectedItem, closeReportModal } = useShareReportModal();

  const { protectedPost } = useProtectedApi();

  const [subject, setSubject] = useState("");
  const [specificSubject, setSpecificSubject] = useState("");
  const [message, setMessage] = useState("");

  const [contactErrorTrigger, setContactErrorTrigger] = useState(0);

  const validateSubject = useCallback((value) => {
    if (value.trim() === "") {
      return "Subject can't be empty!";
    }
    return null;
  }, []);

  const validateSpecificSubject = useCallback(
    (value) => {
      if (subject === "Others" && value.trim() === "") {
        return "Please specify a subject!";
      }
      return null;
    },
    [subject]
  );

  const validateMessage = useCallback((value) => {
    if (value.trim() === "") {
      return "Message can't be empty!";
    }
    return null;
  }, []);

  const reset = () => {
    setContactErrorTrigger(0);
    setSubject("");
    setSpecificSubject("");
    setMessage("");
  };

  if (!selectedItem) return null;

  return (
    <dialog
      id="report"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        reset();
        closeReportModal();
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
            Report Item
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
              reset();
              closeReportModal();
            }}
          >
            <CloseSquare color="grey" size={30} />
          </button>
        </div>
        <div className="content">
          <span className="label">Product</span>
          <div style={{ display: "flex", gap: "4px", marginTop: "10px" }}>
            <img
              src={selectedItem.imageLink}
              alt={selectedItem.title}
              width={80}
              style={{
                borderRadius: "10px",
                border: "3px solid var(--color-scheme-primary)",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                width: "100%",
                backgroundColor: "var(--color-scheme-primary)",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                padding: "10px 14px",
                gap: "4px",
              }}
            >
              <span
                style={{
                  color: "var(--primary-color)",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                {selectedItem.title}
              </span>
              <span
                style={{
                  color: "var(--text-color)",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                Rs. {selectedItem.price.toLocaleString()}
              </span>
            </div>
          </div>
          <div style={{ height: "20px" }}></div>
          <CustomSelect
            label="Subject"
            hintText="Select Subject..."
            value={subject}
            setValue={(value) => {
              setSubject(value);
            }}
            validator={() => {}}
            errorTrigger={contactErrorTrigger}
            options={[
              { value: "Spam", label: "Spam" },
              {
                value: "Inappropriate Content",
                label: "Inappropriate Content",
              },
              { value: "Fraud", label: "Fraud" },
              { value: "Copyright Violation", label: "Copyright Violation" },
              { value: "Others", label: "Others" },
            ]}
          />
          <div style={{ height: "20px" }}></div>
          {subject === "Others" && (
            <>
              <CustomTextField
                label="Specify Subject"
                hintText="Please Specify..."
                value={specificSubject}
                setValue={(value) => {
                  setSpecificSubject(value);
                }}
                validator={validateSpecificSubject}
                type="text"
                errorTrigger={contactErrorTrigger}
              />
              <div style={{ height: "20px" }}></div>
            </>
          )}
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
              const specificSubjectValidation =
                validateSpecificSubject(specificSubject);
              const messageValidation = validateMessage(message);

              if (
                subjectValidation === null &&
                specificSubjectValidation === null &&
                messageValidation === null
              ) {
                try {
                  const res = await protectedPost(apis.report, {
                    itemId: selectedItem.itemId,
                    subject: subject !== "Others" ? subject : specificSubject,
                    message: message,
                  });
                  if (res.data.success === true) {
                    toast.success(res.data.message);
                    reset();
                    closeReportModal();
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

export default Report;
