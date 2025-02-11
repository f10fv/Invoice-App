// // "use client";

// // import { Badge } from "@/components/ui/badge";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Separator } from "@/components/ui/separator";
// // import { useSearchParams } from "next/navigation";
// // import { useEffect, useState } from "react";
// // import { format } from "date-fns";
// // import { Button } from "@/components/ui/button";

// // interface InvoiceData {
// //   id: string;
// //   invoiceName: string;
// //   total: number;
// //   status: "PAID" | "PENDING";
// //   date: string;
// //   dueDate: number;
// //   fromName: string;
// //   fromEmail: string;
// //   fromAddress: string;
// //   clientName: string;
// //   clientEmail: string;
// //   clientAddress: string;
// //   currency: string;
// //   invoiceNumber: number;
// //   note?: string;
// //   createdAt: string;
// //   updatedAt: string;
// //   invoiceItems: {
// //     id: number;
// //     description: string;
// //     quantity: number;
// //     rate: number;
// //     amount: number;
// //     invoiceId: string;
// //   }[];
// // }

// // export default function InvoicePage() {
// //   const id = useSearchParams().get("id");
// //   const [invoice, setInvoice] = useState<InvoiceData | null>(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     if (!id) return;

// //     setLoading(true);
// //     fetch(`/api/invoice/${id}`)
// //       .then((response) => response.json())
// //       .then((data) => {
// //         setInvoice(data);
// //         setLoading(false);
// //       })
// //       .catch((error) => {
// //         console.error("Error fetching invoice:", error);
// //         setLoading(false);
// //       });
// //   }, [id]);

// //   const downloadInvoicePdf = async (invoiceId: string) => {
// //     console.log(invoiceId)
// //   };

// //   const itemsArray = Object.values(invoice?.invoiceItems || {});

// //   const formatDate = (date: string | number) => {
// //     const parsedDate = new Date(date);
// //     return format(parsedDate, "dd/MM/yyyy");
// //   };
// //   if (loading) return <div>Loading...</div>;
// //   if (!invoice) return <div>No invoice found</div>;

// //   return (
// //     <div className="w-full h-full mx-auto py-8">
// //       <Card className="w-full">
// //         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
// //           <div className="space-y-1.5">
// //             <CardTitle className="text-2xl">
// //               Invoice #{invoice.invoiceNumber}
// //             </CardTitle>
// //             <p className="text-sm text-muted-foreground">
// //               View invoice details and status
// //             </p>
// //           </div>
// //           <Badge
// //             variant={invoice.status === "PAID" ? "default" : "secondary"}
// //             className="px-4 py-1"
// //           >
// //             {invoice.status}
// //           </Badge>
// //         </CardHeader>
// //         <CardContent className="space-y-6">
// //           <div className="grid grid-cols-2 gap-6">
// //             <div className="space-y-2">
// //               <h3 className="font-semibold">From</h3>
// //               <div className="text-sm">
// //                 <p>{invoice.fromName}</p>
// //                 <p>{invoice.fromEmail}</p>
// //                 <p className="whitespace-pre-line">{invoice.fromAddress}</p>
// //               </div>
// //             </div>
// //             <div className="space-y-2">
// //               <h3 className="font-semibold">To</h3>
// //               <div className="text-sm">
// //                 <p>{invoice.clientName}</p>
// //                 <p>{invoice.clientEmail}</p>
// //                 <p className="whitespace-pre-line">{invoice.clientAddress}</p>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="grid grid-cols-2 gap-6">
// //             <div className="space-y-2">
// //               <h3 className="font-semibold">Date</h3>
// //               <p className="text-sm">{formatDate(invoice.date)}</p>
// //             </div>
// //             <div className="space-y-2">
// //               <h3 className="font-semibold">Due Date</h3>
// //               <p className="text-sm">{invoice.dueDate}</p>
// //             </div>
// //           </div>

// //           <Separator />

