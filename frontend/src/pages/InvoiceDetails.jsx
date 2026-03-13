import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function InvoiceDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);

  const fetchInvoice = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/invoices/${id}`);
      setInvoice(res.data);
    } catch (error) {
      console.error("Error fetching invoice:", error);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  const downloadInvoice = async () => {
    try {

      const response = await axios.get(
        `http://127.0.0.1:8000/invoices/${id}/pdf`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute(
        "download",
        `Invoice_${invoice.invoice_number}.pdf`
      );

      document.body.appendChild(link);
      link.click();

    } catch (error) {
      console.error("Error downloading invoice:", error);
    }
  };

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 hover:shadow-2xl transition">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold text-gray-800">
            Invoice Details
          </h2>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            ← Back
          </button>

        </div>

        {/* Invoice Info */}
        <div className="grid grid-cols-3 gap-4 mb-6">

          <div className="bg-gray-100 p-4 rounded-lg border hover:bg-gray-200 transition">
            <p className="text-sm text-gray-500">Invoice Number</p>
            <p className="text-lg font-semibold text-gray-800">
              {invoice.invoice_number}
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg border hover:bg-gray-200 transition">
            <p className="text-sm text-gray-500">Vendor</p>
            <p className="text-lg font-semibold text-gray-800">
            {invoice.vendor_name}
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg border hover:bg-gray-200 transition">
            <p className="text-sm text-gray-500">Vendor Email</p>
            <p className="text-lg font-semibold text-gray-800">
            {invoice.vendor_email}
            </p>
          </div>

        </div>

        {/* Items Table */}
        <h3 className="text-lg font-semibold mb-3">Items</h3>

        <table className="w-full border border-gray-200">

          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Part</th>
              <th className="p-2 text-left">Brand</th>
              <th className="p-2 text-left">Qty</th>
              <th className="p-2 text-left">Unit Price</th>
              <th className="p-2 text-left">Total</th>
            </tr>
          </thead>

          <tbody>

            {invoice.items.map((item, index) => (
              <tr key={invoice.id} className="hover:bg-gray-100 transition-colors duration-200 border-t">

                <td className="p-2">{item.part_name}</td>
                <td className="p-2">{item.brand}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">₹ {Number(item.unit_price).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                <td className="p-2">₹ {Number(item.total).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>

              </tr>
            ))}

          </tbody>

        </table>

        {/* Totals */}
        <div className="mt-6 text-right space-y-1">

          <p>
            <strong>Subtotal:</strong> ₹ {Number(invoice.subtotal).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </p>

          <p>
            <strong>GST:</strong> ₹ {Number(invoice.gst).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </p>

          <p className="text-lg font-bold">
            Grand Total: ₹ {Number(invoice.grand_total).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </p>

        </div>

        {/* Download Button */}
        <button
          onClick={downloadInvoice}
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          Download Invoice PDF
        </button>

      </div>

    </div>
  );
}

export default InvoiceDetails;