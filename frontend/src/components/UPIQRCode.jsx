import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export default function UPIQRCode({ amount, invoiceNumber }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && amount) {
      const settings = JSON.parse(localStorage.getItem('shopSettings') || '{}');
      const upiId = settings.upiId || 'aleenclothing@paytm';
      const shopName = settings.shopName || 'ALEEN CLOTHING';
      
      const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(shopName)}&am=${amount.toFixed(2)}&cu=INR&tn=Invoice ${invoiceNumber}`;
      
      QRCode.toCanvas(canvasRef.current, upiString, { width: 200, margin: 2 }, (error) => {
        if (error) console.error(error);
      });
    }
  }, [amount, invoiceNumber]);

  return (
    <div className="text-center">
      <canvas ref={canvasRef}></canvas>
      <p className="text-sm text-gray-600 mt-2">Scan to pay ₹{amount?.toFixed(2)}</p>
    </div>
  );
}
