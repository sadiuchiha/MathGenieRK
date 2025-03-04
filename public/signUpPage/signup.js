// Function to sign up a user by sending a POST request to the server
async function signUpUser(firstname, lastname, username, email, password, country) {
    const userData = {
        firstname,
        lastname,
        username,
        email,
        password,
        country
    };

    try {
        // Send a POST request to the server with the user data
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Sign up failed!');
        }

        const result = await response.json();
        console.log(result.message);
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

// Example usage
document.getElementById('signUpForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const firstname = event.target.firstname.value;
    const lastname = event.target.lastname.value;
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const country = event.target.country.value;

    try {
        await signUpUser(firstname, lastname, username, email, password, country);
        alert("Sign up successful!");
    } catch (error) {
        alert(error.message);
    }
});