// //           <div className="space-y-4">
// //             <h3 className="font-semibold">Items</h3>
// //             <div className="rounded-lg border">
// //               <table className="w-full">
// //                 <thead>
// //                   <tr className="border-b bg-muted/50">
// //                     <th className="p-3 text-left text-sm">Description</th>
// //                     <th className="p-3 text-right text-sm">Quantity</th>
// //                     <th className="p-3 text-right text-sm">Rate</th>
// //                     <th className="p-3 text-right text-sm">Amount</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {itemsArray.map((item, index) => (
// //                     <tr key={index} className="border-b last:border-0">
// //                       <td className="p-3 text-sm">{item.description}</td>
// //                       <td className="p-3 text-right text-sm">
// //                         {item.quantity}
// //                       </td>
// //                       <td className="p-3 text-right text-sm">
// //                         ${item.rate.toFixed(2)}
// //                       </td>
// //                       <td className="p-3 text-right text-sm">
// //                         ${item.amount.toFixed(2)}
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>

// //           <div className="space-y-4">
// //             <div className="flex justify-end">
// //               <div className="w-64 space-y-2">
// //                 <div className="flex justify-between font-semibold">
// //                   <span>Total ({invoice.currency})</span>
// //                   <span>${invoice.total.toFixed(2)}</span>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {invoice.note && (
// //             <div className="space-y-2">
// //               <h3 className="font-semibold">Notes</h3>
// //               <p className="text-sm text-muted-foreground whitespace-pre-line">
// //                 {invoice.note}
// //               </p>
// //             </div>
// //           )}
// //           <Button onClick={() => downloadInvoicePdf(id as string)}>
// //             Download Invoice
// //           </Button>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // }

// "use client";

// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { format } from "date-fns";
// import { Button } from "@/components/ui/button";
// import { PDFDocument } from "pdf-lib"; // Import PDF-lib
// import { rgb } from "pdf-lib";
// import fontkit from "@pdf-lib/fontkit";
// import path from "path";

// interface InvoiceData {
//   invoiceDate: any;
//   id: string;
//   invoiceName: string;
//   total: number;
//   status: "PAID" | "PENDING";
//   date: string;
//   dueDate: number;
//   fromName: string;
//   fromEmail: string;
//   fromAddress: string;
//   clientName: string;
//   clientEmail: string;
//   clientAddress: string;
//   currency: string;
//   invoiceNumber: number;
//   note?: string;
//   createdAt: string;
//   updatedAt: string;
//   invoiceItems: {
//     id: number;
//     description: string;
//     quantity: number;
//     rate: number;
//     amount: number;
//     invoiceId: string;
//   }[];
// }

// export default function InvoicePage() {
//   const id = useSearchParams().get("id");
//   const [invoice, setInvoice] = useState<InvoiceData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;

//     setLoading(true);
//     fetch(`/api/invoice/${id}`)
//       .then((response) => response.json())
//       .then((data) => {
//         setInvoice(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching invoice:", error);
//         setLoading(false);
//       });
//   }, [id]);

//   const saveInvoicePdf = async () => {
//     if (!invoice) return;

//     const pdfDoc = await PDFDocument.create();
//     pdfDoc.registerFontkit(fontkit);

//     // Load fonts
//     const timesRomanFont = await pdfDoc.embedFont("Times-Roman");
//     const helveticaFont = await pdfDoc.embedFont("Helvetica");
//     const helveticaBoldFont = await pdfDoc.embedFont("Helvetica-Bold");

//     // Add a new page
//     const page = pdfDoc.addPage([595.28, 841.89]); // A4 size

//     // Function to load image from public folder
//     const response1 = await fetch("/Invoice-Header.png");
//     const imageArrayBuffer1 = await response1.arrayBuffer();
//     const headerImage = await pdfDoc.embedPng(imageArrayBuffer1);

//     const response2 = await fetch("/Invoice-Logo.png");
//     const imageArrayBuffer2 = await response2.arrayBuffer();
//     const logoImage = await pdfDoc.embedPng(imageArrayBuffer2);

