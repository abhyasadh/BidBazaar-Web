import { useEffect, useRef, useState } from "react";
import { Eye, EyeSlash } from "iconsax-react";

const CustomTextField = ({
  id,
  label,
  hintText,
  icon,
  prefix,
  value,
  setValue,
  validator,
  type = "text",
  focusOnLoad = false,
  textAlign = "left",
  maxLength,
  onChange,
  onSubmit,
  errorTrigger,
  isTableElement = false,
}) => {
  const [error, setError] = useState(null);
  const [obscureText, setObscureText] = useState(type === "password");
  const inputRef = useRef(null);
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    if (focusOnLoad && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusOnLoad]);

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
      borderRadius: `${ isTableElement ? "0px" : "10px" }`,
      overflow: "hidden",
      backgroundColor: "var(--color-scheme-primary)",
      border: error ? "2px solid var(--error-color)" : "2px solid transparent",
    },
    iconContainer: {
      position: "absolute",
      left: "12px",
      top: `calc(50% ${prefix ? "" : "+ 2px"})`,
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
      width: "100%",
      padding: `10px ${type === "password" ? '36px' : '10px'} 10px ${(icon || prefix) ? '36px' : '12px'}`,
      outline: "none",
      border: "none",
      backgroundColor: "transparent",
      fontSize: "14px",
      fontFamily: "Blinker",
      color: "var(--text-color)",
      baseline: "center",
      textAlign: textAlign,
    },
    viewButton: {
      position: "absolute",
      right: "6px",
      top: "calc(50% + 2px)",
      transform: "translateY(-50%)",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
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
      {label && <label className="label" style={styles.label}>{label}</label>}
      <div style={styles.inputContainer} className="input-container">
        <div style={styles.iconContainer}>
          {icon && <span style={styles.icon}>{icon}</span>}
          {prefix && <span style={styles.prefix}>{prefix}</span>}
        </div>
        <input
          id={id}
          ref={inputRef}
          type={obscureText ? "password" : "text"}
          placeholder={hintText}
          value={value}
          onChange={handleChange}
          onBlur={() => {
            if (value!=='') setError(validator(value));
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
        {type === "password" && (
          <button
            type="button"
            onClick={() => setObscureText(!obscureText)}
            style={styles.viewButton}
          >
            {obscureText ? (
              <Eye color="grey" size={17} />
            ) : (
              <EyeSlash color="grey" size={17} />
            )}
          </button>
        )}
      </div>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

export default CustomTextField;
