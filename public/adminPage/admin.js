document.addEventListener("DOMContentLoaded", () => {
    loadUserTable();
    loadContentTables();

    document.getElementById("addContent").addEventListener("click", () => {
        document.getElementById("contentFormPopup").style.display = "block";
    });
});



async function uploadPDF(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById("contentForm"));
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }
    const response = await fetch("/admin/addContent", { method: "POST", body: formData });
    if (response.ok) {
        document.getElementById("successPopup").style.display = "block";
        loadContentTables();
        closePopup();
    } else {
        alert("Failed to add content");
    }
}

function closePopup() {
    document.getElementById("contentFormPopup").style.display = "none";
}

function closeSuccessPopup() {
    document.getElementById("successPopup").style.display = "none";
}

async function loadUserTable() {
    const response = await fetch("/admin/users");
    const users = await response.json();
    const userTable = document.getElementById("userTable");
    userTable.innerHTML = "<tr><th>ID</th><th>Username</th><th>Email</th><th>User Type</th><th>Actions</th></tr>";
    users.forEach(user => {
        // console.log(user)
        userTable.innerHTML += `<tr><td>${user.id}</td><td>${user.username}</td><td>${user.email}</td><td>${user.user_type}</td>
            <td>
                <button onclick="editUser(${user.id})" class="edit">Edit</button>
                ${user.user_type !== 'Admin' ? `<button onclick="deleteUser(${user.id})" class="delete">Delete</button>` : ''}
            </td></tr>`;
    });
}

async function loadContentTables() {
    try {
        const response = await fetch("/admin/contentTables");
        const contentData = await response.json();
        const contentTables = document.getElementById("contentTables");
        contentTables.innerHTML = "";
        print("contentData of contentTables: ", contentData)
        Object.keys(contentData).forEach(category => {
            // Check if the category table is empty
            if (contentData[category].length === 0) {
                contentTables.innerHTML += `<h3>${category}</h3><p>No content available.</p>`;
            } else {
                // Create table with ID, Filename, Chapter, Category, Actions
                contentTables.innerHTML += `
                    <h3>${category}</h3>
                    <div class="table-container">
                        <table id="${category}Table">
                            <tr><th>ID</th><th>Filename</th><th>Title</th><th>Chapter</th><th>Category</th><th>Actions</th></tr>
                        </table>
                    </div>
                `;
                const table = document.getElementById(`${category}Table`);

                contentData[category].slice(0, 10).forEach(row => {
                    table.innerHTML += `
                        <tr>
                            <td>${row.id}</td>
                            <td>${row.filename}</td>
                            <td>${row.title}</td>
                            <td>${row.chapter}</td>
                            <td>${row.category}</td>
                            <td>
                                <button onclick="editContent(${row.id},'${row.category}')" class="edit">Edit</button> 
                                <button onclick="deleteContent(${row.id},'${row.category}')" class="delete">Delete</button>
                            </td>
                        </tr>
                    `;
                });
            }
        });
    } catch (error) {
        console.error("Error loading content tables:", error);
    }
}

async function loadQuizContentTables() {
    try {
        const response = await fetch("/admin/quizTables");
        const quizData = await response.json();
        const quizTables = document.getElementById("quizTables");
        quizTables.innerHTML = "";
        print("quizData of quizTables: ", quizData)
        Object.keys(quizData).forEach(category => {
            // Check if the category table is empty
            if (quizData[category].length === 0) {
                quizTables.innerHTML += `<h3>${category}</h3><p>No quiz available.</p>`;
            } else {
                // Create table with ID, Filename, Chapter, Category, Actions
                quizTables.innerHTML += `
                    <h3>${category}</h3>
                    <div class="table-container">
                        <table id="${category}Table">
                            <tr><th>ID</th><th>Question</th><th>Chapter</th><th>Category</th><th>Actions</th></tr>
                        </table>
                    </div>
                `;
                const table = document.getElementById(`${category}Table`);

                quizData[category].slice(0, 10).forEach(row => {
                    table.innerHTML += `
                        <tr>
                            <td>${row.id}</td>
                            <td>${row.question}</td>
                            <td>${row.chapter}</td>
                            <td>${row.category}</td>
                            <td>
                                <button onclick="editQuiz(${row.id},'${row.category}')" class="edit">Edit</button> 
                                <button onclick="deleteQuiz(${row.id},'${row.category}')" class="delete">Delete</button>
                            </td>
                        </tr>
                    `;
                });
            }
        });
    } catch (error) {
        console.error("Error loading content tables:", error);
    }
}

