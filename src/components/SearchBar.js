"use client"
import { FiSearch, FiMic } from "react-icons/fi"

function SearchBar({ placeholder = "Search...", onChange }) {
  return (
    <div className="relative w-full max-w-md mx-auto my-4">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <FiSearch className="text-gray-400" />
      </div>
      <input
        className="input pl-10 pr-10 py-2 rounded-full shadow-md"
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <div className="absolute inset-y-0 right-3 flex items-center">
        <FiMic className="text-primary" />
      </div>
    </div>
  )
}

export default SearchBar

