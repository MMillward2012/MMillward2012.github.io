/*!
* Start Bootstrap - Personal v1.0.1 (https://startbootstrap.com/template-overviews/personal)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-personal/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project


window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY < 20) {
            navbarCollapsible.classList.remove('navbar-shrink');
            navbarCollapsible.classList.remove('solid-nav'); // Remove solid navbar class when scrolled to the top
        } else {
            navbarCollapsible.classList.add('navbar-shrink');
            navbarCollapsible.classList.add('solid-nav'); // Add solid navbar class when scrolled down
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

document.getElementById("contactForm").addEventListener("submit", function(event) {
    // Prevent default form submission behavior
    event.preventDefault();

    // Serialize form data
    var formData = new FormData(this);

    // Send form data asynchronously using Fetch API
    fetch(this.action, {
        method: this.method,
        body: formData,
        headers: {
            "Accept": "application/json"
        }
    })
    .then(response => {
        if (response.ok) {
            // Show success message
            document.getElementById("submitSuccessMessage").classList.remove("d-none");
            // Optionally, clear the form fields
            this.reset();
        } else {
            // Show error message
            document.getElementById("submitErrorMessage").classList.remove("d-none");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Show error message
        document.getElementById("submitErrorMessage").classList.remove("d-none");
    });
});
