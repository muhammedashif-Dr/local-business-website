const API_URL = 'https://local-business-website.onrender.com/api';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // ==========================================================================
  // Header / Sticky Navbar & Mobile Toggle
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const menuIcon = document.getElementById('menu-icon');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const isMenuOpen = navMenu.classList.contains('active');
    
    // Toggle menu icon between menu and x
    if (isMenuOpen) {
      menuIcon.setAttribute('data-lucide', 'x');
    } else {
      menuIcon.setAttribute('data-lucide', 'menu');
    }
    lucide.createIcons();
  });

  // Close mobile menu when a link is clicked
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuIcon.setAttribute('data-lucide', 'menu');
      lucide.createIcons();
    });
  });

  // ==========================================================================
  // Scroll Reveal Animations & Active Navbar Highlight
  // ==========================================================================
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const sections = document.querySelectorAll('section');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // IntersectionObserver for highlighting active menu item
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-20% 0px -60% 0px'
  });

  sections.forEach(sec => sectionObserver.observe(sec));

  // ==========================================================================
  // Interactive Product Filtering
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class on buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Hide with fade animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';

        setTimeout(() => {
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'flex';
            // Trigger browser reflow to enable transition
            card.offsetHeight; 
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.display = 'none';
          }
        }, 300);
      });
    });
  });

  // ==========================================================================
  // Product Quick View Modal & Data
  // ==========================================================================
  const productsData = {
    1: {
      title: "Ember Midi Linen Dress",
      price: "$128.00",
      material: "100% French Linen",
      image: "assets/product_dress.png",
      description: "Our signature piece. Crafted from lightweight, highly breathable French flax linen, the Ember dress features an elegant midi cut, an adjustable tie-back waistband, and functional deep side pockets. Pre-washed for exceptional softness and dyed using organic plant-based rust pigments."
    },
    2: {
      title: "Sage Utility Canvas Jacket",
      price: "$145.00",
      material: "Organic Cotton Canvas",
      image: "assets/product_jacket.png",
      description: "A durable yet soft transition jacket. Made from GOTS-certified organic cotton canvas, this workwear-inspired jacket features four utility pockets, double-stitched seams, and wooden tagua-nut buttons. Perfect for layering in the breezy Pacific Northwest climate."
    },
    3: {
      title: "Market Canvas Tote & Slide Set",
      price: "$110.00",
      material: "Recycled Cotton & Veg Leather",
      image: "assets/product_accessories.png",
      description: "The ultimate minimalist summer accessory set. Includes our oversized thick organic canvas shopper tote (featuring solid brass internal key ring holder) and vegetable-tanned leather slide sandals with padded cork soles. Locally crafted in Portland."
    },
    4: {
      title: "Linen Lounge Modular Set",
      price: "$165.00",
      material: "Organic Linen-Tencel Blend",
      image: "assets/about_fabrics.png",
      description: "Relaxed comfort redefined. This modular two-piece set is woven with 60% organic flax linen and 40% Tencel lyocell. Unbelievably soft, temperature-regulating, and tailored with an elastic drawstring waist and relaxed drop shoulders."
    }
  };

  const modal = document.getElementById('product-modal');
  const modalClose = document.querySelector('.modal-close');
  const modalImg = document.getElementById('modal-product-img');
  const modalMaterial = document.getElementById('modal-product-material');
  const modalTitle = document.getElementById('modal-product-title');
  const modalPrice = document.getElementById('modal-product-price');
  const modalDesc = document.getElementById('modal-product-description');

  const openModal = (id) => {
    const product = productsData[id];
    if (!product) return;

    modalImg.src = product.image;
    modalImg.alt = product.title;
    modalMaterial.textContent = product.material;
    modalTitle.textContent = product.title;
    modalPrice.textContent = product.price;
    modalDesc.textContent = product.description;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Add click events to quick view buttons
  document.querySelectorAll('.product-card').forEach(card => {
    const id = card.getAttribute('data-id');
    const quickViewBtn = card.querySelector('.quick-view-btn');
    if (quickViewBtn) {
      quickViewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(id);
      });
    }
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // ==========================================================================
  // Leaflet Interactive Map Setup
  // ==========================================================================
  const boutiqueLat = 45.5264;
  const boutiqueLng = -122.6987; // coordinates for 720 NW 23rd Ave, Portland, OR 97210
  
  try {
    // Initialize map
    const map = L.map('map-container', {
      scrollWheelZoom: false
    }).setView([boutiqueLat, boutiqueLng], 15);

    // Modern styled map tiles: CartoDB Positron (light & clean) matches the boutique design
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Custom map pin (terracotta color)
    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `<div style="
        width: 14px; 
        height: 14px; 
        background-color: hsl(14, 45%, 48%); 
        border: 3px solid #FFF; 
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    // Add marker
    L.marker([boutiqueLat, boutiqueLng], { icon: customIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 5px;">
          <h4 style="margin: 0 0 4px; font-family: 'Italiana', serif; font-size: 1.1rem; color: hsl(14, 45%, 48%)">LOOM & THREAD</h4>
          <p style="margin: 0; font-size: 0.75rem; color: #666;">720 NW 23rd Ave, Portland, OR</p>
        </div>
      `)
      .openPopup();
  } catch (error) {
    console.error("Map initialization failed. Leaflet script may not have loaded.", error);
    // Fallback indicator
    const mapDiv = document.getElementById('map-container');
    if (mapDiv) {
      mapDiv.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 20px; color: #888;">
          <i data-lucide="map-pin" style="width: 48px; height: 48px; color: hsl(14, 45%, 48%); margin-bottom: 10px;"></i>
          <h4>720 NW 23rd Ave, Portland, OR 97210</h4>
          <p style="font-size: 0.8rem; margin-top: 5px;">Interactive map could not load, please verify internet connection.</p>
        </div>
      `;
      lucide.createIcons();
    }
  }

  // ==========================================================================
  // Portal / Admin / Customer Appointment Flow
  // ==========================================================================
  const toast = document.getElementById('toast-notification');
  const portalAuthSection = document.getElementById('portal-auth-section');
  const portalDashboard = document.getElementById('portal-dashboard');
  const portalStatus = document.getElementById('portal-status');
  const portalHeading = document.getElementById('portal-heading');
  const portalAppointmentsList = document.getElementById('portal-appointments-list');
  const portalSummary = document.getElementById('portal-summary');
  const logoutBtn = document.getElementById('portal-logout-btn');

  const renderAppointments = async (role, userEmail = '') => {
    portalAppointmentsList.innerHTML = '<p>Loading appointments...</p>';

    try {
      const response = await fetch(`${API_URL}/bookings?role=${role === 'admin' ? 'admin' : 'customer'}&email=${encodeURIComponent(userEmail)}`);
      const bookings = await response.json();

      portalSummary.innerHTML = `
        <div class="portal-summary-card">
          <span>Total Appointments</span>
          <strong>${bookings.length}</strong>
        </div>
        <div class="portal-summary-card">
          <span>Upcoming</span>
          <strong>${bookings.filter(b => new Date(b.date) >= new Date(new Date().toDateString())).length}</strong>
        </div>
        <div class="portal-summary-card">
          <span>Customer Count</span>
          <strong>${new Set(bookings.map(b => b.email)).size}</strong>
        </div>
      `;

      if (!bookings.length) {
        portalAppointmentsList.innerHTML = '<p>No appointments found.</p>';
        return;
      }

      const table = document.createElement('table');
      table.className = 'portal-table';
      table.innerHTML = `
        <thead>
          <tr>
            <th>Customer</th>
            <th>Email</th>
            <th>Date</th>
            <th>Time</th>
            <th>Phone</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${bookings.map(booking => `
            <tr>
              <td>${booking.name}</td>
              <td>${booking.email}</td>
              <td>${booking.date}</td>
              <td>${booking.time}</td>
              <td>${booking.phone}</td>
              <td>${booking.notes || '—'}</td>
            </tr>
          `).join('')}
        </tbody>
      `;

      portalAppointmentsList.innerHTML = '';
      portalAppointmentsList.appendChild(table);
    } catch (error) {
      console.error(error);
      portalAppointmentsList.innerHTML = '<p>Unable to load appointments.</p>';
    }
  };

  const showPortalDashboard = (role, label) => {
    portalAuthSection.style.display = 'none';
    portalDashboard.classList.add('active');
    portalStatus.textContent = `${label} signed in.`;
    portalHeading.textContent = role === 'admin' ? 'All Customer Appointments' : 'Your Appointments';
  };

  const hidePortalDashboard = () => {
    portalAuthSection.style.display = 'block';
    portalDashboard.classList.remove('active');
    portalStatus.textContent = 'You are not signed in.';
    portalHeading.textContent = 'Appointments';
    portalAppointmentsList.innerHTML = '';
  };

  const restorePortalSession = () => {
    const session = JSON.parse(localStorage.getItem('loom_thread_session') || 'null');
    if (!session) {
      hidePortalDashboard();
      return;
    }

    if (session.role === 'admin') {
      showPortalDashboard('admin', 'Admin');
      renderAppointments('admin');
    } else {
      showPortalDashboard('customer', session.name);
      renderAppointments('customer', session.email);
    }
  };

  const customerSignupForm = document.getElementById('customer-signup-form');
  const customerLoginForm = document.getElementById('customer-login-form');
  const adminLoginForm = document.getElementById('admin-login-form');

  if (customerSignupForm) {
    customerSignupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(customerSignupForm);
      const payload = {
        name: formData.get('name').toString().trim(),
        email: formData.get('email').toString().trim().toLowerCase(),
        password: formData.get('password').toString()
      };

      try {
        const response = await fetch(`${API_URL}/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (!response.ok) {
          showToast('Signup Failed', result.message || 'Unable to create account.');
          return;
        }

        localStorage.setItem('loom_thread_session', JSON.stringify({ name: result.user.name, email: result.user.email, role: result.user.role }));
        customerSignupForm.reset();
        showPortalDashboard('customer', result.user.name);
        renderAppointments('customer', result.user.email);
        showToast('Account Created', `Welcome ${result.user.name}. You can now view your appointments.`);
      } catch (error) {
        console.error(error);
        showToast('Signup Failed', 'Server error.');
      }
    });
  }

  if (customerLoginForm) {
    customerLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(customerLoginForm);
      const payload = {
        email: formData.get('email').toString().trim().toLowerCase(),
        password: formData.get('password').toString()
      };

      try {
        const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (!response.ok) {
          showToast('Login Failed', result.message || 'Unable to log in.');
          return;
        }

        localStorage.setItem('loom_thread_session', JSON.stringify({ name: result.user.name, email: result.user.email, role: result.user.role }));
        customerLoginForm.reset();
        showPortalDashboard('customer', result.user.name);
        renderAppointments('customer', result.user.email);
        showToast('Welcome Back', `Hello ${result.user.name}, here are your appointments.`);
      } catch (error) {
        console.error(error);
        showToast('Login Failed', 'Server error.');
      }
    });
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(adminLoginForm);
      const email = formData.get('email').toString().trim();
      const password = formData.get('password').toString();

      try {
        const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const result = await response.json();

        if (!response.ok) {
          showToast('Admin Login Failed', result.message || 'Incorrect admin credentials.');
          return;
        }

        if (result.user.role === 'admin') {
          localStorage.setItem('loom_thread_session', JSON.stringify({ name: result.user.name, email: result.user.email, role: result.user.role }));
          adminLoginForm.reset();
          showPortalDashboard('admin', 'Admin');
          renderAppointments('admin');
          showToast('Admin Access', 'You can now view all customer appointments.');
        } else {
          showToast('Admin Login Failed', 'Incorrect admin credentials.');
        }
      } catch (error) {
        console.error(error);
        showToast('Admin Login Failed', 'Server error.');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('loom_thread_session');
      hidePortalDashboard();
      showToast('Signed Out', 'You have been logged out.');
    });
  }

  restorePortalSession();

  // ==========================================================================
  // Form Submission Handlers & Toast Notification
  // ==========================================================================
  const toastTitle = document.getElementById('toast-title');
  const toastBody = document.getElementById('toast-body');

  const showToast = (title, message) => {
    toastTitle.textContent = title;
    toastBody.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  };

  // Stylist Booking Form
  const bookingForm = document.getElementById('stylist-booking-form');
  if (bookingForm) {
    // Set min date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }

    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(bookingForm);
      const bookingData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        date: formData.get('date'),
        time: formData.get('time'),
        notes: formData.get('notes')
      };

      try {
        const response = await fetch(`${API_URL}/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData)
        });
        const result = await response.json();

        if (response.ok) {
          showToast('Booking Successful', 'Your appointment has been reserved!');
          bookingForm.reset();
        } else {
          showToast('Booking Failed', result.message || 'Something went wrong.');
        }
      } catch (error) {
        console.error(error);
        showToast('Booking Failed', 'Server error.');
      }
    });
  }

  // Newsletter Sign-up
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const email = emailInput.value;

      // Store newsletter lead
      const currentNewsletter = JSON.parse(localStorage.getItem('newsletter_leads') || '[]');
      currentNewsletter.push({ email, subscribedAt: new Date().toISOString() });
      localStorage.setItem('newsletter_leads', JSON.stringify(currentNewsletter));

      // Show toast
      showToast(
        "Welcome to the Club!", 
        "Check your inbox. Your 10% discount code has been sent!"
      );

      // Reset form
      emailInput.value = '';
    });
  }
});
