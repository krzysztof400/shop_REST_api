import { Input } from "postcss"

function MyInput({ type, id, placeholder }) {
  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      className="w-full p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
export default MyInput;