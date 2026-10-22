// =========================
// API URL (Change this)
// =========================
const API_URL = "https://fastapi-student-management.onrender.com";
const STUDENTS_URL = `${API_URL}/students/`;

// =========================
// DOM Elements
// =========================
const form = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const message = document.getElementById("message");

const studentIdInput = document.getElementById("studentId");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const departmentInput = document.getElementById("department");
const ageInput = document.getElementById("age");

const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const refreshBtn = document.getElementById("refreshBtn");

// =========================
// Error Message
// =========================
function getErrorMessage(data) {
    if (data.detail) {
        return typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail);
    }
    return "Something went wrong.";
}

// =========================
// GET All Students
// =========================
async function loadStudents() {
    refreshBtn.disabled = true;
    studentTable.innerHTML = `
        <tr>
            <td colspan="6">Loading students...</td>
        </tr>
    `;

    try {
        const response = await fetch(STUDENTS_URL);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(getErrorMessage(errorData));
        }

        const students = await response.json();

        studentTable.innerHTML = "";

        if (students.length === 0) {
            studentTable.innerHTML = `
                <tr>
                    <td colspan="6">No students found.</td>
                </tr>
            `;
            return;
        }

        students.forEach(student => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${student.student_id}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.department}</td>
                <td>${student.age}</td>
                <td>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </td>
            `;

            row.querySelector(".edit")
                .addEventListener("click", () => editStudent(student));

            row.querySelector(".delete")
                .addEventListener("click", () => deleteStudent(student.student_id));

            studentTable.appendChild(row);
        });

    } catch (error) {
        studentTable.innerHTML = `
            <tr>
                <td colspan="6">
                    Could not load students: ${error.message}
                </td>
            </tr>
        `;
    } finally {
        refreshBtn.disabled = false;
    }
}

// =========================
// Edit Student
// =========================
function editStudent(student) {
    studentIdInput.value = student.student_id;
    nameInput.value = student.name;
    emailInput.value = student.email;
    departmentInput.value = student.department;
    ageInput.value = student.age;

    formTitle.textContent = "Update Student";
    submitBtn.textContent = "Update Student";
    cancelBtn.hidden = false;

    form.scrollIntoView({
        behavior: "smooth"
    });
}

// =========================
// Reset Form
// =========================
function resetForm() {
    form.reset();
    studentIdInput.value = "";

    formTitle.textContent = "Add New Student";
    submitBtn.textContent = "Add Student";
    cancelBtn.hidden = true;
}

// =========================
// Cancel Button
// =========================
cancelBtn.addEventListener("click", () => {
    resetForm();
    message.textContent = "";
});

// =========================
// POST / PUT
// =========================
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = studentIdInput.value;

    const student = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        department: departmentInput.value.trim(),
        age: Number(ageInput.value)
    };

    if (!student.name || !student.email || !student.department) {
        message.textContent = "Please fill all fields.";
        return;
    }

    if (student.age <= 0) {
        message.textContent = "Invalid age.";
        return;
    }

    const url = id
        ? `${STUDENTS_URL}${id}`
        : STUDENTS_URL;

    const method = id ? "PUT" : "POST";

    submitBtn.disabled = true;
    message.textContent = id
        ? "Updating student..."
        : "Creating student...";

    try {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(getErrorMessage(errorData));
        }

        message.textContent = id
            ? "Student updated successfully!"
            : "Student created successfully!";

        resetForm();
        loadStudents();

    } catch (error) {
        message.textContent = error.message;
    } finally {
        submitBtn.disabled = false;
    }
});

// =========================
// DELETE Student
// =========================
async function deleteStudent(id) {

    if (!confirm(`Delete student ${id}?`))
        return;

    try {
        const response = await fetch(`${STUDENTS_URL}${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(getErrorMessage(errorData));
        }

        message.textContent = "Student deleted successfully!";

        if (studentIdInput.value == id)
            resetForm();

        loadStudents();

    } catch (error) {
        message.textContent = error.message;
    }
}


// =========================
// Refresh Button
// =========================
refreshBtn.addEventListener("click", loadStudents);

// =========================
// Initial Load
// =========================
loadStudents();