function editUser(userId) {
    // Load current user data into the editUserForm
    fetch(`/admin/getUser/${userId}`).then(response => response.json()).then(user => {
        document.getElementById("editUserForm").userId.value = user.id;
        document.getElementById("editUserForm").firstname.value = user.firstname;
        document.getElementById("editUserForm").lastname.value = user.lastname;
        document.getElementById("editUserForm").username.value = user.username;
        document.getElementById("editUserForm").password.value = user.password;
        document.getElementById("editUserForm").email.value = user.email;
        document.getElementById("editUserForm").country.value = user.country;
        document.getElementById("editUserForm").user_type.value = user.user_type;
                // Set the user ID attribute on the edit popup element
        document.getElementById("editUserPopup").setAttribute("data-user-id", user.id);

        document.getElementById("editUserPopup").style.display = "block";
    });
}

document.getElementById("editUserForm").onsubmit = async function (event) {
    event.preventDefault();
    const userId = document.getElementById("editUserPopup").getAttribute("data-user-id");
    const formData = new FormData(document.getElementById("editUserForm"));
    await fetch(`/admin/editUser/${userId}`, { method: "PUT", body: formData });
    closeEditUserPopup();
    loadUserTable();
};

function editContent(contentId, category) {
    console.log("Edit Content Function used!")
    fetch(`/admin/getContent/${contentId}?category=${encodeURIComponent(category)}`).then(response => response.json()).then(content => {
        document.getElementById("editContentForm").contentId.value = content.id;
        document.getElementById("editContentForm").filename.value = content.filename;
        document.getElementById("editContentForm").title.value = content.title;
        document.getElementById("editContentForm").chapter.value = content.chapter;
        document.getElementById("editContentForm").youtubeLink.value = content.youtubeLink;
        document.getElementById("editContentForm").description.value = content.description;
        document.getElementById("editContentForm").category.value = content.category;
        document.getElementById("editContentPopup").style.display = "block";
                // Set the user ID attribute on the edit popup element
        document.getElementById("editContentPopup").setAttribute("contentId", content.id);

    });
}

function editQuiz(quizId, category) {
    console.log("Edit Content Function used!")
    fetch(`/admin/getQuiz/${quizId}?category=${encodeURIComponent(category)}`).then(response => response.json()).then(quiz => {
        document.getElementById("editQuizForm").quizId.value = quiz.id;
        document.getElementById("editQuizForm").question.value = quiz.filename;
        document.getElementById("editQuizForm").choice1.value = quiz.choice1;
        document.getElementById("editQuizForm").choice2.value = quiz.choice2;
        document.getElementById("editQuizForm").choice3.value = quiz.choice3;
        document.getElementById("editQuizForm").choice4.value = quiz.choice4;
        document.getElementById("editQuizForm").answer.value = quiz.answer;
        document.getElementById("editQuizForm").chapter.value = quiz.chapter;
        document.getElementById("editQuizForm").category.value = quiz.category;
        document.getElementById("editQuizPopup").style.display = "block";
                // Set the user ID attribute on the edit popup element
        document.getElementById("editQuizPopup").setAttribute("quizId", quiz.id);

    });
}

