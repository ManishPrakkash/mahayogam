// This file simulates a database with local storage

// Helper functions to work with localStorage
const getItem = (key, defaultValue) => {
    if (typeof window === "undefined") return defaultValue
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  }
  
  const setItem = (key, value) => {
    if (typeof window === "undefined") return
    localStorage.setItem(key, JSON.stringify(value))
  }
  
  // City functions
  export const getCities = () => {
    return getItem("mahayogam-cities", [])
  }
  
  export const addCity = (name) => {
    const cities = getCities()
    const newCity = {
      id: "city_" + Math.random().toString(36).substr(2, 9),
      name,
    }
    setItem("mahayogam-cities", [...cities, newCity])
    return newCity
  }
  
  export const deleteCity = (id) => {
    const cities = getCities().filter((city) => city.id !== id)
    setItem("mahayogam-cities", cities)
  
    // Also delete related batches
    const batches = getBatches().filter((batch) => batch.cityId !== id)
    setItem("mahayogam-batches", batches)
  
    // And related students
    const batchIds = batches.map((batch) => batch.id)
    const students = getStudents().filter((student) => !batchIds.includes(student.batchId))
    setItem("mahayogam-students", students)
  }
  
  // Batch functions
  export const getBatches = () => {
    return getItem("mahayogam-batches", [])
  }
  
  export const getBatchesByCity = (cityId) => {
    return getBatches().filter((batch) => batch.cityId === cityId)
  }
  
  export const addBatch = (name, cityId) => {
    const batches = getBatches()
    const newBatch = {
      id: "batch_" + Math.random().toString(36).substr(2, 9),
      name,
      cityId,
    }
    setItem("mahayogam-batches", [...batches, newBatch])
    return newBatch
  }
  
  export const deleteBatch = (id) => {
    const batches = getBatches().filter((batch) => batch.id !== id)
    setItem("mahayogam-batches", batches)
  
    // Also delete related students
    const students = getStudents().filter((student) => student.batchId !== id)
    setItem("mahayogam-students", students)
  }
  
  // Student functions
  export const getStudents = () => {
    return getItem("mahayogam-students", [])
  }
  
  export const getStudentsByBatch = (batchId) => {
    return getStudents().filter((student) => student.batchId === batchId)
  }
  
  export const getStudent = (id) => {
    return getStudents().find((student) => student.id === id)
  }
  
  export const addStudent = (name, batchId) => {
    const students = getStudents()
  
    // Generate some sample data for attendance and fees
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentMonth = new Date().getMonth()
  
    const fees = {}
    months.slice(0, 4).forEach((month, index) => {
      // Mark previous months as paid, current month as unpaid
      fees[month] = index < 3
    })
  
    const attendance = {}
    // Generate some random attendance for the last 10 days
    for (let i = 0; i < 10; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      attendance[dateStr] = Math.random() > 0.3 // 70% chance of being present
    }
  
    const newStudent = {
      id: "student_" + Math.random().toString(36).substr(2, 9),
      name,
      batchId,
      profileImage: `/placeholder.svg?height=200&width=200&text=${name.charAt(0)}`,
      attendance,
      fees,
    }
  
    setItem("mahayogam-students", [...students, newStudent])
    return newStudent
  }
  
  export const updateStudentAttendance = (studentId, date, isPresent) => {
    const students = getStudents()
    const studentIndex = students.findIndex((s) => s.id === studentId)
  
    if (studentIndex !== -1) {
      students[studentIndex].attendance[date] = isPresent
      setItem("mahayogam-students", students)
    }
  }
  
  export const updateStudentFee = (studentId, month, isPaid) => {
    const students = getStudents()
    const studentIndex = students.findIndex((s) => s.id === studentId)
  
    if (studentIndex !== -1) {
      students[studentIndex].fees[month] = isPaid
      setItem("mahayogam-students", students)
    }
  }
  
  // Initialize with some sample data if empty
  export const initializeSampleData = () => {
    if (typeof window === "undefined") return
  
    // Only initialize if no data exists
    if (getCities().length === 0) {
      // Add sample cities
      const chennai = addCity("Chennai")
      const bangalore = addCity("Bangalore")
  
      // Add sample batches
      const batch1 = addBatch("Batch 1", chennai.id)
      const batch2 = addBatch("Batch 2", chennai.id)
      const batch3 = addBatch("Batch 3", bangalore.id)
      const batch4 = addBatch("Batch 4", bangalore.id)
  
      // Add sample students
      addStudent("Praveen", batch1.id)
      addStudent("Surya", batch1.id)
      addStudent("Srinisha", batch1.id)
      addStudent("Manish", batch1.id)
      addStudent("Kavin Kumar", batch1.id)
      addStudent("Vijay", batch1.id)
      addStudent("Karthick", batch1.id)
  
      // Add a few students to other batches
      addStudent("Ramesh", batch2.id)
      addStudent("Suresh", batch2.id)
      addStudent("Mahesh", batch3.id)
      addStudent("Rajesh", batch4.id)
    }
  }
  
  