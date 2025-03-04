document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event fired");
});

// Toggle sidebar menu
document.getElementById('hamburger').addEventListener('click', function () {
    this.classList.toggle('open');
    document.getElementById('sidebar').classList.toggle('open');
});

// Close sidebar when close button is clicked
document.getElementById('close-btn').addEventListener('click', function () {
    document.getElementById('hamburger').classList.remove('open');
    document.getElementById('sidebar').classList.remove('open');
});

// Close sidebar if clicked outside
document.addEventListener('click', function (event) {
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

// Handle menu item clicks and load materials dynamically
document.addEventListener("DOMContentLoaded", () => {
    const urlParts = window.location.href.split("/")

    console.log("urlParts: ",urlParts)
    const category = urlParts[urlParts.length - 1];
    console.log("category: ",category)
    if (category) {
        // Highlight selected category in menu
        const selectedMenuItem = document.querySelector(`.menu-item[data-category="${category}"]`);
        if (selectedMenuItem) {
            selectedMenuItem.classList.add("active");
        }

        // Fetch and display table content
        const tableBody = document.getElementById("content-table-body");
        const loaderLabel = document.getElementById("loader-label");
        const tableContainer = document.getElementById("table-container");
        const pdfViewer = document.getElementById("pdf-viewer");
        const descriptionPart = document.getElementById("pdf-description");
        const descriptionContainer = document.getElementById("pdf-description-container");



        tableBody.innerHTML = "";
        loaderLabel.style.display = "block";
        loaderLabel.textContent = "Loading content...";
        tableContainer.style.display = "none";
        descriptionContainer.style.display = "none" 


        fetch(`/api/materials?category=${category}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch materials.");
                }
                return response.json();
            })
            .then((data) => {
                loaderLabel.style.display = "none";
                if (data.length > 0) {
                    tableContainer.style.display = "block";
                    data.forEach((row) => {
                        const tr = document.createElement("tr");
                        tr.innerHTML = `
                            <td>${row.filename}</td>
                            <td>${row.chapter}</td>
                        `;
                        tr.addEventListener("click", () => loadPDF(row.id, category,row.description, row.youtubeLink));
                        tableBody.appendChild(tr);
                    });
                } else {
                    loaderLabel.textContent = "No materials found for this category.";
                }
            })
            .catch((error) => {
                console.error(error);
                loaderLabel.textContent = "An error occurred while loading content. Please try again.";
            });
    } else {
        document.getElementById("loader-label").textContent = "No category selected.";
    }

    // Function to load PDF
    async function loadPDF(id, category,description, youtubeLink) {
        const loaderLabel = document.getElementById("loader-label");
        const pdfViewer = document.getElementById("pdf-viewer");
        const pdfLoader = document.getElementById("pdf-loader");
        const videoContainer = document.getElementById("video-container");


        const youtubeLinkViewer = document.getElementById("video-viewer");
        const descriptionPart = document.getElementById("pdf-description");
        const descriptionContainer = document.getElementById("pdf-description-container");

        try {
            loaderLabel.style.display = "block";
            loaderLabel.textContent = "Loading PDF...";
            pdfViewer.style.display = "none";
            const response = await fetch(`/materials/pdf/${id}?category=${category}`);
            if (response.ok) {
                const pdfUrl = URL.createObjectURL(await response.blob());
                loaderLabel.style.display = "none";
                pdfViewer.style.display = "block";
                pdfViewer.src = pdfUrl;
                pdfLoader.style = "block"
                if (youtubeLink === "") {
                    videoContainer.style.display = "none"
                    youtubeLinkViewer.style.display = "none";
                    youtubeLinkViewer.src = youtubeLink
                    console.log("Video Link: " + youtubeLink)
                } else {
                    videoContainer.style.display = "block"
                    youtubeLinkViewer.style.display = "block";
                    youtubeLinkViewer.src = youtubeLink
                    console.log("Video Link: " + youtubeLink)
                }

                descriptionContainer.style.display = "flex";
                descriptionContainer.style.flexDirection = "column";
                descriptionContainer.style.alignItems = "center";
                descriptionContainer.style.justifyContent = "center";
                descriptionContainer.style.width = "80%";
                descriptionContainer.style.height = "auto";
                descriptionContainer.style.margin = "20px auto";
                descriptionContainer.style.padding = "20px";
                descriptionContainer.style.textAlign = "center";

                descriptionPart.textContent = description;
                descriptionPart.style.display = "flex"; // Set the display to flex
                descriptionPart.style.flexDirection = "column"; // Arrange elements in a column
                descriptionPart.style.alignItems = "center"; // Align items horizontally to the center
                descriptionPart.style.justifyContent = "center"; // Align items vertically to the center
                descriptionPart.style.width = "100%"; // Ensure it fits within the parent container
                descriptionPart.style.margin = "20px auto"; // Set margin
                descriptionPart.style.padding = "20px"; // Set padding
                descriptionPart.style.textAlign = "center"; // Align text to the center
                descriptionPart.style.overflowWrap = "break-word"; // Ensure long words wrap
                descriptionPart.style.wordBreak = "break-word"; // Alternative for compatibility
                descriptionPart.style.whiteSpace = "normal"; // Ensure wrapping to new lines                console.log("response.body.description: ", description);

            } else {
                throw new Error("Failed to load PDF.");
            }
        } catch (error) {
            console.error(error);
            loaderLabel.textContent = "Failed to load the PDF. Please try again.";
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const pdfLoader = document.getElementById('pdf-loader');
    const pdfViewer = document.getElementById('pdf-viewer');
    const fullscreenButton = document.getElementById('fullscreen-button');

    fullscreenButton.addEventListener('click', () => {
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
            // If already in fullscreen, exit fullscreen.
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        } else {
             // Request fullscreen for the pdf container
            if (pdfLoader.requestFullscreen) {
                pdfLoader.requestFullscreen();
            } else if (pdfLoader.webkitRequestFullscreen) {
                pdfLoader.webkitRequestFullscreen();
            } else if (pdfLoader.mozRequestFullScreen) {
                pdfLoader.mozRequestFullScreen();
            } else if (pdfLoader.msRequestFullscreen) {
                pdfLoader.msRequestFullscreen();
            }
        }
    });

       pdfViewer.onload = () => {
           pdfLoader.classList.add('has-pdf'); //show button
        };

    // Listen for events of a PDF being closed
    pdfViewer.addEventListener("load", function() {
        pdfLoader.classList.remove('has-pdf')
    });

});

document.addEventListener('DOMContentLoaded', function() {

    // Form Submission and Success Message
   const contactForm = document.getElementById('contact-form');
      const successMessage = document.getElementById('success-message');
  
      contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        // Dummy function to send message
        simulateSendMessage();
          // Show success message after message is sent
       successMessage.style.display = 'block';
  
        //Reset the form
        contactForm.reset();
  
        // Hide the success message after 3 seconds
          setTimeout(() => {
               successMessage.style.display = 'none';
          }, 3000);
  
      });
  
    function simulateSendMessage() {
      // In a real app you would have this function send to the backend.
          console.log("Message sent");
    }
  });