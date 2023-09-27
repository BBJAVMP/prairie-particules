import "./style.css";

// creation canva en 2d 
const canvas = document.querySelector<HTMLCanvasElement>("#particules-canvas")!;
const ctx = canvas.getContext("2d")!;

// mise en place du canva en plein écran
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// fonction de génération aléatoire
function getRandom(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// definition des points
interface Dot {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  color: string;
}

// tableau de points
const dots: Dot[] = [];
const numDots = 20; // nombre de points

for (let i = 0; i < numDots; i++) {
  // proprietes aleatoires des points
  const dot: Dot = {
    x: getRandom(0, width),
    y: getRandom(0, height),
    radius: getRandom(20, 50),
    speedX: getRandom(-2, 2),
    speedY: getRandom(-2, 2),
    color: getRandomColor(), 
  };

  dots.push(dot);
}

// position de la souris
let mouseX = 0;
let mouseY = 0;

// fonction clic gauche non pressée
let isMousePressed = false;

// creation d'evenement pour le mouvement de la souris
canvas.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

canvas.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    // bouton gauche pressé
    isMousePressed = true;
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (e.button === 0) {
    // bouton gauche relaché = fin d'evenement
    isMousePressed = false;

    // Vitesse des points dans un intervalle pre defini
    for (const dot of dots) {
      dot.speedX = getRandom(4, 10);
      dot.speedY = getRandom(4, 10);
    }
  }
});

// creation d'une valeur aleatoire des couleurs
function getRandomColor(): string {
  const hue = getRandom(0, 360); 
  const saturation = 90; 
  const lightness = 45; 

  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function updateDots() {
  for (const dot of dots) {
    // calcul angle entr points et position de la souris
    const angle = Math.atan2(mouseY - dot.y, mouseX - dot.x);

    // calcul distance entr points et position de la souris
    const distance = Math.sqrt((mouseX - dot.x) ** 2 + (mouseY - dot.y) ** 2);

    // vitesse des points en fonction de la distance avec la souris
    if (isMousePressed) {
      dot.speedX = Math.cos(angle) * (distance * 0.001);
      dot.speedY = Math.sin(angle) * (distance * 0.001);
    }

    // faire bouger les points
    dot.x += dot.speedX;
    dot.y += dot.speedY;

    // generation des collisions
    if (dot.x + dot.radius >= canvas.width || dot.x - dot.radius <= 0) {
      dot.speedX *= -1; // opposer la direction x
    }

    if (dot.y + dot.radius >= canvas.height || dot.y - dot.radius <= 0) {
      dot.speedY *= -1; // opposer la direction y
    }
  }
}

function drawDots() {
  // couleur noir du canva 
  ctx.fillStyle = "#000000"; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const dot of dots) { // couleur des points et lancement beginpath
    
    ctx.fillStyle = dot.color;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault(); // fonction preventive 

  // capture des coordonnees de la souris
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  // generation de points en fonction de la position de la souris
  for (let i = 0; i < 5; i++) {
    const dot: Dot = {
      x: mouseX,
      y: mouseY,
      radius: getRandom(20, 50),
      speedX: getRandom(-2, 2),
      speedY: getRandom(-2, 2),
      color: getRandomColor(),
    };
    dots.push(dot);
  }
});

// correction de la collision
function handleDotCollisions() {
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dot1 = dots[i];
      const dot2 = dots[j];
      const dx = dot2.x - dot1.x;
      const dy = dot2.y - dot1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < dot1.radius + dot2.radius) {
        // proprietes de demarrage de la collision
        const angle = Math.atan2(dy, dx);
        const overlap = dot1.radius + dot2.radius - distance;
        const splitx = (overlap / 2) * (dx / distance);
        const splity = (overlap / 2) * (dy / distance);

        dot1.x -= splitx;
        dot1.y -= splity;
        dot2.x += splitx;
        dot2.y += splity;

        // relance des positions apres collision
        /* Est-ce que la presence d'une gestion de collision puis d'une
        correction de collision serait propice a une generation de friction
        du au double calcul effectue?*/
        const offsetX = (overlap / 2) * Math.cos(angle);
        const offsetY = (overlap / 2) * Math.sin(angle);

        dot1.x -= offsetX;
        dot1.y -= offsetY;
        dot2.x += offsetX;
        dot2.y += offsetY;

        // mise a jour de la velocite en fonction de la vitesse d'impact
        const angle1 = Math.atan2(dot1.speedY, dot1.speedX);
        const angle2 = Math.atan2(dot2.speedY, dot2.speedX);
        const magnitude1 = Math.sqrt(dot1.speedX ** 2 + dot1.speedY ** 2);
        const magnitude2 = Math.sqrt(dot2.speedX ** 2 + dot2.speedY ** 2);

        const newSpeedX1 = magnitude1 * Math.cos(angle1 - angle) * Math.cos(angle) + magnitude2 * Math.sin(angle2 - angle) * Math.cos(angle + Math.PI / 2);
        const newSpeedY1 = magnitude1 * Math.cos(angle1 - angle) * Math.sin(angle) + magnitude2 * Math.sin(angle2 - angle) * Math.sin(angle + Math.PI / 2);
        const newSpeedX2 = magnitude1 * Math.sin(angle1 - angle) * Math.cos(angle + Math.PI / 2) + magnitude2 * Math.cos(angle2 - angle) * Math.cos(angle);
        const newSpeedY2 = magnitude1 * Math.sin(angle1 - angle) * Math.sin(angle + Math.PI / 2) + magnitude2 * Math.cos(angle2 - angle) * Math.sin(angle);

        dot1.speedX = newSpeedX1;
        dot1.speedY = newSpeedY1;
        dot2.speedX = newSpeedX2;
        dot2.speedY = newSpeedY2;
      }
    }
  }
}




function animate() {
  updateDots();
  handleDotCollisions();
  drawDots();
  requestAnimationFrame(animate);
}


animate();
