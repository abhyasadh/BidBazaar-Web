import React, { useState, useRef, useEffect } from "react";

const CustomSelect = ({
  id,
  label,
  hintText,
  icon,
  prefix,
  value,
  setValue,
  validator,
  onChange,
  options,
  errorTrigger,
  isTableElement = false,
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
      borderRadius: `${isTableElement ? "0" : "10px"}`,
      overflow: "hidden",
      backgroundColor: "var(--color-scheme-primary)",
      border: error ? "2px solid var(--error-color)" : "1px solid transparent",
    },
    iconContainer: {
      position: "absolute",
      left: "12px",
      top: `calc(50% + 2px)`,
      transform: "translateY(-50%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    prefix: {
      fontFamily: "Blinker",
      fontSize: "14px",
      color: "grey",
    },
    input: {
      width: "98%",
      padding: `10px 10px 10px ${(prefix || icon) ? "36px" : "10px"}`,
      outline: "none",
      border: "none",
      backgroundColor: "transparent",
      fontSize: "14px",
      fontFamily: "Blinker",
      color: value === hintText ? "grey" : "var(--text-color)",
      baseline: "center",
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
        <div style={styles.iconContainer}>
          {icon && <span style={styles.icon}>{icon}</span>}
          {prefix && <span style={styles.prefix}>{prefix}</span>}
        </div>
        <select
          id={id}
          placeholder={hintText}
          value={value || ""}
          onChange={handleChange}
          onBlur={() => {
            if (value !== "") setError(validator(value));
            else setError(null);
          }}
          style={{
            ...styles.input,
            color: value ? "var(--text-color)" : "grey",
          }}
        >
          <option value={""} disabled hidden>
            {hintText}
          </option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

export default CustomSelect;
