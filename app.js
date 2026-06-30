document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // Supabase Database Integration Logic
  // ==========================================
  let supabase = null;

  // Initialize Supabase Client
  function initSupabase() {
    const sbUrl = localStorage.getItem('aurelia_supabase_url');
    const sbKey = localStorage.getItem('aurelia_supabase_key');
    const connStatus = document.getElementById('conn-status');

    if (sbUrl && sbKey && window.supabase) {
      try {
        // Create Supabase Client using CDN library
        supabase = window.supabase.createClient(sbUrl, sbKey);
        
        // Update connection UI
        connStatus.className = 'connection-status status-connected';
        connStatus.innerHTML = '<i class="fa-solid fa-circle-dot"></i> เชื่อมต่อ Supabase แล้ว';
      } catch (err) {
        console.error('Supabase Init Error:', err);
        supabase = null;
        connStatus.className = 'connection-status status-disconnected';
        connStatus.innerHTML = '<i class="fa-solid fa-circle-dot"></i> ข้อผิดพลาดการเชื่อมต่อ';
      }
    } else {
      supabase = null;
      connStatus.className = 'connection-status status-disconnected';
      connStatus.innerHTML = '<i class="fa-solid fa-circle-dot"></i> ไม่ได้เชื่อมต่อ (ใช้ Local Storage)';
    }
  }

  // Toast Notification Alert
  function showAlert(message, isError = false) {
    const banner = document.getElementById('alert-banner');
    const text = document.getElementById('alert-text');
    text.textContent = message;
    
    if (isError) {
      banner.style.borderColor = '#dc2626';
      banner.querySelector('i').className = 'fa-solid fa-circle-exclamation';
      banner.querySelector('i').style.color = '#f87171';
    } else {
      banner.style.borderColor = 'var(--gold-primary)';
      banner.querySelector('i').className = 'fa-solid fa-circle-check';
      banner.querySelector('i').style.color = 'var(--gold-primary)';
    }
    
    banner.classList.add('active');
    setTimeout(() => {
      banner.classList.remove('active');
    }, 4000);
  }

  // Initial load
  initSupabase();

  // Settings Modal Elements
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const supabaseForm = document.getElementById('supabase-config-form');
  const clearSbBtn = document.getElementById('clear-sb-btn');
  const sbUrlInput = document.getElementById('sb-url');
  const sbKeyInput = document.getElementById('sb-key');

  // Open Modal
  settingsBtn.addEventListener('click', () => {
    // Populate form fields with stored values
    sbUrlInput.value = localStorage.getItem('aurelia_supabase_url') || '';
    sbKeyInput.value = localStorage.getItem('aurelia_supabase_key') || '';
    
    settingsModal.classList.add('active');
  });

  // Close Modal
  function closeModal() {
    settingsModal.classList.remove('active');
  }

  modalCloseBtn.addEventListener('click', closeModal);
  
  // Close Modal when clicking outside the box
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      closeModal();
    }
  });

  // Save Settings
  supabaseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = sbUrlInput.value.trim();
    const key = sbKeyInput.value.trim();

    if (url && key) {
      localStorage.setItem('aurelia_supabase_url', url);
      localStorage.setItem('aurelia_supabase_key', key);
      
      initSupabase();
      closeModal();
      showAlert('บันทึกการตั้งค่าและเชื่อมต่อ Supabase สำเร็จ!');
    }
  });

  // Clear Settings
  clearSbBtn.addEventListener('click', () => {
    localStorage.removeItem('aurelia_supabase_url');
    localStorage.removeItem('aurelia_supabase_key');
    
    sbUrlInput.value = '';
    sbKeyInput.value = '';
    
    initSupabase();
    closeModal();
    showAlert('ล้างข้อมูลเชื่อมต่อ และเปลี่ยนกลับไปใช้ Local Storage สำรองแล้ว', true);
  });

  // ==========================================
  // Core Page Logic (Scroll, Filters, Booking)
  // ==========================================

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
    navLinks.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
  });

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
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      menuItems.forEach(item => {
        item.style.transform = 'scale(0.8)';
        item.style.opacity = '0';
        
        setTimeout(() => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = 'flex';
            item.offsetHeight; // Reflow trigger
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

  resForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get Form Values
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const guests = document.getElementById('guests').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const requests = document.getElementById('requests').value;

    const reservationData = { name, phone, email, guests, date, time, requests };
    
    let isSavedToSupabase = false;

    // Try to save to Supabase if connected
    if (supabase) {
      try {
        showAlert('กำลังส่งข้อมูลจองโต๊ะไปยัง Supabase...');
        const { data, error } = await supabase
          .from('bookings')
          .insert([reservationData]);

        if (error) {
          throw error;
        }

        isSavedToSupabase = true;
        showAlert('ข้อมูลจองโต๊ะบันทึกลงฐานข้อมูล Supabase สำเร็จ!');
      } catch (err) {
        console.error('Supabase insert failed:', err);
        showAlert('บันทึกลง Supabase ล้มเหลว! กำลังบันทึกสำรองในเครื่อง...', true);
      }
    }

    // Always fallback to Local Storage backup (or if Supabase is disconnected)
    const bookings = JSON.parse(localStorage.getItem('aurelia_bookings') || '[]');
    bookings.push({
      ...reservationData,
      saved_to_cloud: isSavedToSupabase,
      created_at: new Date().toISOString()
    });
    localStorage.setItem('aurelia_bookings', JSON.stringify(bookings));

    // Hide Form and Show Success Message
    resForm.style.display = 'none';
    bookingSuccess.style.display = 'flex';
    
    // Smooth scroll to top of reservation section to see success state
    document.getElementById('reservation').scrollIntoView({ behavior: 'smooth' });
  });

  resetBookingBtn.addEventListener('click', () => {
    resForm.reset();
    resForm.style.display = 'grid';
    bookingSuccess.style.display = 'none';
  });

  // 6. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
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
