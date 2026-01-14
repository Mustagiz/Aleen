import jsPDF from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'qrcode';

export const generateInvoicePDF = async (sale) => {
  const doc = new jsPDF();
  const settings = JSON.parse(localStorage.getItem('shopSettings') || '{}');
  const shopName = settings.shopName || 'ALEEN CLOTHING';
  const tagline = settings.tagline || 'Empowering Indian Women';
  const address = settings.address || 'Baba Jaan Chawk, Pune';
  const city = settings.city || 'Pune';
  const state = settings.state || 'Maharashtra';
  const pincode = settings.pincode || '';
  const phone = settings.phone || '+91 98765 43210';
  const gstNumber = settings.gstNumber || '';
  const upiId = settings.upiId || 'aleenclothing@paytm';
  const logo = settings.logo;
  
  // Header Background
  doc.setFillColor(139, 0, 0);
  doc.rect(0, 0, 210, 50, 'F');
  
  // Logo
  if (logo) {
    doc.addImage(logo, 'PNG', 15, 12, 25, 25);
  }
  
  // Shop Name
  doc.setTextColor(255, 253, 208);
  doc.setFontSize(28);
  doc.setFont(undefined, 'bold');
  doc.text(shopName, logo ? 45 : 105, 22, { align: logo ? 'left' : 'center' });
  
  // Tagline
  doc.setFontSize(11);
  doc.setFont(undefined, 'italic');
  doc.text(tagline, logo ? 45 : 105, 30, { align: logo ? 'left' : 'center' });
  
  // Contact Info
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.text(`${address}, ${city}, ${state} ${pincode}`, 105, 40, { align: 'center' });
  doc.text(`${gstNumber ? 'GSTIN: ' + gstNumber + ' | ' : ''}Phone: ${phone}`, 105, 45, { align: 'center' });
  
  // Invoice Title
  doc.setTextColor(139, 0, 0);
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('TAX INVOICE', 105, 62, { align: 'center' });
  
  // Invoice Details Box
  doc.setDrawColor(139, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(15, 70, 85, 25);
  doc.rect(105, 70, 90, 25);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('Invoice Details:', 18, 77);
  doc.setFont(undefined, 'normal');
  doc.text(`Invoice No: ${sale.invoiceNumber}`, 18, 83);
  doc.text(`Date: ${new Date(sale.saleDate).toLocaleDateString('en-IN')}`, 18, 89);
  
  doc.setFont(undefined, 'bold');
  doc.text('Bill To:', 108, 77);
  doc.setFont(undefined, 'normal');
  doc.text(`${sale.customerName}`, 108, 83);
  doc.text(`${sale.customerPhone}`, 108, 89);
  
  // Items Table
  const tableData = sale.items.map((item, idx) => [
    idx + 1,
    item.name,
    item.quantity,
    `₹${item.price.toFixed(2)}`,
    `₹${(item.price * item.quantity).toFixed(2)}`
  ]);
  
  doc.autoTable({
    startY: 100,
    head: [['#', 'Item Description', 'Qty', 'Rate', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: { 
      fillColor: [139, 0, 0], 
      textColor: [255, 253, 208],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 15 },
      1: { halign: 'left', cellWidth: 80 },
      2: { halign: 'center', cellWidth: 20 },
      3: { halign: 'right', cellWidth: 35 },
      4: { halign: 'right', cellWidth: 35 }
    },
    styles: { fontSize: 9, cellPadding: 3 },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });
  
  // Summary Box
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  
  doc.setFontSize(10);
  doc.text('Subtotal:', 145, finalY);
  doc.text(`₹${sale.subtotal.toFixed(2)}`, 190, finalY, { align: 'right' });
  doc.line(145, finalY + 2, 195, finalY + 2);
  
  doc.text(`GST (${sale.gstRate}%):`, 145, finalY + 8);
  doc.text(`₹${sale.gstAmount.toFixed(2)}`, 190, finalY + 8, { align: 'right' });
  
  if (sale.discount > 0) {
    doc.text('Discount:', 145, finalY + 14);
    doc.text(`-₹${sale.discount.toFixed(2)}`, 190, finalY + 14, { align: 'right' });
  }
  
  // Total Box
  doc.setFillColor(139, 0, 0);
  doc.rect(145, finalY + (sale.discount > 0 ? 18 : 12), 50, 10, 'F');
  doc.setTextColor(255, 253, 208);
  doc.setFont(undefined, 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL:', 148, finalY + (sale.discount > 0 ? 25 : 19));
  doc.text(`₹${sale.total.toFixed(2)}`, 190, finalY + (sale.discount > 0 ? 25 : 19), { align: 'right' });
  
  // QR Code for UPI Payment
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(shopName)}&am=${sale.total.toFixed(2)}&cu=INR&tn=Invoice ${sale.invoiceNumber}`;
  const qrCodeDataUrl = await QRCode.toDataURL(upiString, { width: 200, margin: 1 });
  doc.addImage(qrCodeDataUrl, 'PNG', 20, finalY + (sale.discount > 0 ? 10 : 5), 35, 35);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.text('Scan to Pay', 37.5, finalY + (sale.discount > 0 ? 48 : 43), { align: 'center' });
  doc.setFont(undefined, 'normal');
  doc.setFontSize(8);
  doc.text(upiId, 37.5, finalY + (sale.discount > 0 ? 53 : 48), { align: 'center' });
  
  // Footer
  doc.setDrawColor(139, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(15, 270, 195, 270);
  
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'italic');
  doc.setFontSize(9);
  doc.text('Thank you for your business!', 105, 277, { align: 'center' });
  doc.setFont(undefined, 'normal');
  doc.setFontSize(8);
  doc.text('This is a computer generated invoice and does not require signature.', 105, 283, { align: 'center' });
  
  return doc;
};

export const downloadInvoice = async (sale) => {
  const doc = await generateInvoicePDF(sale);
  doc.save(`Invoice_${sale.invoiceNumber}.pdf`);
};

export const shareOnWhatsApp = async (sale) => {
  const settings = JSON.parse(localStorage.getItem('shopSettings') || '{}');
  const shopName = settings.shopName || 'ALEEN CLOTHING';
  const address = settings.address || 'Baba Jaan Chawk, Pune';
  
  const itemsList = sale.items.map(item => 
    `${item.name}%0AQty: ${item.quantity} x ₹${item.price} = ₹${(item.price * item.quantity).toFixed(2)}`
  ).join('%0A%0A');
  
  const message = `*${shopName.toUpperCase()}*%0A*Invoice: ${sale.invoiceNumber}*%0A%0A*Items Purchased:*%0A${itemsList}%0A%0A*Subtotal:* ₹${sale.subtotal.toFixed(2)}%0A*GST (${sale.gstRate}%):* ₹${sale.gstAmount.toFixed(2)}${sale.discount > 0 ? `%0A*Discount:* -₹${sale.discount.toFixed(2)}` : ''}%0A*Total:* ₹${sale.total.toFixed(2)}%0A%0AThank you for your purchase! Visit Again%0A%0A${shopName} | ${address}`;
  
  // Generate PDF
  const doc = await generateInvoicePDF(sale);
  const pdfBlob = doc.output('blob');
  const pdfFile = new File([pdfBlob], `Invoice_${sale.invoiceNumber}.pdf`, { type: 'application/pdf' });
  
  // Check if device supports file sharing
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  if (isMobile && navigator.share) {
    try {
      // Try sharing with file
      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({
          files: [pdfFile],
          title: `Invoice ${sale.invoiceNumber}`,
          text: message.replace(/%0A/g, '\n').replace(/\*/g, '')
        });
        return;
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.log('Share failed, trying alternative method');
    }
  }
  
  // Fallback: Download PDF and open WhatsApp
  await downloadInvoice(sale);
  setTimeout(() => {
    const whatsappUrl = `https://wa.me/${sale.customerPhone.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }, 500);
};