//     const response3 = await fetch("/Invoice-Footer.png");
//     const imageArrayBuffer3 = await response3.arrayBuffer();
//     const footerImage = await pdfDoc.embedPng(imageArrayBuffer3);

//     // Load images
//     // Add header image (left-aligned with left side details)
//     const headerDims = headerImage.scale(0.5);
//     const labelx = 50;
//     page.drawImage(headerImage, {
//       x: labelx,
//       y: page.getHeight() - headerDims.height - 20,
//       width: headerDims.width,
//       height: headerDims.height,
//     });

//     // Add logo (right-aligned)
//     const logoDims = logoImage.scale(0.4);
//     const logoX = page.getWidth() - logoDims.width - 20;
//     const logoY = page.getHeight() - logoDims.height - 20;
//     page.drawImage(logoImage, {
//       x: logoX,
//       y: logoY,
//       width: logoDims.width,
//       height: logoDims.height,
//     });

//     // Invoice title
//     page.drawText("INVOICE", {
//       x: labelx,
//       y: page.getHeight() - headerDims.height - 60,
//       size: 24,
//       font: timesRomanFont,
//       color: rgb(0, 0, 0),
//     });

//     // Invoice details
//     const drawText = (
//       text: string,
//       x: number,
//       y: number,
//       size: number,
//       font: any,
//       color = rgb(0, 0, 0)
//     ) => {
//       page.drawText(text ?? "", { x, y, size, font, color });
//     };

//     const startY = page.getHeight() - headerDims.height - 100;
//     const labelX = 50;
//     const valueX = 120;
//     const companyBlue = rgb(0, 0.2, 0.6);

//     // Left side details with improved alignment
//     drawText("Invoice #", labelX, startY, 10, helveticaBoldFont);
//     drawText(":", valueX - 15, startY, 10, helveticaFont);
//     drawText(
//       invoice.invoiceNumber.toString(),
//       valueX,
//       startY,
//       10,
//       helveticaFont
//     );

//     drawText("Date", labelX, startY - 20, 10, helveticaBoldFont);
//     drawText(":", valueX - 15, startY - 20, 10, helveticaFont);
//     drawText(invoice.invoiceDate, valueX, startY - 20, 10, helveticaFont);

//     drawText("Terms", labelX, startY - 40, 10, helveticaBoldFont);
//     drawText(":", valueX - 15, startY - 40, 10, helveticaFont);
//     drawText("Due on receipt", valueX, startY - 40, 10, helveticaFont);

//     drawText("Due Date", labelX, startY - 60, 10, helveticaBoldFont);
//     drawText(":", valueX - 15, startY - 60, 10, helveticaFont);
//     drawText(
//       invoice.dueDate.toString(),
//       valueX,
//       startY - 60,
//       10,
//       helveticaFont
//     );

//     drawText("PO #", labelX, startY - 80, 10, helveticaBoldFont);
//     drawText(":", valueX - 15, startY - 80, 10, helveticaFont);
//     drawText(
//       invoice.invoiceNumber.toString(),
//       valueX,
//       startY - 80,
//       10,
//       helveticaFont
//     );

//     drawText("Status", labelX, startY - 100, 10, helveticaBoldFont);
//     drawText(":", valueX - 15, startY - 100, 10, helveticaFont);
//     drawText("Open", valueX, startY - 100, 10, helveticaFont);

//     // Right side details
//     const rightColumnX = 350;

//     // From section
//     drawText("From", rightColumnX, startY, 10, helveticaBoldFont);
//     drawText(
//       invoice.fromName,
//       rightColumnX,
//       startY - 20,
//       10,
//       helveticaBoldFont,
//       companyBlue
//     );
//     drawText(invoice.fromEmail, rightColumnX, startY - 35, 10, helveticaFont);
//     drawText(invoice.fromAddress, rightColumnX, startY - 50, 10, helveticaFont);

