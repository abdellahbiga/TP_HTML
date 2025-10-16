document.addEventListener("DOMContentLoaded", () => {
  const sections = document.getElementsByClassName("toggle-section");

  for (let section of sections) {
    const btn = section.querySelector(".toggle-btn");
    const details = section.querySelector(".details");

    details.style.display = "none";
    details.style.opacity = 0;
    details.style.height = "0px";

    btn.addEventListener("click", () => {
      for (let other of sections) {
        if (other !== section) {
          closeSection(other);
        }
      }

      if (section.classList.contains("open")) {
        closeSection(section);
      } else {
        openSection(section);
      }
    });
  }

  function openSection(section) {
    const btn = section.querySelector(".toggle-btn");
    const details = section.querySelector(".details");

    section.classList.add("open");
    btn.textContent = "−";
    details.style.display = "block";

    let height = 0;
    let opacity = 0;
    const fullHeight = details.scrollHeight;
    const step = fullHeight / 20;
    const fadeStep = 1 / 20;

    const interval = setInterval(() => {
      height += step;
      opacity += fadeStep;
      details.style.height = height + "px";
      details.style.opacity = opacity;

      if (height >= fullHeight) {
        clearInterval(interval);
        details.style.height = "auto";
      }
    }, 20);
  }

  function closeSection(section) {
    const btn = section.querySelector(".toggle-btn");
    const details = section.querySelector(".details");

    if (!section.classList.contains("open")) return;

    section.classList.remove("open");
    btn.textContent = "+";

    let height = details.scrollHeight;
    let opacity = 1;
    const step = height / 20;
    const fadeStep = 1 / 20;

    const interval = setInterval(() => {
      height -= step;
      opacity -= fadeStep;
      details.style.height = Math.max(height, 0) + "px";
      details.style.opacity = Math.max(opacity, 0);

      if (height <= 0) {
        clearInterval(interval);
        setTimeout(() => {
          details.style.display = "none";
          details.style.height = "0px";
        }, 50);
      }
    }, 20);
  }

  
  const skills = document.querySelectorAll("#competences li span");
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.style.position = "absolute";
  tooltip.style.background = "#222";
  tooltip.style.color = "#fff";
  tooltip.style.padding = "6px 10px";
  tooltip.style.borderRadius = "6px";
  tooltip.style.fontSize = "0.9em";
  tooltip.style.pointerEvents = "none";
  tooltip.style.display = "none";
  tooltip.style.zIndex = 1000;

  document.body.appendChild(tooltip);

  skills.forEach(skill => {
    skill.addEventListener("mouseenter", e => {
      const desc = skill.getAttribute("data-description");
      tooltip.textContent = desc;
      tooltip.style.display = "block";
    });

    skill.addEventListener("mousemove", e => {
      tooltip.style.left = e.pageX + 15 + "px";
      tooltip.style.top = e.pageY + 15 + "px";
    });

    skill.addEventListener("mouseleave", e => {
      tooltip.style.display = "none";
    });
  });
});
