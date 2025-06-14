// import { Input } from "postcss" // This import seems incorrect for a React component, removing it.

function MyInput({ type, id, name, placeholder, value, onChange, required, min, step, className }) {
  return (
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      min={min}
      step={step}
      className={`w-full p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ''}`}
    />
  );
}
export default MyInput;