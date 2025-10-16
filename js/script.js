document.addEventListener("DOMContentLoaded", () => {
  const sections = document.getElementsByClassName("toggle-section");

  for (let section of sections) {
    const btn = section.querySelector(".toggle-btn");
    const details = section.querySelector(".details");

    // état initial
    details.style.display = "none";
    details.style.opacity = 0;
    details.style.height = "0px";

    btn.addEventListener("click", () => {
      // fermer les autres
      for (let other of sections) {
        if (other !== section) {
          closeSection(other);
        }
      }

      // toggle la section courante
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
    const steps = 20;
    const step = fullHeight / steps;
    const fadeStep = 1 / steps;

    const interval = setInterval(() => {
      height += step;
      opacity += fadeStep;
      details.style.height = height + "px";
      details.style.opacity = opacity;

      if (height >= fullHeight) {
        clearInterval(interval);
        details.style.height = "auto";
        details.style.opacity = 1;
      }
    }, 20);
  }

  function closeSection(section) {
    const btn = section.querySelector(".toggle-btn");
    const details = section.querySelector(".details");

    if (!section.classList.contains("open")) return;

    section.classList.remove("open");
    btn.textContent = "+";

    let height = details.scrollHeight || parseFloat(getComputedStyle(details).height);
    let opacity = 1;
    const steps = 20;
    const step = height / steps;
    const fadeStep = 1 / steps;

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
          details.style.opacity = 0;
        }, 50);
      }
    }, 20);
  }

  // Descriptions courtes pour les tooltips
  const descriptions = {
    "HTML": "Langage de balisage pour structurer le contenu web.",
    "CSS": "Feuilles de style pour la mise en forme et le layout.",
    "JavaScript": "Langage de programmation côté client (et serveur).",
    "Java": "Langage orienté objet, utilisé côté serveur.",
    "Python": "Langage polyvalent pour scripting et data.",
    "C/C++/C#": "Langages bas-niveau / orientés système et appli.",
    "React": "Bibliothèque JS pour construire des interfaces UI.",
    "Spring Boot": "Framework Java pour applications back-end.",
    "Laravel": "Framework PHP pour applications web.",
    "Git": "Système de contrôle de version distribué.",
    "Docker": "Conteneurisation d'applications.",
    "VS Code": "Éditeur de code moderne.",
    "Linux": "Système d'exploitation open-source."
  };

  // Prépare le tooltip
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
  tooltip.style.whiteSpace = "nowrap";
  tooltip.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";

  document.body.appendChild(tooltip);

  // Génère étoiles
  function genererEtoiles(niveau) {
    let etoiles = "";
    for (let i = 1; i <= 5; i++) {
      etoiles += (i <= niveau) ? "★" : "☆";
    }
    return etoiles;
  }

  // Charge les compétences depuis le JSON
  fetch('skills.json')
    .then(response => response.json())
    .then(data => {
      // Construit l'objet niveauxCompetences depuis le JSON
      const niveauxCompetences = {};
      for (let categorie in data) {
        Object.assign(niveauxCompetences, data[categorie]);
      }

      // Insère les étoiles
      ajouterEtoilesCompetences(niveauxCompetences);

      // Prépare les données pour l'histogramme
      const competencesData = [];
      for (let nom in niveauxCompetences) {
        competencesData.push({
          nom: nom,
          niveau: niveauxCompetences[nom]
        });
      }

      // Dessine l'histogramme
      dessinerHistogramme(competencesData);
    })
    .catch(error => {
      console.error('Erreur lors du chargement du fichier JSON:', error);
    });

  function ajouterEtoilesCompetences(niveauxCompetences) {
    const dds = document.querySelectorAll("#competences dd");

    dds.forEach(dd => {
      const competences = dd.textContent.split(",");
      dd.innerHTML = "";

      competences.forEach((comp) => {
        const nomComp = comp.trim();
        const niveau = niveauxCompetences[nomComp] || 0;
        
        const span = document.createElement("span");
        span.className = "competence-item";
        
        const nameNode = document.createElement("span");
        nameNode.className = "comp-name";
        nameNode.textContent = nomComp;

        const starsNode = document.createElement("span");
        starsNode.className = "etoiles";
        starsNode.textContent = genererEtoiles(niveau);

        const desc = descriptions[nomComp] || "";
        nameNode.setAttribute("data-description", desc);

        span.appendChild(nameNode);
        span.appendChild(document.createTextNode(" "));
        span.appendChild(starsNode);

        span.style.display = "inline-block";
        span.style.margin = "6px 10px";
        span.style.padding = "4px 8px";
        span.style.borderRadius = "4px";

        dd.appendChild(span);

        // Tooltip listeners
        nameNode.addEventListener("mouseenter", e => {
          const text = nameNode.getAttribute("data-description") || "";
          if (!text) return;
          tooltip.textContent = text;
          tooltip.style.display = "block";
          tooltip.style.left = (e.pageX + 12) + "px";
          tooltip.style.top = (e.pageY + 12) + "px";
        });

        nameNode.addEventListener("mousemove", e => {
          tooltip.style.left = (e.pageX + 12) + "px";
          tooltip.style.top = (e.pageY + 12) + "px";
        });

        nameNode.addEventListener("mouseleave", () => {
          tooltip.style.display = "none";
        });
      });
    });
  }
});

// Fonction pour dessiner l'histogramme
function dessinerHistogramme(competencesData) {
  const canvas = document.getElementById("competenceChart");
  if (!canvas) return;
  
  const ctx = canvas.getContext("2d");
  const largeurBarre = 30;
  const espacement = 15;
  const margeGauche = 60;
  const margeBas = 40;
  const hauteurMax = 220;

  let progression = 0;
  const fps = 30;
  const duree = 1500;
  const increment = 1000 / fps;
  const steps = duree / increment;

  function dessiner() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Axe X
    ctx.beginPath();
    ctx.moveTo(margeGauche, canvas.height - margeBas);
    ctx.lineTo(canvas.width - 20, canvas.height - margeBas);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();

    competencesData.forEach((comp, i) => {
      const x = margeGauche + i * (largeurBarre + espacement);
      const hauteur = (comp.niveau / 5) * hauteurMax * (progression / steps);
      const y = canvas.height - margeBas - hauteur;

      // Barre
      ctx.fillStyle = "#007acc";
      ctx.fillRect(x, y, largeurBarre, hauteur);

      // Nom
      ctx.save();
      ctx.translate(x + largeurBarre / 2, canvas.height - 10);
      ctx.rotate(-Math.PI / 4);
      ctx.textAlign = "right";
      ctx.fillStyle = "#333";
      ctx.font = "12px Montserrat";
      ctx.fillText(comp.nom, 0, 0);
      ctx.restore();

      // Niveau
      if (progression === steps) {
        ctx.fillStyle = "#000";
        ctx.font = "bold 12px Montserrat";
        ctx.fillText(comp.niveau, x + 8, y - 5);
      }
    });
  }

  // Animation
  setTimeout(() => {
    const interval = setInterval(() => {
      progression++;
      dessiner();

      if (progression >= steps) {
        clearInterval(interval);
        dessiner();
      }
    }, increment);
  }, 300);
}