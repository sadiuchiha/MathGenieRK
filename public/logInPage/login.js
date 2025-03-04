async function validateLogin(event) {
    event.preventDefault();  // Prevent form submission by default

    // Get input values
    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;
    console.log("Attempting login with:", { username, password });

    try {
        // Send login data to the server for validation
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        console.log("Server responded with status:", response.status);

        // Parse the response JSON
        const result = await response.json();
        console.log("Login result:", result);

        if (response.ok) {
            // Check the user type and redirect accordingly
            if (result.user_type === 'Admin') {
                console.log("Redirecting to admin page");
                window.location.href = '/admin';
            } else {
                console.log("Redirecting to user home page");
                window.location.href = '/home';
            }
        } else {
            // Show error message if login failed
            alert(result.message || "Incorrect email or password. Please try again.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again later.");
    }
}