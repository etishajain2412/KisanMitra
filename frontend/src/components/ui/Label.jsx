// src/components/ui/Label.jsx
const Label = ({ htmlFor, children }) => {
    return (
      <label htmlFor={htmlFor} className="block text-green-800 font-medium mb-1">
        {children}
      </label>
    );
  };
  
  export default Label;
  