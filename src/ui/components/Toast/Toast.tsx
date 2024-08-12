import React from 'react';
import { ToastType } from '../../providers/toast/types';

interface ToastProps {
  type: ToastType;
  message: string;
}

export function Toast({ type, message }: ToastProps) {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-md text-white ${bgColor}`}>
      {message}
    </div>
  );
}