document.getElementById("editContentForm").onsubmit = async function (event) {
    event.preventDefault();
    const contentId = document.getElementById("editContentPopup").getAttribute("contentId");
    const formData = new FormData(document.getElementById("editContentForm"));
    await fetch(`/admin/editContent/${contentId}`, { method: "PUT", body: formData });
    closeEditContentPopup();
    loadContentTables();
};

async function deleteContent(contentId, category) {
    if (confirm("Are you sure you want to delete this content?")) {
        try {
            const response = await fetch(`/admin/deleteContent/${contentId}?category=${encodeURIComponent(category)}`, { method: "DELETE" });
            if (response.ok) {
                alert("Content deleted successfully");
                loadContentTables(); // Reload the content tables to reflect the changes
            } else {
                alert("Failed to delete content");
            }
        } catch (error) {
            console.error("Error deleting content:", error);
            alert("An error occurred while deleting the content");
        }
    }
}

async function deleteQuiz(quizId, category) {
    if (confirm("Are you sure you want to delete this quiz?")) {
        try {
            const response = await fetch(`/admin/deleteQuiz/${quizId}?category=${encodeURIComponent(category)}`, { method: "DELETE" });
            if (response.ok) {
                alert("Quiz deleted successfully");
                loadContentTables(); // Reload the content tables to reflect the changes
            } else {
                alert("Failed to delete quiz");
            }
        } catch (error) {
            console.error("Error deleting quiz:", error);
            alert("An error occurred while deleting the quiz");
        }
    }
}

async function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        try {
            const response = await fetch(`/admin/deleteUser/${userId}`, { method: "DELETE" });
            if (response.ok) {
                alert("User deleted successfully");
                loadUserTable(); // Reload the user table to reflect the changes
            } else {
                alert("Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("An error occurred while deleting the user");
        }
    }
}

function closeEditUserPopup() {
    document.getElementById("editUserPopup").style.display = "none";
}

function closeEditContentPopup() {
    document.getElementById("editContentPopup").style.display = "none";
}

// Generate confetti elements and add them to the background
function generateConfetti() {
    const confettiContainer = document.createElement("div");
    confettiContainer.classList.add("confetti");
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 100; i++) {
        const confettiPiece = document.createElement("div");
        const leftPosition = Math.random() * 100;
        const animationDelay = Math.random() * 5;
        const animationDuration = 2 + Math.random() * 3;

        confettiPiece.style.left = `${leftPosition}%`;
        confettiPiece.style.animationDelay = `${animationDelay}s`;
        confettiPiece.style.animationDuration = `${animationDuration}s`;

        confettiContainer.appendChild(confettiPiece);
    }
}

// Close the success popup
function closeSuccessPopup() {
    document.getElementById("successPopup").style.display = "none";
}

// Show the success popup and trigger the confetti animation
function showSuccessPopup() {
    document.getElementById("successPopup").style.display = "block";
    generateConfetti();
}

async function swapContent(contentId1, contentId2) {
    await fetch(`/admin/swapContent`, { method: "POST", body: JSON.stringify({ id1: contentId1, id2: contentId2 }) });
    loadContentTables();
}

function enableSwapMode(category) {
    // Show swap button and handle selections for the specified category
    document.getElementById(`${category}Table`).classList.add("swap-mode");
}

document.addEventListener("DOMContentLoaded", () => {
    // Function to check and modify the input value
    const checkAndReplaceLink = () => {
        // Find the input field by its name attribute
        const inputField = document.querySelector('input[name="youtubeLink"]');
        if (inputField) {
            // Check if the input value contains "watch?v"
            const currentValue = inputField.value;
            if (currentValue.includes("watch?v")) {
                // Replace "watch?v=" with "embed/"
                inputField.value = currentValue.replace("watch?v=", "embed/");
            }
        }
    };

    // Continuously monitor the input field
    setInterval(checkAndReplaceLink, 500); // Check every 500ms
});