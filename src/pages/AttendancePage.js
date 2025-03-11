import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getStudentsByBatch, updateStudentAttendance, getBatches, addStudent, deleteStudent } from "../lib/data";

function AttendancePage() {
  const [students, setStudents] = useState([]);
  const [batch, setBatch] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDate] = useState(new Date().toISOString().split("T")[0]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { cityId, batchId } = useParams();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const batches = getBatches();
        const currentBatch = batches.find((b) => b.id === batchId);
        if (!currentBatch) {
          navigate(`/cities/${cityId}/batches`);
          return;
        }
        setBatch(currentBatch);
        const loadedStudents = getStudentsByBatch(batchId);
        setStudents(loadedStudents);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    
    fetchData();
  }, [batchId, cityId, navigate]);

  const handleSearch = (query) => {
    setSearchQuery(query.trim());
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAttendance = (studentId) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          const isPresent = !student.attendance?.[currentDate];
          updateStudentAttendance(studentId, currentDate, isPresent);
          return {
            ...student,
            attendance: {
              ...student.attendance,
              [currentDate]: isPresent,
            },
          };
        }
        return student;
      })
    );
  };

  const handleAddStudent = () => {
    if (newStudentName.trim() === "") return;
    const newStudent = addStudent(newStudentName, batchId);
    setStudents([...students, newStudent]);
    setNewStudentName("");
    setShowAddForm(false);
  };

  const handleDeleteStudent = (studentId) => {
    deleteStudent(studentId);
    setStudents(students.filter(student => student.id !== studentId));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5edd7" }}>
      <div className="container max-w-md mx-auto p-4">
        {/* Logo and Title */}
        <div className="text-center mb-2">
          <div className="flex justify-center items-center">
            <img 
              src="/mahayogam-logo.png" 
              alt="Mahayogam Logo" 
              className="h-16" 
              style={{ marginRight: "8px" }}
            />
            <div style={{ color: "#8B4513" }}>
              <h1 className="text-3xl font-bold">MAHAYOGAM</h1>
              <p className="text-xs">A Traditional Spiritual Experience</p>
            </div>
          </div>
        </div>

        {/* Attendance Title */}
        <div className="text-center my-6">
          <h2 className="text-4xl font-bold" style={{ letterSpacing: "1px" }}>ATTENDANCE</h2>
          <h3 className="text-3xl font-bold mt-2" style={{ letterSpacing: "1px" }}>BATCH 1</h3>
        </div>

        {/* Search Bar - Adjusted size */}
        <div className="search-container mb-6 mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full py-2 px-10 rounded-full border-0 shadow-md text-sm"
              style={{ height: "42px" }}
            />
            <span className="absolute left-3 top-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="750" height="1" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>1
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mb-4 mt-2">
          <button 
            onClick={() => setShowAddForm(true)}
            className="p-2 rounded-full bg-green-500 text-white shadow-md"
            style={{ width: "36px", height: "36px" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
              <line x1="12" y1="5" x2="12" y2="19" stroke="green"></line>
              <line x1="5" y1="12" x2="19" y2="12" stroke="green"></line>
            </svg>
          </button>
          
          <button 
            className="p-2 rounded-full bg-white shadow-md"
            style={{ width: "36px", height: "36px" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="9" x2="20" y2="9"></line>
              <line x1="4" y1="15" x2="20" y2="15"></line>
              <line x1="10" y1="3" x2="8" y2="21"></line>
              <line x1="16" y1="3" x2="14" y2="21"></line>
            </svg>
          </button>
          
          <button 
            className="p-2 rounded-full bg-red-500 text-white shadow-md"
            style={{ width: "36px", height: "36px" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Updated Add Form with improved styling */}
        {showAddForm && (
          <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Add New Student</h3>
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Enter student name"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="w-full p-2 pl-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {newStudentName && (
                <button 
                  onClick={() => setNewStudentName("")}
                  className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setShowAddForm(false)} 
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddStudent} 
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                disabled={!newStudentName.trim()}
              >
                Add Student
              </button>
            </div>
          </div>
        )}

        {/* Student List */}
        <div 
          className="attendance-list rounded-lg overflow-hidden shadow-lg" 
          style={{ backgroundColor: "#993333" }}
        >
          {filteredStudents.map((student, index) => (
            <div 
              key={student.id} 
              className="student-row flex justify-between items-center py-3 px-4 m-2"
              style={{ 
                borderBottom: index < filteredStudents.length - 1 ? "1px solid rgba(255, 255, 255, 0.2)" : "none"
              }}
            >
              <Link 
                to={`/cities/${cityId}/batches/${batchId}/students/${student.id}`} 
                className="text-2xl font-light text-white cursor-pointer"
              >
                {student.name}
              </Link>
              <div className="flex space-x-2">
                {/* Toggle button that shows check or X */}
                <button
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{ 
                    backgroundColor: student.attendance?.[currentDate] ? "#4CAF50" : "#FF5252",
                  }}
                  onClick={() => toggleAttendance(student.id)}
                >
                  {student.attendance?.[currentDate] ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  )}
                </button>
                <button
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500"
                  onClick={() => handleDeleteStudent(student.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AttendancePage;