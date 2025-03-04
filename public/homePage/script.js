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

// Add event listener for menu items
document.querySelectorAll(".menu-item").forEach((item) => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        const category = item.dataset.category;
        // Redirect to materialPage.html with category as query param
        window.location.href = `/materials/${category}`;
    });
});