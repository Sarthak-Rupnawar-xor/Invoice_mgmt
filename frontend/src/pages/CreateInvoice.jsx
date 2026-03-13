import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateInvoice() {

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");

  const [items, setItems] = useState([
    { part_name: "", brand: "", quantity: 1, unit_price: 0, total: 0 }
  ]);

  const navigate = useNavigate();

  const addItem = () => {
    setItems([
      ...items,
      { part_name: "", brand: "", quantity: 1, unit_price: 0, total: 0 }
    ]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];

    updatedItems[index][field] = value;

    if (field === "quantity" || field === "unit_price") {
      const quantity = Number(updatedItems[index].quantity);
      const price = Number(updatedItems[index].unit_price);

      updatedItems[index].total = quantity * price;
    }

    setItems(updatedItems);
  };

  const subtotal = items.reduce((sum, item) => sum + Number(item.total), 0);
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  const handleSubmit = async () => {
    try {

      const formattedItems = items.map((item) => ({
        part_name: item.part_name,
        brand: item.brand,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        total: Number(item.total)
      }));

      const invoiceData = {
        invoice_number: invoiceNumber,
        vendor_name: vendorName,
        vendor_email: vendorEmail,
        items: formattedItems,
        subtotal: Number(subtotal),
        gst: Number(gst),
        grand_total: Number(grandTotal)
      };

      await axios.post(
        "http://127.0.0.1:8000/invoices",
        invoiceData
      );

      alert("Invoice Saved Successfully ✅");

      navigate("/");

    } catch (error) {
      console.error(error);
      alert("Error saving invoice ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8 hover:shadow-2xl transition">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold text-gray-800">
          Create Invoice
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

          <input
            placeholder="Invoice Number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            placeholder="Vendor Name"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            placeholder="Vendor Email"
            value={vendorEmail}
            onChange={(e) => setVendorEmail(e.target.value)}
            className="border p-2 rounded"
          />

        </div>

        {/* Items Table */}
        <h3 className="text-lg font-semibold mb-3">Items</h3>

        <div className="overflow-x-auto">

          <table className="w-full border border-gray-200">

            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-left">Part Name</th>
                <th className="p-2 text-left">Brand</th>
                <th className="p-2 text-left">Quantity</th>
                <th className="p-2 text-left">Unit Price (₹)</th>
                <th className="p-2 text-left">Total</th>
              </tr>
            </thead>

            <tbody>

              {items.map((item, index) => (
                <tr key={index} className="border-t">

                  <td className="p-2">
                    <input
                      value={item.part_name}
                      onChange={(e) =>
                        handleItemChange(index, "part_name", e.target.value)
                      }
                      className="border p-1 rounded w-full"
                    />
                  </td>

                  <td className="p-2">
                    <input
                      value={item.brand}
                      onChange={(e) =>
                        handleItemChange(index, "brand", e.target.value)
                      }
                      className="border p-1 rounded w-full"
                    />
                  </td>

                  <td className="p-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", Number(e.target.value))
                      }
                      className="border p-1 rounded w-full"
                    />
                  </td>

                  <td className="p-2">
                    <input
                      type="number"
                      value={item.unit_price}
                      onChange={(e) =>
                        handleItemChange(index, "unit_price", Number(e.target.value))
                      }
                      className="border p-1 rounded w-full"
                    />
                  </td>

                  <td className="p-2">
                    ₹ {Number(item.total).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

        <button
          onClick={addItem}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Item
        </button>

        {/* Totals */}
        <div className="mt-6 text-right space-y-1">
          <p><strong>Subtotal:</strong> ₹ {Number(subtotal).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>
          <p><strong>GST (18%):</strong> ₹ {Number(gst).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>
          <p className="text-lg font-bold">
            Grand Total: ₹ {Number(grandTotal).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          Save Invoice
        </button>

      </div>

    </div>
  );
}

export default CreateInvoice;