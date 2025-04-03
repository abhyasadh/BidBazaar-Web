import React, { useState, useEffect } from 'react';

const Timer = ({timeInSeconds, onComplete}) => {
  const [seconds, setSeconds] = useState(timeInSeconds);

  useEffect(() => {
    let timer;

    timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    if (seconds === 0) {
      clearInterval(timer);
      onComplete();
    }

    return () => clearInterval(timer);
  }, [seconds, onComplete]);

  return (
    <span>{`${Math.floor(seconds / 60).toLocaleString('en-US', { minimumIntegerDigits: 2 })}:${(seconds % 60).toLocaleString('en-US', { minimumIntegerDigits: 2 })}`}</span>
  );
};

export default Timer;
