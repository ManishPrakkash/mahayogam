import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FiCheck, FiPlus, FiSliders, FiX } from "react-icons/fi"
import Logo from "../components/Logo"
import SearchBar from "../components/SearchBar"
import { useAuth } from "../context/AuthContext"
import { getStudentsByBatch, updateStudentAttendance, getBatches, addStudent } from "../lib/data"

function AttendancePage() {
  const [students, setStudents] = useState([])
  const [batch, setBatch] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentDate] = useState(new Date().toISOString().split("T")[0])
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const { cityId, batchId } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newStudentName, setNewStudentName] = useState("")

  useEffect(() => {
    const batches = getBatches()
    const currentBatch = batches.find((b) => b.id === batchId)
    if (!currentBatch) {
      navigate(`/cities/${cityId}/batches`)
      return
    }
    setBatch(currentBatch)
    const loadedStudents = getStudentsByBatch(batchId)
    setStudents(loadedStudents)
  }, [batchId, cityId, navigate])

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  )

  const markAttendance = (studentId, isPresent) => {
    updateStudentAttendance(studentId, currentDate, isPresent)
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          return {
            ...student,
            attendance: {
              ...student.attendance,
              [currentDate]: isPresent,
            },
          }
        }
        return student
      })
    )
  }

  const navigateToStudentProfile = (studentId) => {
    navigate(`/cities/${cityId}/batches/${batchId}/students/${studentId}`)
  }

  const handleAddStudent = () => {
    if (newStudentName.trim() === "") return
    const newStudent = addStudent(batchId, newStudentName)
    setStudents([...students, newStudent])
    setIsModalOpen(false)
    setNewStudentName("")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-md mx-auto p-4">
        <Logo />

        <div className="text-center mt-4 mb-2">
          <h1 className="text-4xl font-bold">ATTENDANCE</h1>
          <h2 className="text-3xl font-bold mt-2">{batch?.name}</h2>
        </div>

        <SearchBar placeholder="Search students..." onChange={handleSearch} />

        <div className="flex justify-end mt-4 space-x-2">
          <button
            className="bg-success text-white rounded-full w-8 h-8 flex items-center justify-center"
            onClick={() => setIsModalOpen(true)}
          >
            <FiPlus size={20} />
          </button>
          <button className="text-secondary rounded-full w-8 h-8 flex items-center justify-center">
            <FiSliders size={20} />
          </button>
          <button className="bg-error text-white rounded-full w-8 h-8 flex items-center justify-center">
            <FiX size={20} />
          </button>
        </div>

        <div className="mt-4 attendance-list">
          {filteredStudents.map((student) => (
            <div key={student.id} className="attendance-item">
              <div className="text-2xl font-light cursor-pointer" onClick={() => navigateToStudentProfile(student.id)}>
                {student.name}
              </div>
              <div className="flex">
                <button
                  className={`status-button present ${student.attendance?.[currentDate] === true ? "opacity-100" : "opacity-50"}`}
                  onClick={() => markAttendance(student.id, true)}
                >
                  <FiCheck size={24} />
                </button>
                <button
                  className={`status-button absent ${student.attendance?.[currentDate] === false ? "opacity-100" : "opacity-50"}`}
                  onClick={() => markAttendance(student.id, false)}
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

     
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-2xl font-bold mb-4">Add New Student</h2>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              placeholder="Enter student name"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-success text-white px-4 py-2 rounded-md"
                onClick={handleAddStudent}
              >
                Add
              </button>
              <button
                className="bg-error text-white px-4 py-2 rounded-md"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AttendancePage
