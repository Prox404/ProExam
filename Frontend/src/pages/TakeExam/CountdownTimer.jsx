import { useEffect, useState } from 'react';

const CountdownTimer = ({ examStartTime = new Date(), duration=0, onCountdownFinish }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    let interval;

    const calculateTimeRemaining = () => {
      const startTime = new Date(examStartTime).getTime();
      const endTime = startTime + duration * 1000;
      const now = new Date().getTime();
      const timeLeft = endTime - now;

      console.log(duration, examStartTime);

      if (timeLeft <= 0) {
        setTimeRemaining(0);
        clearInterval(interval);
        if (onCountdownFinish) {
          onCountdownFinish();
        }
      } else {
        setTimeRemaining(timeLeft);
      }
    };

    interval = setInterval(calculateTimeRemaining, 1000);

    calculateTimeRemaining();

    return () => clearInterval(interval);
  }, [examStartTime, duration, onCountdownFinish]);

  const formatTime = (time) => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div>
      {formatTime(timeRemaining)}
    </div>
  );
};

export default CountdownTimer;
