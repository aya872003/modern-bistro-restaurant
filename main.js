
 const menuToggle = document.getElementById("menuToggle");

        const navLinks = document.getElementById("navLinks");


        // Open and close mobile menu

        menuToggle.addEventListener("click", function () {

            navLinks.classList.toggle("active");

            const isOpen = navLinks.classList.contains("active");

            menuToggle.setAttribute("aria-expanded", isOpen);

            menuToggle.textContent = isOpen ? "✕" : "☰";

        });


        // Close menu after clicking a link

        document.querySelectorAll(".nav-links a").forEach(function(link) {

            link.addEventListener("click", function() {

                navLinks.classList.remove("active");

                menuToggle.setAttribute("aria-expanded", "false");

                menuToggle.textContent = "☰";

            });

        });



        // =========================
// MENU FILTER, SEARCH & MODAL LOGIC
// =========================

const searchInput = document.getElementById("menuSearchInput");
const menuCards = document.querySelectorAll(".menu-card");
const categoryButtons = document.querySelectorAll(".cat-btn");
const noResultsDiv = document.getElementById("noResults");

// Live Search functionality
if (searchInput) {
    searchInput.addEventListener("input", function (e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        let visibleCount = 0;

        menuCards.forEach(card => {
            const dishName = card.getAttribute("data-name");
            const dishDesc = card.querySelector(".item-desc").textContent.toLowerCase();
            
            if (dishName.includes(searchTerm) || dishDesc.includes(searchTerm)) {
                card.style.display = "flex";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        // Show or hide no results message
        if (visibleCount === 0) {
            noResultsDiv.style.display = "block";
        } else {
            noResultsDiv.style.display = "none";
        }
    });
}

// Category Filter functionality
categoryButtons.forEach(button => {
    button.addEventListener("click", function () {
        // Remove active class from all buttons
        categoryButtons.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");

        const selectedCategory = this.getAttribute("data-category");
        let visibleCount = 0;

        menuCards.forEach(card => {
            const cardCategory = card.getAttribute("data-category");

            if (selectedCategory === "all" || cardCategory === selectedCategory) {
                card.style.display = "flex";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        // Reset search input when switching categories
        if (searchInput) searchInput.value = "";
        noResultsDiv.style.display = "none";
    });
});



// Modal Popup Functions
function openModal(title, price, desc, imgSrc) {
    const modal = document.getElementById("dishModal");
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalPrice").textContent = price;
    document.getElementById("modalDesc").textContent = desc;
    document.getElementById("modalImg").src = imgSrc;
    
    if (modal) modal.classList.add("active");
}

function closeModal() {
    const modal = document.getElementById("dishModal");
    if (modal) modal.classList.remove("active");
}

window.addEventListener("click", function (event) {
    const modal = document.getElementById("dishModal");
    if (event.target === modal) {
        closeModal();
    }
});




// Initialize EmailJS with your Public Key
(function() {
    emailjs.init("9fAvk_ymW8vJA0X6q"); // استبدلي هذا بـ Public Key الخاص بكِ من EmailJS
})();

const bookingForm = document.getElementById("tableBookingForm");
const formStatus = document.getElementById("formStatus");

if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let isValid = true;
        formStatus.className = "form-status";
        formStatus.style.display = "none";


        // 1. Full Name Validation
        const fullName = document.getElementById("fullName");
        if (!fullName.value.trim()) {
            showError("nameError", fullName);
            isValid = false;
        } else {
            hideError("nameError", fullName);
        }

        // 2. Phone Validation
        const phone = document.getElementById("phone");
        if (!phone.value.trim() || phone.value.trim().length < 8) {
            showError("phoneError", phone);
            isValid = false;
        } else {
            hideError("phoneError", phone);
        }

        // 3. Email Validation (@gmail.com or @yahoo.com ONLY)
        const email = document.getElementById("email");
        const emailVal = email.value.trim().toLowerCase();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/;
        
        if (!emailRegex.test(emailVal)) {
            showError("emailError", email);
            isValid = false;
        } else {
            hideError("emailError", email);
        }

        // 4. Guests Validation
        const guests = document.getElementById("guests");
        if (!guests.value) {
            showError("guestsError", guests);
            isValid = false;
        } else {
            hideError("guestsError", guests);
        }

        // 5. Seating Validation
        const seating = document.getElementById("seating");
        if (!seating.value) {
            showError("seatingError", seating);
            isValid = false;
        } else {
            hideError("seatingError", seating);
        }

        // 6. Date Validation
        const bookingDate = document.getElementById("bookingDate");
        if (!bookingDate.value) {
            showError("dateError", bookingDate);
            isValid = false;
        } else {
            hideError("dateError", bookingDate);
        }

        // 7. Time Validation
        const bookingTime = document.getElementById("bookingTime");
        if (!bookingTime.value) {
            showError("timeError", bookingTime);
            isValid = false;
        } else {
            hideError("timeError", bookingTime);
        }

        // Special Requests (Optional) - No Validation Required

        // IF VALID -> Send to Email
        if (isValid) {
            const submitBtn = bookingForm.querySelector(".submit-btn");
            submitBtn.disabled = true;
            submitBtn.innerText = "Sending Booking Request...";

            const templateParams = {
                from_name: fullName.value,
                phone: phone.value,
                reply_to: email.value,
                guests: guests.value,
                seating: seating.value,
                date: bookingDate.value,
                time: bookingTime.value,
                special_requests: document.getElementById("specialRequests").value || "None"
            };

            // Send Email via EmailJS
            emailjs.send("service_1yhr1wd", "template_qsrip3i", templateParams)
                .then(function() {
                    formStatus.className = "form-status success";
                    formStatus.textContent = "Your table reservation has been submitted successfully! We will contact you shortly.";
                    bookingForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<span>Confirm Booking & Send Ticket</span> <i class="fa-solid fa-paper-plane"></i>`;
                }, function(error) {
                    formStatus.className = "form-status error";
                    formStatus.textContent = "Failed to send reservation. Please check your data and try again.";
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<span>Confirm Booking & Send Ticket</span> <i class="fa-solid fa-paper-plane"></i>`;
                });
        } else {
            formStatus.className = "form-status error";
            formStatus.textContent = "Please fill in all required fields correctly before submitting.";
        }
    });
}

function showError(errorId, inputElement) {
    document.getElementById(errorId).style.display = "block";
    inputElement.closest(".form-group").classList.add("invalid");
}

function hideError(errorId, inputElement) {
    document.getElementById(errorId).style.display = "none";
    inputElement.closest(".form-group").classList.remove("invalid");
}