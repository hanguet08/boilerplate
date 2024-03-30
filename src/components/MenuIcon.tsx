import { MouseEventHandler } from 'react';
import cx from 'classnames';

interface IProps {
  onClick?: MouseEventHandler<HTMLSpanElement>;
  className?: string;
}

export default function MenuIcon({ onClick, className }: IProps) {
  return (
    <span className={cx('!flex items-center', className)} onClick={onClick}>
      <svg
        stroke="currentColor"
        fill="none"
        strokeWidth="0"
        viewBox="0 0 24 24"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16"></path>
      </svg>
    </span>
  );
}
