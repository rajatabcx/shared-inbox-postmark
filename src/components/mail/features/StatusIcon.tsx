import { EmailStatus } from '@/lib/types';
import React from 'react';

export default function StatusIcon({ status }: { status: EmailStatus }) {
  return (
    <>
      {status === EmailStatus.DRAFTING_REPLY ? (
        <svg
          aria-label='In Progress'
          width='14'
          height='14'
          viewBox='0 0 14 14'
          fill='none'
          role='img'
          focusable='false'
          xmlns='http://www.w3.org/2000/svg'
        >
          <rect
            x='1'
            y='1'
            width='12'
            height='12'
            rx='6'
            stroke='lch(80% 90 85)'
            strokeWidth='1.5'
            fill='none'
          ></rect>
          <path
            fill='lch(80% 90 85)'
            stroke='none'
            d='M 3.5,3.5 L3.5,0 A3.5,3.5 0 0,1 3.5, 7 z'
            transform='translate(3.5,3.5)'
          ></path>
        </svg>
      ) : status === EmailStatus.DONE ? (
        <svg
          width='14'
          height='14'
          viewBox='0 0 14 14'
          fill='lch(48% 59.31 288.43)'
          role='img'
          focusable='false'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0ZM11.101 5.10104C11.433 4.76909 11.433 4.23091 11.101 3.89896C10.7691 3.56701 10.2309 3.56701 9.89896 3.89896L5.5 8.29792L4.10104 6.89896C3.7691 6.56701 3.2309 6.56701 2.89896 6.89896C2.56701 7.2309 2.56701 7.7691 2.89896 8.10104L4.89896 10.101C5.2309 10.433 5.7691 10.433 6.10104 10.101L11.101 5.10104Z'
          ></path>
        </svg>
      ) : status === EmailStatus.TODO ? (
        <svg
          aria-label='Todo'
          width='14'
          height='14'
          viewBox='0 0 14 14'
          fill='none'
          role='img'
          focusable='false'
          xmlns='http://www.w3.org/2000/svg'
        >
          <rect
            x='1'
            y='1'
            width='12'
            height='12'
            rx='6'
            stroke='#e2e2e2'
            strokeWidth='1.5'
            fill='none'
          ></rect>
          <path
            fill='#e2e2e2'
            stroke='none'
            d='M 3.5,3.5 L3.5,0 A3.5,3.5 0 0,1 3.5, 0 z'
            transform='translate(3.5,3.5)'
          ></path>
        </svg>
      ) : status === EmailStatus.IN_REVIEW ? (
        <svg
          aria-label='In Review'
          width='14'
          height='14'
          viewBox='0 0 14 14'
          fill='none'
          role='img'
          focusable='false'
          xmlns='http://www.w3.org/2000/svg'
        >
          <rect
            x='1'
            y='1'
            width='12'
            height='12'
            rx='6'
            stroke='lch(60% 64.37 141.95)'
            strokeWidth='1.5'
            fill='none'
          ></rect>
          <path
            fill='lch(60% 64.37 141.95)'
            stroke='none'
            d='M 3.5,3.5 L3.5,0 A3.5,3.5 0 1,1 0, 3.5 z'
            transform='translate(3.5,3.5)'
          ></path>
        </svg>
      ) : status === EmailStatus.IN_PROGRESS ? (
        <svg
          aria-label='In Progress'
          width='14'
          height='14'
          viewBox='0 0 14 14'
          fill='none'
          role='img'
          focusable='false'
          xmlns='http://www.w3.org/2000/svg'
        >
          <rect
            x='1'
            y='1'
            width='12'
            height='12'
            rx='6'
            stroke='#f2994a'
            strokeWidth='1.5'
            fill='none'
          ></rect>
          <path
            fill='#f2994a'
            stroke='none'
            d='M 3.5,3.5 L3.5,0 A3.5,3.5 0 0,1 7, 3.5 z'
            transform='translate(3.5,3.5)'
          ></path>
        </svg>
      ) : null}
    </>
  );
}