//     // To section with increased spacing
//     drawText("To", rightColumnX, startY - 80, 10, helveticaBoldFont);
//     drawText(
//       invoice.clientName,
//       rightColumnX,
//       startY - 100,
//       10,
//       helveticaBoldFont,
//       companyBlue
//     );
//     drawText(
//       invoice.clientEmail,
//       rightColumnX,
//       startY - 115,
//       10,
//       helveticaFont
//     );
//     drawText(
//       invoice.clientAddress,
//       rightColumnX,
//       startY - 130,
//       10,
//       helveticaFont
//     );

//     // Table
//     const tableStartY = startY - 180; // Increased margin top
//     const lineHeight = 30;
//     const tableWidth = logoX + logoDims.width - labelX; // Extend table to align with logo
//     const columns = [
//       labelX,
//       labelX + 20,
//       labelX + tableWidth * 0.4,
//       labelX + tableWidth * 0.6,
//       labelX + tableWidth * 0.8,
//     ];

//     // Function to draw horizontal line
//     const drawHorizontalLine = (y: number) => {
//       page.drawLine({
//         start: { x: labelX, y },
//         end: { x: labelX + tableWidth, y },
//         color: rgb(0, 0, 0),
//       });
//     };

//     // Table header (navy blue with white text)
//     page.drawRectangle({
//       x: labelX,
//       y: tableStartY,
//       width: tableWidth,
//       height: lineHeight,
//       color: rgb(0, 0.2, 0.6),
//     });

//     const headerTexts = ["#", "Description", "Quantity", "Unit Price", "Total"];
//     headerTexts.forEach((text, index) => {
//       const textWidth = helveticaBoldFont.widthOfTextAtSize(text, 10);
//       let centerX: number;
//       if (index === 0) {
//         centerX = columns[index] + 10;
//       } else if (index === headerTexts.length - 1) {
//         centerX =
//           columns[index] +
//           (tableWidth - (columns[index] - labelX)) / 2 -
//           textWidth / 2;
//       } else {
//         centerX =
//           columns[index] +
//           (columns[index + 1] - columns[index]) / 2 -
//           textWidth / 2;
//       }
//       drawText(
//         text,
//         centerX,
//         tableStartY + 10,
//         10,
//         helveticaBoldFont,
//         rgb(1, 1, 1)
//       );
//     });

//     // Table content
//     let currentY = tableStartY - lineHeight;

//     // Draw horizontal line after header
//     drawHorizontalLine(tableStartY);

//     // Draw vertical borders
//     const tableEndY = currentY - lineHeight * invoice.invoiceItems.length;
//     columns.forEach((x) => {
//       page.drawLine({
//         start: { x, y: tableStartY },
//         end: { x, y: tableEndY },
//         color: rgb(0, 0, 0),
//       });
//     });

//     // Draw right border
//     page.drawLine({
//       start: { x: labelX + tableWidth, y: tableStartY },
//       end: { x: labelX + tableWidth, y: tableEndY },
//       color: rgb(0, 0, 0),
//     });

//     // Center-align text in table cells
//     const drawCenteredText = (
//       text: string,
//       x: number,
//       width: number,
//       y: number,
//       size: number,
//       font: any
//     ) => {
//       const textWidth = font.widthOfTextAtSize(text, size);
//       const centerX = Math.max(x, x + width / 2 - textWidth / 2);
//       drawText(text, centerX, y, size, font);
//     };

//     // Draw items with padding
//     invoice.invoiceItems.forEach((item, index) => {
//       drawText(
//         (index + 1).toString(),
//         columns[0] + 8,
//         currentY + 10,
//         10,
//         helveticaFont
//       );
//       drawText(
//         item.description,
//         columns[1] + 8,
//         currentY + 10,
//         10,
//         helveticaFont
//       );
//       drawCenteredText(
//         item.quantity.toString(),
//         columns[2],
//         columns[3] - columns[2],
//         currentY + 10,
//         10,
//         helveticaFont
//       );
//       drawCenteredText(
//         item.rate.toFixed(2),
//         columns[3],
//         columns[4] - columns[3],
//         currentY + 10,
//         10,
//         helveticaFont
//       );
//       drawText(
//         `${item.amount.toFixed(2)} ${invoice.currency}`,
//         columns[4] + 8,
//         currentY + 10,
//         10,
//         helveticaFont
//       );

