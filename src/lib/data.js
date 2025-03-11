const getItem = (key, defaultValue) => {
  if (typeof window === "undefined") return defaultValue;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

const setItem = (key, value) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const getCities = () => {
  return getItem("mahayogam-cities", []);
};

export const addCity = (name) => {
  const cities = getCities();
  const newCity = {
    id: "city_" + Math.random().toString(36).substr(2, 9),
    name,
  };
  setItem("mahayogam-cities", [...cities, newCity]);
  return newCity;
};

export const deleteCity = (id) => {
  const cities = getCities().filter((city) => city.id !== id);
  setItem("mahayogam-cities", cities);

  const batches = getBatches().filter((batch) => batch.cityId !== id);
  setItem("mahayogam-batches", batches);

  const batchIds = batches.map((batch) => batch.id);
  const students = getStudents().filter((student) => !batchIds.includes(student.batchId));
  setItem("mahayogam-students", students);
};

export const getBatches = () => {
  return getItem("mahayogam-batches", []);
};

export const getBatchesByCity = (cityId) => {
  return getBatches().filter((batch) => batch.cityId === cityId);
};

export const addBatch = (name, cityId) => {
  const batches = getBatches();
  const newBatch = {
    id: "batch_" + Math.random().toString(36).substr(2, 9),
    name,
    cityId,
  };
  setItem("mahayogam-batches", [...batches, newBatch]);
  return newBatch;
};

export const deleteBatch = (id) => {
  const batches = getBatches().filter((batch) => batch.id !== id);
  setItem("mahayogam-batches", batches);

  const students = getStudents().filter((student) => student.batchId !== id);
  setItem("mahayogam-students", students);
};

export const getStudents = () => {
  return getItem("mahayogam-students", []);
};

export const getStudentsByBatch = (batchId) => {
  return getStudents().filter((student) => student.batchId === batchId);
};

export const getStudent = (id) => {
  return getStudents().find((student) => student.id === id);
};

export const addStudent = (name, batchId) => {
  const students = getStudents();

  const newStudent = {
    id: "student_" + Math.random().toString(36).substr(2, 9),
    name,
    batchId,
    attendance: {},
    fees: {},
  };

  setItem("mahayogam-students", [...students, newStudent]);
  return newStudent;
};

export const deleteStudent = (studentId) => {
  let students = getStudents();
  students = students.filter((student) => student.id !== studentId);
  setItem("mahayogam-students", students);
};

export const updateStudentAttendance = (studentId, date, isPresent) => {
  const students = getStudents();
  const studentIndex = students.findIndex((s) => s.id === studentId);

  if (studentIndex !== -1) {
    students[studentIndex].attendance[date] = isPresent;
    setItem("mahayogam-students", students);
  }
};

export const updateStudentFee = (studentId, month, isPaid) => {
  const students = getStudents();
  const studentIndex = students.findIndex((s) => s.id === studentId);

  if (studentIndex !== -1) {
    students[studentIndex].fees[month] = isPaid;
    setItem("mahayogam-students", students);
  }
};

export const initializeSampleData = () => {
  if (typeof window === "undefined") return;

  if (getCities().length === 0) {
    const chennai = addCity("Chennai");
    const bangalore = addCity("Bangalore");

    const batch1 = addBatch("Batch 1", chennai.id);
    const batch2 = addBatch("Batch 2", chennai.id);
    const batch3 = addBatch("Batch 3", bangalore.id);
    const batch4 = addBatch("Batch 4", bangalore.id);

    addStudent("Manish", batch1.id);
    addStudent("Kavin Kumar", batch1.id);
    addStudent("Karthick", batch1.id);

    addStudent("Ramesh", batch2.id);
    addStudent("Suresh", batch2.id);
  }
};

