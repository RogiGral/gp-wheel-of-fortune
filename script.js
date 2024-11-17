// Define categories with initial questions and a property to track remaining questions
const categories = [
    { color: '#f82', label: 'Science', questions: ["What is gravity?", "Explain photosynthesis."], remainingQuestions: [] },
    { color: '#0bf', label: 'Math', questions: ["What is 2+2?", "Define algebra."], remainingQuestions: [] },
];

// Utility functions and constants
const rand = (m, M) => Math.random() * (M - m) + m;
const tot = categories.length; 
const spinEl = document.querySelector('#spin');
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
let dia = ctx.canvas.width;
const rad = dia / 2;
const TAU = 2 * Math.PI;
const arc = TAU / categories.length;

// Variables for spinning mechanics
let angVel = 0; // Angular velocity
let ang = 0; // Current angle in radians
const friction = 0.991; // Deceleration

// DOM element for questions
const wheelContainer = document.getElementById("wheel-container");
const questionsContainer = document.getElementById("questions-container");

// Get the current category index based on angle
const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;

// Draw each category on the wheel
function drawCategory(category, i) {
    const angStart = arc * i;
    ctx.beginPath();
    ctx.fillStyle = category.color;
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, rad, angStart, angStart + arc);
    ctx.lineTo(rad, rad);
    ctx.fill();

    // Draw text
    ctx.save();
    ctx.translate(rad, rad);
    ctx.rotate(angStart + arc / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(category.label, rad - 10, 10);
    ctx.restore();
}

// Rotate canvas and update the displayed category
function rotate() {
    const category = categories[getIndex()];
    ctx.canvas.style.transform = `rotate(${ang - Math.PI / 2}rad)`;
    spinEl.textContent = !angVel ? 'SPIN' : category.label;
    spinEl.style.background = category.color;
}

// Main animation loop for spinning
function frame() {
    if (!angVel) return; // Exit if no velocity
    angVel *= friction; // Apply friction
    if (angVel < 0.002) {
        angVel = 0; // Stop if very slow
        displayQuestions(); // Show questions when the wheel stops
    }
    ang += angVel; // Increment angle
    ang %= TAU; // Wrap angle within 0 to TAU
    rotate(); // Rotate canvas
}

// Start the animation
function engine() {
    frame();
    requestAnimationFrame(engine);
}

// Display questions for the selected category
function displayQuestions() {
    const category = categories[getIndex()];

    // Initialize remaining questions if not already done
    if (category.remainingQuestions.length === 0) {
        category.remainingQuestions = [...category.questions];
    }

    questionsContainer.innerHTML = `<h3>Questions for ${category.label}</h3>`; // Header for questions

    // Add each question with a reveal button and a placeholder
    category.remainingQuestions.forEach((question, index) => {
        const questionContainer = document.createElement("div");
        questionContainer.className = "question-container";

        // Placeholder text initially displayed
        const placeholderEl = document.createElement("div");
        placeholderEl.className = "placeholder";
        placeholderEl.textContent = `Q${index + 1}: Reveal Question`;
        
        // Button to reveal the question
        const revealButton = document.createElement("button");
        revealButton.textContent = "Reveal";
        revealButton.className = "reveal-button";
        
        // Question element, initially hidden
        const questionEl = document.createElement("div");
        questionEl.className = "question";
        questionEl.textContent = question;
        questionEl.style.display = "none"; // Initially hidden

        // Append elements to the question container
        questionContainer.appendChild(placeholderEl);
        questionContainer.appendChild(revealButton);
        questionContainer.appendChild(questionEl);
        questionsContainer.appendChild(questionContainer);

        // Event listener for the reveal button to show only the selected question
        revealButton.addEventListener("click", () => {
            // Hide all placeholders, buttons, and questions except the current one
            Array.from(questionsContainer.children).forEach((child) => {
                const isCurrent = child === questionContainer;
                const placeholder = child.querySelector(".placeholder");
                const button = child.querySelector(".reveal-button");
                const question = child.querySelector(".question");
        
                if (placeholder) {
                    placeholder.classList.toggle("disabled", !isCurrent);
                }
                
                if (button) {
                    button.disabled = !isCurrent; // Disable the button if it's not the current one
                    button.classList.toggle("disabled", !isCurrent); // Add a disabled class for styling
                }
        
                if (question) {
                    question.style.display = isCurrent ? "block" : "none"; // Only show the selected question
                }
            });
        });

        // Event listener for the question to return to the wheel and remove the question from the category's remaining questions
        questionEl.addEventListener("click", () => {
            // Remove the clicked question from the category's remaining questions
            const category = categories[getIndex()];
            category.remainingQuestions = category.remainingQuestions.filter(q => q !== question);

            questionContainer.remove(); // Permanently remove the question container from the DOM
            wheelContainer.style.display = "block"; // Show wheel
            questionsContainer.style.display = "none"; // Hide questions container
        });
    });


    // Hide the wheel and show the questions
    wheelContainer.style.display = "none";
    questionsContainer.style.display = "block";
}

// Set the canvas size based on the container size
function resizeCanvas() {
    const containerWidth = document.getElementById('wheel-container').offsetWidth;
    const containerHeight = document.getElementById('wheel-container').offsetHeight;

    canvas.width = containerWidth;
    canvas.height = containerHeight;

    // Recalculate radius and other dimensions based on new size
    dia = Math.min(containerWidth, containerHeight);
    rad = dia / 2;

    drawWheel(); // Redraw the wheel with new dimensions
}

// Initialize the wheel and event listeners
function init() {
    categories.forEach(drawCategory); // Draw initial wheel
    rotate(); // Initial position
    engine(); // Start animation loop

    // Spin the wheel on click
    spinEl.addEventListener('click', () => {
        if (!angVel) angVel = rand(0.25, 0.45); // Random initial velocity
    });
}

// Redraw the canvas on resize
window.addEventListener('resize', resizeCanvas);

// Initial setup
resizeCanvas();
init();
