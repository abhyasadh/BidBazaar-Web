import { useEffect, useRef } from "react";
import { formatDuration } from "../utils/formatDuration";

const Time = ({ timestamp }) => {
  const spanRef = useRef();

  useEffect(() => {
    const updateText = () => {
      if (spanRef.current) {
        const now = Date.now();
        spanRef.current.textContent = formatDuration(timestamp, now);
      }
    };

    updateText();
    const interval = setInterval(updateText, 1000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return <span ref={spanRef} />;
};

export default Time;
