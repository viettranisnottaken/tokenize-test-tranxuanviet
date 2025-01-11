import React from 'react';

import './RoundBtn.scss';

type TRoundBtnProps = {
  children: React.ReactNode;
  width?: number;
  height?: number;
  classNames?: string;
  onClick?: () => void;
};
const RoundBtn: React.FC<TRoundBtnProps> = ({
  children,
  width = 15,
  height = 15,
  classNames,
  onClick = () => {},
}) => {
  return (
    <div style={{ width, height }} className={"round-btn " + classNames} onClick={onClick}>
      {children}
    </div>
  );
};

export default RoundBtn;
