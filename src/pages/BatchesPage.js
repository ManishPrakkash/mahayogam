import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FiPlus, FiTrash2 } from "react-icons/fi"
import Logo from "../components/Logo"
import { useAuth } from "../context/AuthContext"
import { getBatchesByCity, addBatch, deleteBatch, getCities } from "../lib/data"

function BatchesPage() {
  const [batches, setBatches] = useState([])
  const [filteredBatches, setFilteredBatches] = useState([])
  const [city, setCity] = useState(null)
  const [newBatchName, setNewBatchName] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const { cityId } = useParams()

  useEffect(() => {
    const cities = getCities()
    const currentCity = cities.find((c) => c.id === cityId)
    if (!currentCity) {
      navigate("/cities")
      return
    }
    setCity(currentCity)
    const loadedBatches = getBatchesByCity(cityId)
    setBatches(loadedBatches)
    setFilteredBatches(loadedBatches)
  }, [cityId, navigate])

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredBatches(batches)
    } else {
      const filtered = batches.filter((batch) => batch.name.toLowerCase().includes(query.toLowerCase()))
      setFilteredBatches(filtered)
    }
  }

  const handleAddBatch = () => {
    if (newBatchName.trim()) {
      const newBatch = addBatch(newBatchName.trim(), cityId)
      setBatches((prev) => [...prev, newBatch])
      setFilteredBatches((prev) => [...prev, newBatch])
      setNewBatchName("")
      setShowAddForm(false)
    }
  }

  const handleDeleteBatch = (id) => {
    deleteBatch(id)
    const updatedBatches = batches.filter((batch) => batch.id !== id)
    setBatches(updatedBatches)
    setFilteredBatches(updatedBatches.filter((batch) => batch.name.toLowerCase().includes(searchQuery.toLowerCase())))
  }

  const navigateToAttendance = (batchId) => {
    navigate(`/cities/${cityId}/batches/${batchId}/attendance`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-md mx-auto p-4">
        <Logo />
        <div className="mt-8 space-y-4">
          {filteredBatches.map((batch) => (
            <div
              key={batch.id}
              className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center cursor-pointer"
              onClick={() => navigateToAttendance(batch.id)}
            >
              <span className="text-xl font-medium">{batch.name}</span>
              <button
                className="text-red-500"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteBatch(batch.id)
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
              placeholder="Enter batch name"
              value={newBatchName}
              onChange={(e) => setNewBatchName(e.target.value)}
              className="input mb-2"
            />
            <div className="flex space-x-2">
              <button onClick={handleAddBatch} className="btn btn-primary flex-1">
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
export default BatchesPage
