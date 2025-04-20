import { Clock, Truck, CheckCircle, Package } from "lucide-react";

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return { 
          icon: Clock,
          className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        };
      case 'shipped':
        return { 
          icon: Truck,
          className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
        };
      case 'delivered':
        return { 
          icon: CheckCircle,
          className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        };
      case 'cancelled':
        return { 
          icon: Package,
          className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        };
      default:
        return { 
          icon: Package,
          className: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
        };
    }
  };

  const { icon: Icon, className } = getStatusConfig(status);

  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 ${className}`}>
      <Icon className="h-3.5 w-3.5" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
