import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Common Toast Function
export const showToast = (message, type = "default") => {
  const toastConfig = {
    position: "top-right", // Position: top-right, top-left, bottom-right, etc.
    autoClose: 3000, // Closes after 3 seconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored", // Light, dark, colored
  };

  switch (type) {
    case "success":
      toast.success(`${message}`, toastConfig);
      break;
    case "error":
      toast.error(`${message}`, toastConfig);
      break;
    case "warning":
      toast.warn(`${message}`, toastConfig);
      break;
    case "info":
      toast.info(`${message}`, toastConfig);
      break;
    default:
      toast(message, toastConfig);
  }
};
