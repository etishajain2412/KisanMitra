import { useNavigate } from "react-router-dom";
import { Package, BarChart, ShoppingCart, ListFilter, PlusCircle, Truck } from "lucide-react";
import { cn } from "../lib/utils";

const NavigationBar = ({ activeView, setActiveView }) => {
  const navigate = useNavigate();

  const navItems = [
    { id: "addProduct", label: "Add Product", icon: PlusCircle, color: "bg-green-600 hover:bg-green-700" },
    { id: "viewProducts", label: "View Products", icon: Package, color: "bg-emerald-50 text-green-800 hover:bg-emerald-100" },
    { id: "categories", label: "Categories", icon: ListFilter, color: "bg-emerald-50 text-green-800 hover:bg-emerald-100" },
    { id: "orders", label: "Orders", icon: ShoppingCart, color: "bg-emerald-50 text-green-800 hover:bg-emerald-100" },
    { id: "analytics", label: "Analytics", icon: BarChart, color: "bg-emerald-50 text-green-800 hover:bg-emerald-100" },
    { id: "shipping", label: "Shipping", icon: Truck, color: "bg-emerald-50 text-green-800 hover:bg-emerald-100" },
  ];

  const handleNavigation = (id) => {
    setActiveView(id);
    navigate(`/${id}`); // Ensure routes are defined in your app
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-6">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavigation(item.id)}
          className={cn(
            "flex items-center gap-2 px-5 py-3 rounded-md transition-colors text-white shadow-sm",
            activeView === item.id ? "bg-green-600 hover:bg-green-700" : item.color
          )}
        >
          <item.icon size={20} className={activeView === item.id ? "text-white" : ""} />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default NavigationBar;
