document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Mobile Navigation Toggle (Burger Menu)
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');

  burger.addEventListener('click', () => {
    // Toggle Nav
    navLinks.classList.toggle('nav-active');
    
    // Burger Animation
    burger.classList.toggle('toggle');
  });

  // Close mobile nav when clicking a link
  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('nav-active')) {
        navLinks.classList.remove('nav-active');
        burger.classList.remove('toggle');
      }
    });
  });

  // 3. Active Nav Link Indicator on Scroll
  const sections = document.querySelectorAll('section');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinkItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // 4. Menu Filtering System
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      menuItems.forEach(item => {
        // Reset scale and opacity first for nice transition
        item.style.transform = 'scale(0.8)';
        item.style.opacity = '0';
        
        setTimeout(() => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = 'flex';
            // Trigger reflow to restart transition
            item.offsetHeight; 
            item.style.transform = 'scale(1)';
            item.style.opacity = '1';
          } else {
            item.style.display = 'none';
          }
        }, 300);
      });
    });
  });

  // 5. Reservation Form Handling
  const resForm = document.getElementById('res-form');
  const bookingSuccess = document.getElementById('booking-success');
  const resetBookingBtn = document.getElementById('reset-booking-btn');

  // Set min date of date picker to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  resForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get Form Values (for potential future API connection or storage)
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const guests = document.getElementById('guests').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const requests = document.getElementById('requests').value;

    const reservationData = { name, phone, email, guests, date, time, requests };
    
    // Save to local storage for simulation
    const bookings = JSON.parse(localStorage.getItem('aurelia_bookings') || '[]');
    bookings.push(reservationData);
    localStorage.setItem('aurelia_bookings', JSON.stringify(bookings));

    // Hide Form and Show Success Message with animation
    resForm.style.display = 'none';
    bookingSuccess.style.display = 'flex';
    
    // Smooth scroll to top of reservation section to see the success message
    document.getElementById('reservation').scrollIntoView({ behavior: 'smooth' });
  });

  resetBookingBtn.addEventListener('click', () => {
    // Reset Form
    resForm.reset();
    
    // Show Form and Hide Success Message
    resForm.style.display = 'grid';
    bookingSuccess.style.display = 'none';
  });

  // 6. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once revealed, no need to track it anymore
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
});
