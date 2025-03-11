import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiCheck, FiPlus, FiSliders, FiX, FiTrash2, FiEye } from "react-icons/fi";
import Logo from "../components/Logo";
import SearchBar from "../components/SearchBar";
import { useAuth } from "../context/AuthContext";
import { getStudentsByBatch, updateStudentAttendance, getBatches, addStudent, deleteStudent } from "../lib/data";

function AttendancePage() {
  const [students, setStudents] = useState([]);
  const [batch, setBatch] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDate] = useState(new Date().toISOString().split("T")[0]);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { cityId, batchId } = useParams();
  const [newStudentName, setNewStudentName] = useState("");

  useEffect(() => {
    const batches = getBatches();
    const currentBatch = batches.find((b) => b.id === batchId);
    if (!currentBatch) {
      navigate(`/cities/${cityId}/batches`);
      return;
    }
    setBatch(currentBatch);
    const loadedStudents = getStudentsByBatch(batchId);
    setStudents(loadedStudents);
  }, [batchId, cityId, navigate]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
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

  const navigateToStudentProfile = (studentId) => {
    navigate(`/cities/${cityId}/batches/${batchId}/students/${studentId}`);
  };

  const handleAddStudent = () => {
    if (newStudentName.trim() === "") return;
    const newStudent = addStudent(newStudentName, batchId);
    setStudents([...students, newStudent]);
    setNewStudentName("");
  };

  const handleDeleteStudent = (studentId) => {
    deleteStudent(studentId);
    setStudents(students.filter(student => student.id !== studentId));
  };

  return (
    <div className="min-h-screen bg-background" style={{ backgroundColor: "#FFF9C4" }}>
      <div className="container max-w-md mx-auto p-4">
        <Logo />

        <div className="text-center mt-4 mb-2">
          <h1 className="text-4xl font-bold">ATTENDANCE</h1>
          <h2 className="text-3xl font-bold mt-2">{batch?.name}</h2>
        </div>

        <SearchBar placeholder="Search students..." onChange={(e) => handleSearch(e.target.value)} />

        <div className="mt-4 attendance-list">
          <div className="attendance-item mb-3 flex flex-col items-center">
            <input
              type="text"
              placeholder="Enter student name"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              className="input w-full rounded-xl mb-2 p-2 border border-gray-300"
            />
            <button onClick={handleAddStudent} className="btn btn-primary w-full rounded-xl py-2 flex items-center justify-center bg-green-500 text-white">
              <FiPlus size={20} className="mr-2" />
              Add
            </button>
          </div>

          {filteredStudents.map((student) => (
            <div 
              key={student.id} 
              className="attendance-item mb-3"
              style={{ 
                backgroundColor: "#ffffff", 
                padding: "10px", 
                borderRadius: "8px",
                color: "black",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div 
                className="text-2xl font-light cursor-pointer" 
                onClick={() => navigateToStudentProfile(student.id)}
              >
                {student.name}
              </div>
              <div className="flex">
                <button
                  className={`status-button mr-2`}
                  style={{ 
                    opacity: student.attendance?.[currentDate] ? 1 : 0.5,
                    backgroundColor: "white",
                    color: student.attendance?.[currentDate] ? "green" : "red",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  onClick={() => toggleAttendance(student.id)}
                >
                  {student.attendance?.[currentDate] ? <FiCheck size={24} /> : <FiX size={24} />}
                </button>
                <button
                  className="status-button text-red-500"
                  style={{ 
                    backgroundColor: "white",
                    color: "#2196F3",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  onClick={() => handleDeleteStudent(student.id)}
                >
                  <FiTrash2 size={24} />
                </button>
                <button
                  className="status-button view"
                  style={{ 
                    backgroundColor: "white",
                    color: "#2196F3",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  onClick={() => navigateToStudentProfile(student.id)}
                >
                  <FiEye size={24} />
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
