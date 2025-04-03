import React from "react";

const CircularLoading = ({ size, strokeWidth, foregroundColor, backgroundColor }) => {
  const finalSize = size ?? 20;
  const finalStrokeWidth = strokeWidth ?? 3;
  const center = finalSize / 2;
  const radius = center - finalStrokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg
      width={finalSize}
      height={finalSize}
      viewBox={`0 0 ${finalSize} ${finalSize}`}
      className="circular-progress"
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={foregroundColor ?? "#ff6c44"}
        strokeWidth={finalStrokeWidth}
      />
      <>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={backgroundColor ?? "white"}
          strokeWidth={finalStrokeWidth}
          strokeLinecap="round"
          className="spinner"
          style={{
            animation: "rotate 1s linear infinite",
            transformOrigin: "center",
            strokeDasharray: `${circumference} ${circumference}`,
            strokeDashoffset: circumference / 4,
          }}
        />
      </>
    </svg>
  );
};

export default CircularLoading;
