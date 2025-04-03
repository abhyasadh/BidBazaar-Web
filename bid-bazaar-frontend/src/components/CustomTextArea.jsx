import React, { useEffect, useRef, useState } from "react";

const CustomTextArea = ({
  id,
  label,
  hintText,
  value,
  setValue,
  validator,
  textAlign = "left",
  maxLength,
  onChange,
  onSubmit,
  errorTrigger,
}) => {
  const [error, setError] = useState(null);
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    if (errorTrigger !== 0) {
      setError(validator(valueRef.current));
    } else {
      setError(null);
    }
  }, [errorTrigger, validator]);

  const handleChange = (e) => {
    const val = e.target.value;
    if (maxLength && val.length > maxLength) return;
    setValue(val);
    if (onChange) onChange(val);
    setError(validator(val));
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      position: "relative",
    },
    label: {
      marginLeft: "10px",
      marginBottom: "8px",
      fontFamily: "Blinker",
      fontSize: "14px",
      fontWeight: "500",
      color: "var(--text-color)",
    },
    inputContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      borderRadius: "10px",
      overflow: "hidden",
      backgroundColor: "var(--color-scheme-primary)",
      border: error ? "2px solid var(--error-color)" : "2px solid transparent",
    },
    input: {
      width: "100%",
      height: "80px",
      padding: "10px",
      outline: "none",
      border: "none",
      backgroundColor: "transparent",
      fontSize: "14px",
      fontFamily: "Blinker",
      color: "var(--text-color)",
      baseline: "center",
      textAlign: textAlign,
      resize: "none",
    },
    error: {
      marginTop: "4px",
      marginLeft: "10px",
      marginBottom: "0",
      fontFamily: "Blinker",
      fontSize: "12px",
      color: "var(--error-color)",
      whiteSpace: "pre-line",
    },
  };

  return (
    <div style={styles.container}>
      {label && (
        <label className="label" style={styles.label}>
          {label}
        </label>
      )}
      <div style={styles.inputContainer} className="input-container">
        <textarea
          id={id}
          placeholder={hintText}
          value={value}
          onChange={handleChange}
          onBlur={() => {
            if (value !== "") setError(validator(value));
            else setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSubmit && onSubmit();
            }
          }}
          style={styles.input}
        />
      </div>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

export default CustomTextArea;
