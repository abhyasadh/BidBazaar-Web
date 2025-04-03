import React from "react";
import { CloseSquare } from "iconsax-react";
import Stage1 from "./PostSatges/Stage1";
import Stage2 from "./PostSatges/Stage2";
import Stage3 from "./PostSatges/Stage3";
import Stage4 from "./PostSatges/Stage4";
import { usePost } from "../context/PostContext";
import CircularLoading from "../../../components/CircularLoading";

const Post = () => {
  const { formStage, updateFormStage, reset } = usePost();

  const handleFormView = () => {
    switch (formStage) {
      case 0:
        return <Stage1 />;
      case 1:
        return <Stage2 />;
      case 2:
        return <Stage3 />;
      case 3:
        return <Stage4 />;
      default:
        return <Stage1 />;
    }
  };

  return (
    <dialog id="new-post">
      <button
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: 0,
          border: "none",
          background: "none",
          cursor: "pointer",
        }}
        onClick={() => {
          reset();
          document.getElementById("new-post").close();
        }}
      >
        <CloseSquare color="grey" size={30} />
      </button>
      {formStage !== 0 ? (
        <button
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            padding: 0,
            border: "none",
            background: "none",
            cursor: "pointer",
          }}
          onClick={() => {
            updateFormStage(formStage - 1);
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 19.9201L8.47997 13.4001C7.70997 12.6301 7.70997 11.3701 8.47997 10.6001L15 4.08008"
              stroke="grey"
              strokeWidth="4"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : null}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 className="title" style={{ color: "var(--primary-color)" }}>
          Add Auction
        </h2>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
            marginTop: "12px",
          }}
        >
          <span style={{ color: "var(--text-color)", fontSize: "10px" }}>
            Step 1: Title and Image
          </span>
          <span
            style={{
              color:
                formStage >= 1
                  ? "var(--text-color)"
                  : "rgba(126, 126, 126, 0.5)",
              fontSize: "10px",
            }}
          >
            Step 2: Details
          </span>
          <span
            style={{
              color:
                formStage >= 2
                  ? "var(--text-color)"
                  : "rgba(126, 126, 126, 0.5)",
              fontSize: "10px",
            }}
          >
            Step 3: Price and Time
          </span>
          <span
            style={{
              color:
                formStage >= 3
                  ? "var(--text-color)"
                  : "rgba(126, 126, 126, 0.5)",
              fontSize: "10px",
            }}
          >
            Step 4: Confirmation
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: "5px",
            backgroundColor: "rgba(126, 126, 126, 0.2)",
            marginBottom: "24px",
            borderRadius: "3px",
          }}
        >
          <div
            style={{
              width: `${(formStage + 1) * 25}%`,
              height: "100%",
              backgroundColor: "var(--primary-color)",
              borderRadius: "3px",
              transition: "width 0.5s",
            }}
          ></div>
        </div>
        {handleFormView()}
      </div>

      <dialog
        id="loading-animation"
        style={{
          backgroundColor: "var(--background-color)",
          border: "2px solid rgba(var(--text-color-rgb), 0.3)",
          borderRadius: "18px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularLoading size={30} backgroundColor={"var(--color-scheme-primary)"}/>
        </div>
      </dialog>
    </dialog>
  );
};

export default Post;