//       currentY -= lineHeight;
//       // Draw horizontal line after each row
//       drawHorizontalLine(currentY + lineHeight);
//     });

//     // Total row with padding
//     drawText("Total", columns[3] + 8, currentY + 10, 10, helveticaBoldFont);
//     drawText(
//       `${invoice.total.toFixed(2)} ${invoice.currency}`,
//       columns[4] + 8,
//       currentY + 10,
//       10,
//       helveticaBoldFont
//     );

//     // Bottom border of the table
//     drawHorizontalLine(currentY);

//     // Add margin after table
//     currentY -= 40; // Reduced margin after table

//     // Bank Details with improved spacing
//     drawText("Bank Details:", labelX, currentY, 10, helveticaBoldFont);
//     currentY -= 20;
//     drawText("- Bank Name: ABCB", labelX, currentY, 10, helveticaFont);
//     currentY -= 15;
//     drawText(
//       "- Account Holder Name: Suite Plus Information Technology",
//       labelX,
//       currentY,
//       10,
//       helveticaFont
//     );
//     currentY -= 15;
//     drawText(
//       "- Account Number: 1553847920001",
//       labelX,
//       currentY,
//       10,
//       helveticaFont
//     );
//     currentY -= 15;
//     drawText(
//       "- IBAN: AE650300011553847920001",
//       labelX,
//       currentY,
//       10,
//       helveticaFont
//     );
//     currentY -= 15;
//     drawText("- Account Type: Current", labelX, currentY, 10, helveticaFont);

//     // Add footer image
//     const footerDims = footerImage.scale(0.5);
//     page.drawImage(footerImage, {
//       x: 0,
//       y: 0,
//       width: page.getWidth(),
//       height: footerDims.height,
//     });

//     // Save the PDF
//     const pdfBytes = await pdfDoc.save();
//     const pdfBase64 = Buffer.from(pdfBytes).toString("base64");

