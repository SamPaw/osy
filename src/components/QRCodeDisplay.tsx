'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCodeDisplay({
  value,
  size = 180,
  className = '',
}: QRCodeDisplayProps) {
  return (
    <div
      className={`p-3 bg-white rounded-2xl shadow-xl inline-flex items-center justify-center ${className}`}
    >
      <QRCodeSVG
        value={value}
        size={size}
        level="M"
        bgColor="#ffffff"
        fgColor="#090a0f"
        includeMargin={false}
      />
    </div>
  );
}
