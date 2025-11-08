
import React from 'react';
import Confetti from 'react-confetti';

interface ConfettiCanvasProps {
  show: boolean;
}

const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({ show }) => {
  if (!show) {
    return null;
  }

  const { innerWidth, innerHeight } = window;

  return (
    <Confetti
      width={innerWidth}
      height={innerHeight}
      recycle={false} // Only shoot once
      numberOfPieces={300}
      gravity={0.15}
      wind={0.02}
      confettiSource={{
        x: innerWidth / 2,
        y: innerHeight * 0.7,
        w: innerWidth,
        h: innerHeight * 0.6,
      }}
      initialVelocityX={5}
      initialVelocityY={20}
      tweenDuration={10000}
    />
  );
};

export default ConfettiCanvas;
