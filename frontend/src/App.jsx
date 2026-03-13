import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateInvoice from "./pages/CreateInvoice";
import InvoiceList from "./pages/InvoiceList";
import InvoiceDetail from "./pages/InvoiceDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InvoiceList />} />
        <Route path="/create" element={<CreateInvoice />} />
        <Route path="/invoice/:id" element={<InvoiceDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;