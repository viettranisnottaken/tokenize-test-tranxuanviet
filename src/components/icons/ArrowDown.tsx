import React from 'react';

type TArrowDownProps = {
  width: string;
  height: string;
  color: string;
};

const ArrowDown: React.FC<TArrowDownProps> = ({
  width = '16px',
  height = '16px',
  color = '#d1d4dc',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 10L12 15L17 10"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default ArrowDown;
