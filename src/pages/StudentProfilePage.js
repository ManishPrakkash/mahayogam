import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiCheck, FiX, FiCamera } from "react-icons/fi";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { getStudent, updateStudentFee } from "../lib/data";

function StudentProfilePage() {
  const [student, setStudent] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cityId, batchId, studentId } = useParams();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthIndex = new Date().getMonth();
  const displayMonths = [
    months[currentMonthIndex],
    months[(currentMonthIndex - 1 + 12) % 12],
    months[(currentMonthIndex - 2 + 12) % 12],
    months[(currentMonthIndex - 3 + 12) % 12],
  ];
  
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
        // Update local storage
        const students = JSON.parse(localStorage.getItem("mahayogam-students")) || [];
        const updatedStudents = students.map((s) => (s.id === studentId ? { ...s, profileImage: reader.result } : s));
        localStorage.setItem("mahayogam-students", JSON.stringify(updatedStudents));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f5e6cb]">
      <div className="container max-w-md mx-auto p-4">
        <Logo />

        <div className="flex flex-col items-center mt-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={student.profileImage || "/placeholder.svg?height=200&width=200"}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            </div>
            <label className="absolute -right-2 -bottom-2 w-10 h-10 rounded-full bg-[#f44336] text-white flex items-center justify-center cursor-pointer">
              <FiCamera size={20} />
              <input type="file" className="hidden" onChange={handleProfileImageChange} />
            </label>
          </div>

          <h2 className="text-2xl font-semibold mt-4 text-[#7a2a2a]">{student.name}</h2>
        </div>

        <div className="mt-12">
          <div className="flex justify-between mb-4">
            <h3 className="text-4xl font-light text-[#7a2a2a]">Month</h3>
            <h3 className="text-4xl font-light text-[#7a2a2a]">Fee Status</h3>
          </div>

          <div className="rounded-lg bg-[#7a2a2a] p-4">
            {displayMonths.map((month) => (
              <div
                key={month}
                className="py-4 border-b border-white/20 last:border-0 flex justify-between items-center"
              >
                <div className="text-3xl font-light text-[#7a2a2a]">{month}</div>
                {student.fees[month] ? (
                  <div className="px-4 py-1 bg-[#4caf50] text-[#7a2a2a] rounded">Paid</div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      className="w-10 h-10 rounded-full bg-[#4caf50] flex items-center justify-center"
                      onClick={() => toggleFeeStatus(month)}
                    >
                      <FiCheck size={24} className="text-white" />
                    </button>
                    <button
                      className="w-10 h-10 rounded-full bg-[#f44336] flex items-center justify-center"
                      onClick={() => toggleFeeStatus(month)}
                    >
                      <FiX size={24} className="text-white" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfilePage;