//     // Trigger the download
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(
//       new Blob([pdfBytes], { type: "application/pdf" })
//     );
//     link.download = `Invoice-${invoice.invoiceNumber}.pdf`;
//     link.click();
//   };

//   const formatDate = (date: string | number) => {
//     const parsedDate = new Date(date);
//     return format(parsedDate, "dd/MM/yyyy");
//   };

//   if (loading) return <div>Loading...</div>;
//   if (!invoice) return <div>No invoice found</div>;

//   return (
//     <div className="w-full h-full mx-auto py-8">
//       <Card className="w-full">
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
//           <div className="space-y-1.5">
//             <CardTitle className="text-2xl">
//               Invoice #{invoice.invoiceNumber}
//             </CardTitle>
//             <p className="text-sm text-muted-foreground">
//               View invoice details and status
//             </p>
//           </div>
//           <Badge
//             variant={invoice.status === "PAID" ? "default" : "secondary"}
//             className="px-4 py-1"
//           >
//             {invoice.status}
//           </Badge>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="grid grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <h3 className="font-semibold">From</h3>
//               <div className="text-sm">
//                 <p>{invoice.fromName}</p>
//                 <p>{invoice.fromEmail}</p>
//                 <p className="whitespace-pre-line">{invoice.fromAddress}</p>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <h3 className="font-semibold">To</h3>
//               <div className="text-sm">
//                 <p>{invoice.clientName}</p>
//                 <p>{invoice.clientEmail}</p>
//                 <p className="whitespace-pre-line">{invoice.clientAddress}</p>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <h3 className="font-semibold">Date</h3>
//               <p className="text-sm">{formatDate(invoice.date)}</p>
//             </div>
//             <div className="space-y-2">
//               <h3 className="font-semibold">Due Date</h3>
//               <p className="text-sm">{invoice.dueDate}</p>
//             </div>
//           </div>

//           <Separator />

//           <div className="space-y-4">
//             <h3 className="font-semibold">Items</h3>
//             <div className="rounded-lg border">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b bg-muted/50">
//                     <th className="p-3 text-left text-sm">Description</th>
//                     <th className="p-3 text-right text-sm">Quantity</th>
//                     <th className="p-3 text-right text-sm">Rate</th>
//                     <th className="p-3 text-right text-sm">Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {invoice.invoiceItems.map((item, index) => (
//                     <tr key={index} className="border-b last:border-0">
//                       <td className="p-3 text-sm">{item.description}</td>
//                       <td className="p-3 text-right text-sm">
//                         {item.quantity}
//                       </td>
//                       <td className="p-3 text-right text-sm">
//                         ${item.rate.toFixed(2)}
//                       </td>
//                       <td className="p-3 text-right text-sm">
//                         ${item.amount.toFixed(2)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <div className="flex justify-end">
//               <div className="w-64 space-y-2">
//                 <div className="flex justify-between font-semibold">
//                   <span>Total ({invoice.currency})</span>
//                   <span>${invoice.total.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {invoice.note && (
//             <div className="space-y-2">
//               <h3 className="font-semibold">Notes</h3>
//               <p className="text-sm text-muted-foreground whitespace-pre-line">
//                 {invoice.note}
//               </p>
//             </div>
//           )}
//           <Button onClick={saveInvoicePdf}>Download Invoice</Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// "use client";

// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { format } from "date-fns";
// import { Button } from "@/components/ui/button";

// interface InvoiceData {
//   id: string;
//   invoiceName: string;
//   total: number;
//   status: "PAID" | "PENDING";
//   date: string;
//   dueDate: number;
//   fromName: string;
//   fromEmail: string;
//   fromAddress: string;
//   clientName: string;
//   clientEmail: string;
//   clientAddress: string;
//   currency: string;
//   invoiceNumber: number;
//   note?: string;
//   createdAt: string;
//   updatedAt: string;
//   invoiceItems: {
//     id: number;
//     description: string;
//     quantity: number;
//     rate: number;
//     amount: number;
//     invoiceId: string;
//   }[];
// }

// export default function InvoicePage() {
//   const id = useSearchParams().get("id");
//   const [invoice, setInvoice] = useState<InvoiceData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;

//     setLoading(true);
//     fetch(`/api/invoice/${id}`)
//       .then((response) => response.json())
//       .then((data) => {
//         setInvoice(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching invoice:", error);
//         setLoading(false);
//       });
//   }, [id]);

//   const downloadInvoicePdf = async (invoiceId: string) => {
//     console.log(invoiceId)
//   };

//   const itemsArray = Object.values(invoice?.invoiceItems || {});

//   const formatDate = (date: string | number) => {
//     const parsedDate = new Date(date);
//     return format(parsedDate, "dd/MM/yyyy");
//   };
//   if (loading) return <div>Loading...</div>;
//   if (!invoice) return <div>No invoice found</div>;

//   return (
//     <div className="w-full h-full mx-auto py-8">
//       <Card className="w-full">
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
//           <div className="space-y-1.5">
//             <CardTitle className="text-2xl">
//               Invoice #{invoice.invoiceNumber}
//             </CardTitle>
//             <p className="text-sm text-muted-foreground">
//               View invoice details and status
//             </p>
//           </div>
//           <Badge
//             variant={invoice.status === "PAID" ? "default" : "secondary"}
//             className="px-4 py-1"
//           >
//             {invoice.status}
//           </Badge>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="grid grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <h3 className="font-semibold">From</h3>
//               <div className="text-sm">
//                 <p>{invoice.fromName}</p>
//                 <p>{invoice.fromEmail}</p>
//                 <p className="whitespace-pre-line">{invoice.fromAddress}</p>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <h3 className="font-semibold">To</h3>
//               <div className="text-sm">
//                 <p>{invoice.clientName}</p>
//                 <p>{invoice.clientEmail}</p>
//                 <p className="whitespace-pre-line">{invoice.clientAddress}</p>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <h3 className="font-semibold">Date</h3>
//               <p className="text-sm">{formatDate(invoice.date)}</p>
//             </div>
//             <div className="space-y-2">
//               <h3 className="font-semibold">Due Date</h3>
//               <p className="text-sm">{invoice.dueDate}</p>
//             </div>
//           </div>

//           <Separator />

//           <div className="space-y-4">
//             <h3 className="font-semibold">Items</h3>
//             <div className="rounded-lg border">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b bg-muted/50">
//                     <th className="p-3 text-left text-sm">Description</th>
//                     <th className="p-3 text-right text-sm">Quantity</th>
//                     <th className="p-3 text-right text-sm">Rate</th>
//                     <th className="p-3 text-right text-sm">Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {itemsArray.map((item, index) => (
//                     <tr key={index} className="border-b last:border-0">
//                       <td className="p-3 text-sm">{item.description}</td>
//                       <td className="p-3 text-right text-sm">
//                         {item.quantity}
//                       </td>
//                       <td className="p-3 text-right text-sm">
//                         ${item.rate.toFixed(2)}
//                       </td>
//                       <td className="p-3 text-right text-sm">
//                         ${item.amount.toFixed(2)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <div className="flex justify-end">
//               <div className="w-64 space-y-2">
//                 <div className="flex justify-between font-semibold">
//                   <span>Total ({invoice.currency})</span>
//                   <span>${invoice.total.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {invoice.note && (
//             <div className="space-y-2">
//               <h3 className="font-semibold">Notes</h3>
//               <p className="text-sm text-muted-foreground whitespace-pre-line">
//                 {invoice.note}
//               </p>
//             </div>
//           )}
//           <Button onClick={() => downloadInvoicePdf(id as string)}>
//             Download Invoice
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import fontkit from "@pdf-lib/fontkit";
import path from "path";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
interface InvoiceData {
  invoiceDate: any;
  id: string;
  invoiceName: string;
  total: number;
  status: "PAID" | "PENDING";
  date: string;
  dueDate: number;
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  currency: string;
  invoiceNumber: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
  invoiceItems: {
    id: number;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
    invoiceId: string;
  }[];
}

export default function InvoicePage() {
  const id = useSearchParams().get("id");
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`/api/invoice/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setInvoice(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching invoice:", error);
        setLoading(false);
      });
  }, [id]);


const saveInvoicePdf = async () => {
  if (!invoice) return;

  const doc = new jsPDF("p", "pt", "a4"); // Portrait, Points, A4

  // Load Images
  const loadImage = async (src: string | URL | Request) => {
    const response = await fetch(src);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const headerImg = await loadImage("/Invoice-Header.png") as string;
  const logoImg = await loadImage("/Invoice-Logo.png") as string;
  const footerImg = await loadImage("/Invoice-Footer.png") as string;

  // Add header image (left-aligned)
  doc.addImage(headerImg, "PNG", 50, 20, 200, 50);

  // Add logo (right-aligned)
  doc.addImage(logoImg, "PNG", 400, 20, 100, 50);

  // Invoice title
  doc.setFont("times", "bold");
  doc.setFontSize(24);
  doc.text("INVOICE", 50, 100);

  // Invoice details
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  const details = [
    ["Invoice #", invoice.invoiceNumber.toString()],
    ["Date", invoice.invoiceDate],
    ["Terms", "Due on receipt"],
    ["Due Date", invoice.dueDate.toString()],
    ["PO #", invoice.invoiceNumber.toString()],
    ["Status", "Open"],
  ];

  details.forEach(([label, value], i) => {
    if (!value) value = "N/A"; // Prevents undefined issues
    const y = 120 + i * 20;
    doc.text(label, 50, y);
    doc.setFont("helvetica", "normal");
    doc.text(String(value), 130, y);  // Ensuring value is a string
    doc.setFont("helvetica", "bold");
});

  // Right-side details
  const rightX = 350;
  doc.text("From", rightX, 120);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 51, 153);
  doc.text(invoice.fromName, rightX, 140);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.fromEmail, rightX, 155);
  doc.text(invoice.fromAddress, rightX, 170);

  doc.setFont("helvetica", "bold");
  doc.text("To", rightX, 200);
  doc.setTextColor(0, 51, 153);
  doc.text(invoice.clientName, rightX, 220);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.clientEmail, rightX, 235);
  doc.text(invoice.clientAddress, rightX, 250);

  // Table
  let tableY = 280; // starting Y position of the table
const tableResult = autoTable(doc, {
  startY: tableY,
  head: [["#", "Description", "Quantity", "Unit Price", "Total"]],
  headStyles: { fillColor: [0, 51, 153], textColor: [255, 255, 255] },
  body: invoice.invoiceItems.map((item, index) => {
    tableY += 20; // add 20 to the Y position for each row
    return [
      index + 1,
      item.description,
      item.quantity,
      item.rate.toFixed(2),
      `${item.amount.toFixed(2)} ${invoice.currency}`,
    ];
  }),
  theme: "grid",
  styles: { fontSize: 10 },
});

// Total row
const finalY = tableY + 10;
doc.setFont("helvetica", "bold");
doc.text("Total", 400, finalY);
doc.text(`${invoice.total.toFixed(2)} ${invoice.currency}`, 480, finalY);

  // Bank details
  doc.text("Bank Details:", 50, finalY + 40);
  doc.setFont("helvetica", "normal");
  const bankDetails = [
    "Bank Name: ABCB",
    "Account Holder Name: Suite Plus Information Technology",
    "Account Number: 1553847920001",
    "IBAN: AE650300011553847920001",
    "Account Type: Current",
  ];

  bankDetails.forEach((text, i) => doc.text(`- ${text}`, 50, finalY + 60 + i * 15));

  // Add footer image
  doc.addImage(footerImg, "PNG", 0, 750, 595, 50);

  // Save & Download PDF
  doc.save(`Invoice-${invoice.invoiceNumber}.pdf`);
};

  const formatDate = (date: string | number) => {
    const parsedDate = new Date(date);
    return format(parsedDate, "dd/MM/yyyy");
  };

  if (loading) return <div>Loading...</div>;
  if (!invoice) return <div>No invoice found</div>;

  return (
    <div className="w-full h-full mx-auto py-8">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div className="space-y-1.5">
            <CardTitle className="text-2xl">
              Invoice #{invoice.invoiceNumber}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              View invoice details and status!
            </p>
          </div>
          <Badge
            variant={invoice.status === "PAID" ? "default" : "secondary"}
            className="px-4 py-1"
          >
            {invoice.status}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold">From</h3>
              <div className="text-sm">
                <p>{invoice.fromName}</p>
                <p>{invoice.fromEmail}</p>
                <p className="whitespace-pre-line">{invoice.fromAddress}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">To</h3>
              <div className="text-sm">
                <p>{invoice.clientName}</p>
                <p>{invoice.clientEmail}</p>
                <p className="whitespace-pre-line">{invoice.clientAddress}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Date</h3>
              <p className="text-sm">{formatDate(invoice.date)}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Due Date</h3>
              <p className="text-sm">{invoice.dueDate}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Items</h3>
            <div className="rounded-lg border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left text-sm">Description</th>
                    <th className="p-3 text-right text-sm">Quantity</th>
                    <th className="p-3 text-right text-sm">Rate</th>
                    <th className="p-3 text-right text-sm">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.invoiceItems.map((item, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="p-3 text-sm">{item.description}</td>
                      <td className="p-3 text-right text-sm">
                        {item.quantity}
                      </td>
                      <td className="p-3 text-right text-sm">
                        ${item.rate.toFixed(2)}
                      </td>
                      <td className="p-3 text-right text-sm">
                        ${item.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Total ({invoice.currency})</span>
                  <span>${invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {invoice.note && (
            <div className="space-y-2">
              <h3 className="font-semibold">Notes</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {invoice.note}
              </p>
            </div>
          )}
          <Button onClick={saveInvoicePdf}>Download Invoice</Button>
        </CardContent>
      </Card>
    </div>
  );
}
