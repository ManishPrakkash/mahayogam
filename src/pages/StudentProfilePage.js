import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getStudent, updateStudentFee } from "../lib/data";

function StudentProfilePage() {
  const [student, setStudent] = useState(null);
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cityId, batchId, studentId } = useParams();
  
  // All months of the year
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // const currentMonthIndex = new Date().getMonth();
  
  // Display all months from January to December
  const displayMonths = months;
  
  useEffect(() => {
    const loadedStudent = getStudent(studentId);
    if (!loadedStudent) {
      navigate(`/cities/${cityId}/batches/${batchId}/attendance`);
      return;
    }
    setStudent(loadedStudent);
  }, [studentId, cityId, batchId, navigate]);

  const toggleFeeStatus = (month) => {
    if (!student) return;

    const currentStatus = student.fees[month] || false;
    updateStudentFee(studentId, month, !currentStatus);

    setStudent((prev) => ({
      ...prev,
      fees: {
        ...prev.fees,
        [month]: !currentStatus,
      },
    }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudent((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
        try {
          // Update local storage
          const students = JSON.parse(localStorage.getItem("mahayogam-students")) || [];
          const updatedStudents = students.map((s) => (s.id === studentId ? { ...s, profileImage: reader.result } : s));
          localStorage.setItem("mahayogam-students", JSON.stringify(updatedStudents));
        } catch (error) {
          if (error.name === 'QuotaExceededError') {
            console.error("Local storage quota exceeded. Unable to save profile image.");
          } else {
            console.error("Error saving profile image to local storage:", error);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5edd7" }}>
      <div className="container max-w-md mx-auto p-4">
        {/* Logo section */}
        <div className="flex items-center">
          <img 
            src="/mahayogam-logo.png" 
            alt="Mahayogam Logo" 
            className="h-16 mr-2 mb-5"
          />
          <div style={{ color: "#7a2a2a" }}>
            <h1 className="text-3xl font-bold">MAHAYOGAM</h1>
            <p className="text-xs">A Traditional Spiritual Experience</p>
          </div>
        </div>

        {/* Profile section */}
        <div className="flex flex-col items-center mt-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={student.profileImage || "/api/placeholder/200/200"}
                alt={student.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
         
            <button
              className="mt-2 px-4 py-2  rounded text-white"
              style={{ backgroundColor: "#7a2a2a" }}
              onClick={() => fileInputRef.current.click()}
            >
              Choose File
            </button>
          </div>

          <h2 className="text-2xl font-semibold mt-4" style={{ color: "#7a2a2a" }}>{student.name}</h2>
        </div>

        {/* Fee status section */}
        <div className="mt-12">
          <div className="flex justify-between mb-4">
            <h3 className="text-4xl font-light" style={{ color: "#7a2a2a" }}>Month</h3>
            <h3 className="text-4xl font-light" style={{ color: "#7a2a2a" }}>Fee Status</h3>
          </div>
          {/* <div className="text-center mb-4 text-2xl" style={{ color: "#7a2a2a" }}>Jan to Feb</div> */}
          <div className="rounded-lg p-4" style={{ backgroundColor: "#993333" }}>
            {displayMonths.map((month) => (
              <div
                key={month}
                className="py-4 flex justify-between items-center"
                style={{ 
                  borderBottom: month !== displayMonths[displayMonths.length - 1] ? "1px solid rgba(255, 255, 255, 0.2)" : "none"
                }}
              >
                <div className="text-3xl font-light text-white">{month}</div>
                {student.fees && student.fees[month] ? (
                  <div className="px-4 py-1 rounded text-white" style={{ backgroundColor: "#4caf50" }}>Paid</div>
                ) : (
                  <div className="px-4 py-1 rounded text-white" style={{ backgroundColor: "#f44336" }}>Unpaid</div>
                )}
                <div className="flex space-x-2">
                  <button
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#4caf50" }}
                    onClick={() => {
                      if (!student.fees[month]) toggleFeeStatus(month);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </button>
                  <button
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#f44336" }}
                    onClick={() => {
                      if (student.fees[month]) toggleFeeStatus(month);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
    </div>
  );
}

export default StudentProfilePage;