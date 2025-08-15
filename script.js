 document.addEventListener("DOMContentLoaded", function () {
        new Typed("#typed", {
          strings: [
            "Frontend Developer",
            "UI / Interaction Designer",
            "Bug Resolver",
          ],
          typeSpeed: 60,
          backSpeed: 35,
          backDelay: 1000,
          loop: true,
          showCursor: false,
        });
      });


      const menuToggle = document.getElementById("menuToggle");
      const navMenu = document.getElementById("navMenu");
      let menuOpen = false;

      // Toggle menu on icon click
      menuToggle.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent outside click from firing
        menuOpen = !menuOpen;
        navMenu.classList.toggle("show", menuOpen);
        menuToggle.innerHTML = menuOpen
          ? '<i class="fa-solid fa-times"></i>'
          : '<i class="fa-solid fa-bars"></i>';
      });

      // Close menu when clicking a nav link
      navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          menuOpen = false;
          navMenu.classList.remove("show");
          menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
      });
      
      
      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (
          menuOpen &&
          !navMenu.contains(e.target) &&
          e.target !== menuToggle
        ) {
          menuOpen = false;
          navMenu.classList.remove("show");
          menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
      });


      /* ---------------------
       Reveal on scroll (IntersectionObserver)
       --------------------- */
      (function () {
        const items = document.querySelectorAll(".reveal");
        if (!("IntersectionObserver" in window)) {
          items.forEach((i) => i.classList.add("active"));
          return;
        }
        const obs = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("active");
                obs.unobserve(entry.target);
              }
            });
          },
          { root: null, rootMargin: "0px", threshold: 0.12 }
        );

        items.forEach((el, idx) => {
          el.style.transitionDelay = `${Math.min(0.12 * idx, 0.6)}s`;
          obs.observe(el);
        });
      })();

      /* ---------------------
       Active nav link on scroll + click (works with header links)
       --------------------- */
      (function () {
        const sections = document.querySelectorAll("main section[id]");
        const navLinks = document.querySelectorAll("header nav a");

        function setActiveHash(hash) {
          navLinks.forEach((a) =>
            a.classList.toggle("active", a.getAttribute("href") === `#${hash}`)
          );
        }

        // on scroll: find section in view
        window.addEventListener(
          "scroll",
          () => {
            let current = "home";
            sections.forEach((section) => {
              const top = section.getBoundingClientRect().top;
              if (top <= 120) {
                current = section.id;
              }
            });
            setActiveHash(current);
          },
          { passive: true }
        );

        (function () {
          const form = document.getElementById("contactForm");
          if (!form) return; // nothing to do if form not present

          const name = document.getElementById("name");
          const email = document.getElementById("email");
          const subject = document.getElementById("subject");
          const message = document.getElementById("message");

          const nameError = document.getElementById("nameError");
          const emailError = document.getElementById("emailError");
          const subjectError = document.getElementById("subjectError");
          const messageError = document.getElementById("messageError");

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          function showError(el, text) {
            if (!el) return;
            el.textContent = text;
            el.style.display = "block";
          }
          function hideError(el) {
            if (!el) return;
            el.style.display = "none";
          }

          // Live input handlers (remove / update error as user types)
          if (name)
            name.addEventListener("input", () => {
              if (name.value.trim() !== "") hideError(nameError);
            });
          if (subject)
            subject.addEventListener("input", () => {
              if (subject.value.trim() !== "") hideError(subjectError);
            });
          if (message)
            message.addEventListener("input", () => {
              if (message.value.trim() !== "") hideError(messageError);
            });

          if (email) {
            email.addEventListener("input", () => {
              const v = email.value.trim();
              if (v === "") {
                showError(emailError, "Email can't be empty");
              } else if (!emailRegex.test(v)) {
                showError(emailError, "Invalid email");
              } else {
                hideError(emailError);
              }
            });
          }

          form.addEventListener("submit", function (evt) {
            evt.preventDefault(); // stop the page from reloading / jumping

            // clear prior errors
            [nameError, emailError, subjectError, messageError].forEach(
              hideError
            );

            let valid = true;
            let firstInvalid = null;

            if (!name || name.value.trim() === "") {
              showError(nameError, "Name can't be empty");
              valid = false;
              firstInvalid = firstInvalid || name;
            }

            const emailVal = email ? email.value.trim() : "";
            if (!email || emailVal === "") {
              showError(emailError, "Email can't be empty");
              valid = false;
              firstInvalid = firstInvalid || email;
            } else if (!emailRegex.test(emailVal)) {
              showError(emailError, "Invalid email");
              valid = false;
              firstInvalid = firstInvalid || email;
            }

            if (!subject || subject.value.trim() === "") {
              showError(subjectError, "Subject can't be empty");
              valid = false;
              firstInvalid = firstInvalid || subject;
            }

            if (!message || message.value.trim() === "") {
              showError(messageError, "Message can't be empty");
              valid = false;
              firstInvalid = firstInvalid || message;
            }

            if (!valid) {
              if (firstInvalid && typeof firstInvalid.focus === "function")
                firstInvalid.focus();
              return;
            }

            // success - show SweetAlert2 if loaded, otherwise fallback alert
            if (window.Swal && typeof Swal.fire === "function") {
              Swal.fire({
                icon: "success",
                title: "Message Sent",
                text: "Thanks for reaching out — I will reply as soon as possible.",
                confirmButtonColor: "#00a9ad",
              }).then(() => form.reset());
            } else {
              alert("Message sent — thanks!");
              form.reset();
            }
          });
        })();

        // smooth scroll offset and set active on click
        navLinks.forEach((link) => {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            const href = link.getAttribute("href");
            const targetId = href.replace("#", "");
            const targetEl = document.getElementById(targetId);
            if (!targetEl) return;
            const headerOffset =
              document.querySelector("header").offsetHeight + 8;
            const top =
              targetEl.getBoundingClientRect().top +
              window.scrollY -
              headerOffset;
            window.scrollTo({ top, behavior: "smooth" });
            // set active immediately
            navLinks.forEach((a) => a.classList.remove("active"));
            link.classList.add("active");
          });
        });
      })();
      navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          navLinks.classList.remove("show");
        });
      });

      (function () {
        const dl = document.getElementById("downloadCV");
        dl.addEventListener("click", function (e) {
          if (dl.getAttribute("href") === "#") {
            e.preventDefault();
            Swal.fire({
              icon: "info",
              title: "No CV yet",
              text: "Add your CV by replacing the href on the Download CV button.",
              confirmButtonColor: "#00a9ad",
            });
          }
        });
      })();

      document.getElementById('chatbot-icon').addEventListener('click', () => {
  document.getElementById('chatbot').style.display = 'flex';
  document.getElementById('chatbot-icon').style.display = 'none';
});

document.getElementById('close-chatbot').addEventListener('click', () => {
  document.getElementById('chatbot').style.display = 'none';
  document.getElementById('chatbot-icon').style.display = 'flex';
});

document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const input = document.getElementById('chatbot-input');
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  input.value = '';

  // Simple bot responses
  setTimeout(() => {
    let botReply = '';
    if (message.toLowerCase().includes('skills')) {
      botReply = "I’m skilled in HTML, CSS, JavaScript, React, Bootstrap, Git & GitHub.";
    } else if (message.toLowerCase().includes('projects')) {
      botReply = "I've built a portfolio, MovieLab app, and a text-to-speech converter.";
    } else if (message.toLowerCase().includes('about')) {
      botReply = "I’m Younis, a passionate frontend developer who loves creating beautiful websites.";
    } else {
      botReply = "I’m not sure about that, but I can tell you about my skills, projects, or experience.";
    }
    addMessage(botReply, 'bot');
  }, 500);
}

function addMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  msgDiv.textContent = text;
  document.getElementById('chatbot-body').appendChild(msgDiv);
  document.getElementById('chatbot-body').scrollTop = document.getElementById('chatbot-body').scrollHeight;
}

// Get elements

