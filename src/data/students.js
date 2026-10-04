export const students = {
  "Prince Patel": {
    id: "1023",
    name: "Prince Patel",
    className: "10-A",
    role: "student"
  },

  "Nikul Vasava": {
    id: "1024",
    name: "Nikul Vasava",
    className: "10-A",
    role: "student"
  },

  "Nikul vasava": {
    id: "1024",
    name: "Nikul Vasava",
    className: "10-A",
    role: "student"
  },

  "Manish Sir": {
    id: "T001",
    name: "Manish Sir",
    className: "Teacher",
    role: "teacher"
  }
};

/**
 * Case-insensitive student lookup helper
 */
export const findStudentByName = (name) => {
  if (!name) return null;
  if (students[name]) return students[name];
  const lower = name.toLowerCase().trim();
  for (const key of Object.keys(students)) {
    if (key.toLowerCase().trim() === lower) {
      return students[key];
    }
  }
  return null;
};
