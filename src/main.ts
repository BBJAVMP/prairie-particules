import "./style.css";

// Get a reference to the canvas element and its 2D rendering context
const canvas = document.querySelector<HTMLCanvasElement>("#particules-canvas")!;
const ctx = canvas.getContext("2d")!;

// Set the canvas size to match the window size
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// Function to generate a random number within a range
function getRandom(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Define a type for the Dot object
interface Dot {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  color: string;
}

// Define an array of dots with their initial properties
const dots: Dot[] = [];
const numDots = 60; // Number of dots

for (let i = 0; i < numDots; i++) {
  // Generate random properties for each dot
  const dot: Dot = {
    x: getRandom(0, width),
    y: getRandom(0, height),
    radius: getRandom(20, 50),
    speedX: getRandom(-2, 2),
    speedY: getRandom(-2, 2),
    color: getRandomColor(), // Use a function to get a random gradient color
  };

  dots.push(dot);
}

// Track the mouse position
let mouseX = 0;
let mouseY = 0;

// Flag to check if the left mouse button is pressed
let isMousePressed = false;

// Add event listeners to update mouse coordinates and the mouse press state
canvas.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

canvas.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    // Left mouse button is pressed
    isMousePressed = true;
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (e.button === 0) {
    // Left mouse button is released
    isMousePressed = false;

    // Reset dot speeds to random values
    for (const dot of dots) {
      dot.speedX = getRandom(-2, 2);
      dot.speedY = getRandom(-2, 2);
    }
  }
});

// Function to generate a random gradient color
function getRandomColor(): string {
  const hue = getRandom(0, 360); // Random hue value
  const saturation = 90; // Saturation value (adjust as needed)
  const lightness = 45; // Lightness value (adjust as needed)

  // Return an HSL color string
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function updateDots() {
  for (const dot of dots) {
    // Calculate the angle between the dot and the mouse
    const angle = Math.atan2(mouseY - dot.y, mouseX - dot.x);

    // Calculate the distance between the dot and the mouse
    const distance = Math.sqrt((mouseX - dot.x) ** 2 + (mouseY - dot.y) ** 2);

    // Adjust dot's speed based on the distance from the mouse
    if (isMousePressed) {
      dot.speedX = Math.cos(angle) * (distance * 0.001);
      dot.speedY = Math.sin(angle) * (distance * 0.001);
    }

    // Update dot positions
    dot.x += dot.speedX;
    dot.y += dot.speedY;

    // Check for collision with canvas boundaries
    if (dot.x + dot.radius >= canvas.width || dot.x - dot.radius <= 0) {
      dot.speedX *= -1; // Reverse the X direction
    }

    if (dot.y + dot.radius >= canvas.height || dot.y - dot.radius <= 0) {
      dot.speedY *= -1; // Reverse the Y direction
    }
  }
}

canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault(); // Prevent the default context menu from appearing

  // Get the current mouse coordinates
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  // Generate 5 new dots with the initial position at the mouse coordinates
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


function drawDots() {
  // Clear the canvas by drawing a black rectangle covering the entire canvas
  ctx.fillStyle = "#000000"; // Set the fill color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const dot of dots) {
    // Draw the dot with its assigned color
    ctx.fillStyle = dot.color;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function animate() {
  updateDots();
  drawDots();
  requestAnimationFrame(animate);
}

// Start the animation loop
animate();
