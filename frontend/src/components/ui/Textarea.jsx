// src/components/ui/Textarea.jsx
const Textarea = ({ id, name, value, onChange, placeholder, ...props }) => {
    return (
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
        {...props}
      />
    );
  };
  
  export default Textarea;
  