// src/components/ui/Input.jsx
const Input = ({ id, name, type = "text", value, onChange, placeholder, ...props }) => {
    return (
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        {...props}
      />
    );
  };
  
export default Input;
  