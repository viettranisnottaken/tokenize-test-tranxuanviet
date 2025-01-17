import React, { forwardRef } from 'react';

import './PillBtn.scss';

type TPillBtnProps = {
  children: React.ReactNode;
  classNames?: string;
  id?: string;
  width?: number | string;
  height?: number | string;
  onClick?: () => void;
};

const PillBtn: React.FC<TPillBtnProps> = forwardRef<HTMLDivElement, TPillBtnProps>(
  ({ children, onClick = () => {}, classNames = '', width = 30, height = 20, id }, ref) => {
    return (
      <div
        ref={ref}
        id={id}
        style={{ width, height }}
        className={'pill-btn ' + classNames}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
);

export default PillBtn;
