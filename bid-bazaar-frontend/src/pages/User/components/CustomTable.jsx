import React, { useEffect, useState } from "react";
import CustomTextField from "../../../components/CustomTextField";
import CustomSelect from "../../../components/CustomSelect";
import { usePost } from "../context/PostContext";

const CustomTable = ({ label, data, validator, errorTrigger }) => {
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
      border: "2px solid transparent",
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

  const { specificationForm, updateSpecificationValues } = usePost();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (errorTrigger !== 0) {
      setError(validator());
    } else {
      setError(null);
    }
  }, [errorTrigger, validator, specificationForm]);

  return (
    <div style={styles.container}>
      {label && (
        <label className="label" style={styles.label}>
          {label}
        </label>
      )}
      <div style={styles.inputContainer} className="input-container">
        <table
          style={{
            width: "100%",
            fontSize: "14px",
            borderSpacing: "0",
            border: `1px solid var(--color-scheme-secondary)`,
            borderRadius: "10px",
          }}
        >
          <tbody>
            {data.map((specification, index) => (
              <tr key={index}>
                <td
                  style={{
                    minWidth: "25%",
                    padding: "10px",
                    color: "var(--text-color)",
                    border: `1px solid ${
                      error && error[specification.id]
                        ? "var(--error-color)"
                        : "var(--color-scheme-secondary)"
                    }`,
                    borderColor:
                      error && error[specification.id]
                        ? "var(--error-color)"
                        : "var(--color-scheme-secondary)",
                    margin: "0",
                    borderTopLeftRadius: `${index === 0 ? "8px" : "0"}`,
                    borderBottomLeftRadius: `${
                      index === data.length - 1 ? "8px" : "0"
                    }`,
                  }}
                >
                  {specification.name}
                  {specification.required ? (
                    <span style={{ color: "var(--error-color)" }}>*</span>
                  ) : (
                    ""
                  )}
                </td>
                <td
                  style={{
                    width: "75%",
                    border: `1px solid ${
                      error && error[specification.id]
                        ? "var(--error-color)"
                        : "var(--color-scheme-secondary)"
                    }`,
                    margin: "0",
                    borderTopRightRadius: `${index === 0 ? "8px" : "0"}`,
                    borderBottomRightRadius: `${
                      index === data.length - 1 ? "8px" : "0"
                    }`,
                    overflow: "hidden",
                  }}
                >
                  {specification.type !== "dropdown" ? (
                    <CustomTextField
                      key={index}
                      hintText={specification.hintText}
                      value={specificationForm[specification.id] || ""}
                      setValue={(value) => {
                        updateSpecificationValues(specification.id, value);
                      }}
                      validator={() => {}}
                      type="text"
                      isTableElement={true}
                    />
                  ) : (
                    <CustomSelect
                      hintText={specification.hintText}
                      value={specificationForm[specification.id]}
                      setValue={(value) => {
                        updateSpecificationValues(specification.id, value);
                      }}
                      validator={() => {}}
                      options={specification.options}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <p style={styles.error}>{Object.values(error).join(",\n")}</p>}
    </div>
  );
};

export default CustomTable;
