// Toggle sidebar menu
document.getElementById('hamburger').addEventListener('click', function() {
    this.classList.toggle('open');
    document.getElementById('sidebar').classList.toggle('open');
});

// Close sidebar when close button is clicked
document.getElementById('close-btn').addEventListener('click', function() {
    document.getElementById('hamburger').classList.remove('open');
    document.getElementById('sidebar').classList.remove('open');
});

// Close sidebar if clicked outside
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburger');

    // Check if the click was outside of the sidebar and not on the hamburger button
    if (!sidebar.contains(event.target) && !hamburger.contains(event.target) && sidebar.classList.contains('open')) {
        hamburger.classList.remove('open');
        sidebar.classList.remove('open');
    }
});

// Scroll animations for fade-in effect
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
});

document.querySelectorAll('.fade-in-scroll').forEach(element => {
    observer.observe(element);
});


// Create a function which checks if the user is logged in and updates log in Text in Menu
// 