/*
*****************************************************************************************************************
CREATOR: Javier Alegría Sobrados / KOKITO33
last modified on: 29/March/2025

PROJECT: WEB EXAMPLE OF A SEARCH TOOL FOR FLIGHTS, HOTELS AND CAR RENTALS

FUNCTION:
Find My Flight JavaScript file
*****************************************************************************************************************
*/

document.addEventListener('DOMContentLoaded', function() {
    
    // Variable to store the user
    let currentUser = null;

    // 1. Tab initialization
    document.getElementById('flightsTab').classList.add('active-tab');
    document.getElementById('flightsContent').classList.add('active');
    
    // 2. Tabbed navigation
    document.getElementById('flightsTab').addEventListener('click', function() {
        setActiveTab('flights');
    });
    
    document.getElementById('hotelsTab').addEventListener('click', function() {
        setActiveTab('hotels');
    });
    
    document.getElementById('carsTab').addEventListener('click', function() {
        setActiveTab('cars');
    });

    // 3. Login/register modal
    document.getElementById('loginRegisterBtn').addEventListener('click', function() {
        document.getElementById('registerModal').style.display = 'flex';
    });

    // 4. Contact mode (modified to not close when clicked out)
    document.getElementById('contactSupportLink').addEventListener('click', function() {
        document.getElementById('contactModal').style.display = 'flex';
    });

    document.getElementById('contactModal').addEventListener('click', function(e) {
        if (e.target === this) {
            return false;
        }
    });

    // 5. Manners lock
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // 6. FAQ
    const questions = document.querySelectorAll('.faq-question');
    questions.forEach(question => {
        question.addEventListener('click', function() {
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            answer.classList.toggle('open');
            
            questions.forEach(q => {
                if (q !== this && q.classList.contains('active')) {
                    q.classList.remove('active');
                    q.nextElementSibling.classList.remove('open');
                }
            });
        });
    });

    // 7. Add flight
    document.getElementById('addFlightBtn').addEventListener('click', addFlight);

    // 8. Search button
    document.getElementById('searchFlightsBtn').addEventListener('click', function() {
        showSearchResults('flights');
    });

    document.getElementById('searchHotelsBtn').addEventListener('click', function() {
        showSearchResults('hotels');
    });

    document.getElementById('searchCarsBtn').addEventListener('click', function() {
        showSearchResults('cars');
    });

    // 9. Contact forms
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateContactForm()) {
            alert('Message sent successfully!');
            document.getElementById('contactModal').style.display = 'none';
            this.reset();
        }
    });

    // 10. Login/register forms (Second Version)
    document.querySelectorAll('.redirectButton').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const form = this.closest('form');
            
            if (validateAuthForm(form)) {
                if (form.querySelector('input[name="txt"]')) {
                    // Is registro
                    currentUser = {
                        name: form.querySelector('input[name="txt"]').value,
                        email: form.querySelector('input[name="email"]').value
                    };
                } else {
                    // Is login
                    currentUser = {
                        name: form.querySelector('input[name="email"]').value.split('@')[0],
                        email: form.querySelector('input[name="email"]').value
                    };
                }
                
                updateUserUI();
                alert(this.textContent.trim() + ' successfully!');
                document.getElementById('registerModal').style.display = 'none';
                form.reset();
            }
        });
    });

    // 11. Link Find My Flight
    document.querySelector('.FMFlink').addEventListener('click', function(e) {
        e.preventDefault();
        setActiveTab('flights');
        window.scrollTo(0, 0);
    });

    // 12. User Dropdown 
    document.getElementById('menuBtn').addEventListener('click', function(e) {
        e.stopPropagation();
        const dropdown = document.getElementById('menuDropdown');
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        
        // Close Dropdown if open
        document.getElementById('userDropdown').classList.remove('show');
    });

    // 13. Logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        currentUser = null;
        updateUserUI();
        document.getElementById('userDropdown').classList.remove('show');
    });

    // 14. Close Dropdown when user clicks outside
    document.addEventListener('click', function(e) {
        const menuBtn = document.getElementById('menuBtn');
        const userMenuBtn = document.getElementById('userMenuBtn');
        
        // Hamburger menu
        if (e.target !== menuBtn && !e.target.closest('.menu-dropdown')) {
            document.getElementById('menuDropdown').style.display = 'none';
        }
        
        // User Dropdown
        if (e.target !== userMenuBtn && !e.target.closest('.user-dropdown')) {
            document.getElementById('userDropdown').classList.remove('show');
        }
    });

    // 15. Menu navigation
    document.querySelectorAll('.menu-option[data-tab]').forEach(option => {
        option.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            setActiveTab(tab);
            document.getElementById('menuDropdown').style.display = 'none';
        });
    });

    document.getElementById('helpOption').addEventListener('click', function() {
        document.getElementById('contactModal').style.display = 'flex';
        document.getElementById('menuDropdown').style.display = 'none';
    });

    // Function to update UI according to login status
    function updateUserUI() {
        const loginBtn = document.getElementById('loginRegisterBtn');
        const userDropdown = document.querySelector('.user-dropdown-container');
        
        if (currentUser) {
            loginBtn.style.display = 'none';
            userDropdown.style.display = 'flex';
            document.getElementById('usernameDisplay').textContent = currentUser.name;
        } else {
            loginBtn.style.display = 'flex';
            userDropdown.style.display = 'none';
        }
    }
    
    // Initialize User Interface 
    updateUserUI();
});

// Auxiliary functions
function setActiveTab(tabName) {
    document.querySelectorAll('.IconButton').forEach(tab => {
        tab.classList.remove('active-tab');
        tab.classList.add('NotHover');
    });
    
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    document.getElementById(`${tabName}Tab`).classList.add('active-tab');
    document.getElementById(`${tabName}Tab`).classList.remove('NotHover');
    document.getElementById(`${tabName}Content`).classList.add('active');
}

function addFlight() {
    let flightContainer = document.getElementById('flights');
    let newFlight = document.createElement('div');
    newFlight.classList.add('flight');
    newFlight.innerHTML = `
        <input type="text" placeholder="From">
        <input type="text" placeholder="To">
        <input type="date">
    `;
    flightContainer.appendChild(newFlight);
}

function showSearchResults(type) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('destinationsContent').classList.add('active');
    document.getElementById('destinationsContent').scrollIntoView({ behavior: 'smooth' });
}

function validateContactForm() {
    let isValid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const message = document.getElementById('message');

    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
    });

    if (name.value.trim() === '') {
        document.getElementById('nameError').textContent = 'Name is required';
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email';
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    }

    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(phone.value)) {
        document.getElementById('phoneError').textContent = 'Phone must have 9 digits';
        document.getElementById('phoneError').style.display = 'block';
        isValid = false;
    }

    if (message.value.trim() === '') {
        document.getElementById('messageError').textContent = 'Message is required';
        document.getElementById('messageError').style.display = 'block';
        isValid = false;
    }

    return isValid;
}

function validateAuthForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.style.border = '';
        if (!input.value.trim()) {
            input.style.border = '1px solid red';
            isValid = false;
        }
    });
    
    if (form.querySelector('input[type="email"]')) {
        const email = form.querySelector('input[type="email"]').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email');
            isValid = false;
        }
    }
    
    return isValid;
}