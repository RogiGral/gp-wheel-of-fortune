// Define categories with initial questions and a property to track remaining questions
const categories = [
    { color: '#f82', label: 'Science', questions: ["What is gravity?", "Explain photosynthesis."], remainingQuestions: [] },
    { color: '#0bf', label: 'Math', questions: ["What is 2+2?", "Define algebra."], remainingQuestions: [] },
    { color: '#fb0', label: 'History', questions: ["Who was Napoleon?", "Explain the Cold War."], remainingQuestions: [] },
    { color: '#0fb', label: 'Geography', questions: ["What is the capital of France?", "Describe the Sahara desert."], remainingQuestions: [] },
    { color: '#b0f', label: 'Literature', questions: ["Who wrote '1984'?", "Define poetry."], remainingQuestions: [] },
    { color: '#f0b', label: 'Physics', questions: ["Define force.", "What is acceleration?"], remainingQuestions: [] },
    { color: '#bf0', label: 'Biology', questions: ["What is a cell?", "Describe DNA."], remainingQuestions: [] }
  ];
  
  // Utility functions and constants
  const rand = (m, M) => Math.random() * (M - m) + m;
  const tot = categories.length; // Total categories
  const spinEl = document.querySelector('#spin');
  const ctx = document.querySelector('#wheel').getContext('2d');
  const dia = ctx.canvas.width;
  const rad = dia / 2;
  const TAU = 2 * Math.PI; // Full circle in radians
  const arc = TAU / categories.length; // Angle per category
  
  // Variables for spinning mechanics
  let angVel = 0; // Angular velocity
  let ang = 0; // Current angle in radians
  const friction = 0.991; // Deceleration
  
  // DOM element for questions
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
  
    // Add each question as a clickable div
    category.remainingQuestions.forEach((question, index) => {
      const questionEl = document.createElement("div");
      questionEl.className = "question";
      questionEl.textContent = `Q${index + 1}: ${question}`;
      questionEl.addEventListener("click", () => {
        questionEl.style.display = "none"; // Hide question on click
  
        // Remove the question from remaining questions
        category.remainingQuestions = category.remainingQuestions.filter(q => q !== question);
      });
      questionsContainer.appendChild(questionEl);
    });
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
  
  init();
  