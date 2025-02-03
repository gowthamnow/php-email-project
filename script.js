function myMenuFunction() {
    var menuBth = document.getElementById("myNavMenu");
    if (menuBth.className === "nav-menu") {
      menuBth.className += " responsive";
    } else {
      menuBth.className = "nav-menu";
    }
  }
  
  /* Dark mode */
  
  
  const toggleButton = document.querySelector(".toggle-button");
  const body = document.querySelector("body");
  
  
  toggleButton.addEventListener("click", () => {
    body.classList.toggle("dark");
  });
  
  
  /* Typing Effect */
  
  const typingEffect = new Typed(".typedText", {
    strings: ["Web Developer", "Embedded Tech Enthusiast", "PCB Designer"],
    loop: true,
    typeSpeed: 100,
    backSpeed: 80,
    backDelay: 1500,
  });
  
  /* Scroll Animation */
  
  const sr = ScrollReveal({
    origin: "top",
    distance: "80px",
    duration: 2000,
    reset: true,
  });
  
  sr.reveal(".featured-name", { delay: 100 });
  sr.reveal(".text-info", { delay: 200 });
  sr.reveal(".text-btn", { delay: 200 });
  sr.reveal(".social_icons", { delay: 200 });
  sr.reveal(".featured-image", { delay: 320 });
  
  sr.reveal(".project-box", { interval: 200 });
  
  sr.reveal(".top-header", {});
  
  const srLeft = ScrollReveal({
    origin: "left",
    distance: "80px",
    duration: 2000,
    reset: true,
  });
  
  srLeft.reveal(".about-info", { delay: 100 });
  srLeft.reveal(".contact-info", { delay: 200 });
  
  const srRight = ScrollReveal({
    origin: "right",
    distance: "80px",
    duration: 2000,
    reset: true,
  });
  
  srRight.reveal(".skill", { delay: 100 });
  srRight.reveal(".skill-box", { delay: 200 });
  
  /* Active Link */
  
  const sections = document.querySelectorAll("section[id]");
  
  function scrollActive() {
    const scrollY = window.scrollY;
  
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 50;
      const sectionId = current.getAttribute("id");
  
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document
          .querySelector(".nav-menu a[href*=" + sectionId + "]")
          .classList.add("active-link");
      } else {
        document
          .querySelector(".nav-menu a[href*=" + sectionId + "]")
          .classList.remove("active-link");
      }
    });
  }
  window.addEventListener("scroll", scrollActive);

  document.getElementById("contact-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevents page reload

    let formData = new FormData(this);

    try {
        let response = await fetch("send_email.php", { method: "POST", body: formData }); // Call PHP file

        let result = await response.text();
        console.log("Server Response:", result);
        document.getElementById("response-message").innerHTML = result;
    } catch (error) {
        console.error("Error:", error);
    }
});

  