import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function InvoiceList() {
  const [invoices, setInvoices] = useState([]);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/invoices");
      setInvoices(res.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const deleteInvoice = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/invoices/${id}`);
      fetchInvoices();
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const downloadInvoice = async (id, invoiceNumber) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/invoices/${id}/pdf`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice_${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Invoice List
          </h2>

          <Link
            to="/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create New Invoice
          </Link>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full border border-gray-200 rounded-lg">

            <thead className="bg-gray-200">
              <tr className="text-left">
                <th className="p-3">Invoice No</th>
                <th className="p-3">Vendor</th>
                <th className="p-3">Email</th>
                <th className="p-3">Grand Total (₹)</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {invoices.map((invoice) => (
              <tr 
                key={invoice.id} 
                className="border-t hover:bg-gray-100 cursor-pointer transition-colors duration-200"
              >
              <td className="p-3">{invoice.invoice_number}</td>
              <td className="p-3">{invoice.vendor_name}</td>
              <td className="p-3">{invoice.vendor_email}</td>
              <td className="p-3 font-medium">
              ₹ {Number(invoice.grand_total).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </td>

              <td className="p-3 flex gap-2">
                <Link
                to={`/invoice/${invoice.id}`}
                className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
                >
                View
                </Link>

                <button
                onClick={() => downloadInvoice(invoice.id, invoice.invoice_number)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                >
                Download
                </button>

                <button
                onClick={() => deleteInvoice(invoice.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                Delete
                </button>
              </td>
              </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default InvoiceList;

