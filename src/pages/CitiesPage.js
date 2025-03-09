"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FiPlus, FiTrash2 } from "react-icons/fi"
import Logo from "../components/Logo"
import SearchBar from "../components/SearchBar"
// import MobileStatusBar from "../components/MobileStatusBar"
import { useAuth } from "../context/AuthContext"
import { getCities, addCity, deleteCity, initializeSampleData } from "../lib/data"

function CitiesPage() {
  const [cities, setCities] = useState([])
  const [filteredCities, setFilteredCities] = useState([])
  const [newCityName, setNewCityName] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Initialize sample data if needed
    initializeSampleData()

    // Load cities
    const loadedCities = getCities()
    setCities(loadedCities)
    setFilteredCities(loadedCities)
  }, [])

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredCities(cities)
    } else {
      const filtered = cities.filter((city) => city.name.toLowerCase().includes(query.toLowerCase()))
      setFilteredCities(filtered)
    }
  }

  const handleAddCity = () => {
    if (newCityName.trim()) {
      const newCity = addCity(newCityName.trim())
      setCities((prev) => [...prev, newCity])
      setFilteredCities((prev) => [...prev, newCity])
      setNewCityName("")
      setShowAddForm(false)
    }
  }

  const handleDeleteCity = (id) => {
    deleteCity(id)
    const updatedCities = cities.filter((city) => city.id !== id)
    setCities(updatedCities)
    setFilteredCities(updatedCities.filter((city) => city.name.toLowerCase().includes(searchQuery.toLowerCase())))
  }

  const navigateToBatches = (cityId) => {
    navigate(`/cities/${cityId}/batches`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <MobileStatusBar /> */}

      <div className="container max-w-md mx-auto p-4">
        <Logo />

        <SearchBar placeholder="Search cities..." onChange={handleSearch} />

        <div className="mt-8 space-y-4">
          {filteredCities.map((city) => (
            <div
              key={city.id}
              className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center cursor-pointer"
              onClick={() => navigateToBatches(city.id)}
            >
              <span className="text-xl font-medium">{city.name}</span>
              <button
                className="text-red-500"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteCity(city.id)
                }}
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {showAddForm ? (
          <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
            <input
              placeholder="Enter city name"
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
              className="input mb-2"
            />
            <div className="flex space-x-2">
              <button onClick={handleAddCity} className="btn btn-primary flex-1">
                Add
              </button>
              <button onClick={() => setShowAddForm(false)} className="btn btn-outline flex-1">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            className="btn btn-primary w-full mt-6 rounded-xl py-6 flex items-center justify-center"
            onClick={() => setShowAddForm(true)}
          >
            <FiPlus className="mr-2" size={24} />
            Add New
          </button>
        )}
      </div>
    </div>
  )
}

export default CitiesPage

