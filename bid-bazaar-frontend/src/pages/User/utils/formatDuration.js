import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);
export const formatDuration = (timestamp, now = Date.now()) => {
  const remaining = dayjs.duration(timestamp - now);
  const milliseconds = remaining.asMilliseconds();

  const formattedTime =
    milliseconds <= 0
      ? "Ended"
      : `Ends In: ${
          milliseconds > 3600000
            ? remaining.hours().toString().padStart(2, "0") + "H"
            : ""
        } ${
          milliseconds > 60000
            ? remaining.minutes().toString().padStart(2, "0") + "M"
            : ""
        } ${
          milliseconds < 300000
            ? remaining.seconds().toString().padStart(2, "0") + "S"
            : ""
        }`;

  return formattedTime;
};
