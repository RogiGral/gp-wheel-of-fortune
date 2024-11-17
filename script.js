// Categories and questions
const categories = {
    "Science": ["What is gravity?", "Explain photosynthesis.", "What is an atom?"],
    "Math": ["What is 2+2?", "Explain Pythagorean theorem.", "What is calculus?"],
    "History": ["Who was Napoleon?", "What was the Cold War?", "Describe the Roman Empire."]
  };
  
  // DOM Elements
  const wheelView = document.getElementById("wheel-view");
  const questionView = document.getElementById("question-view");
  const categoryTitle = document.getElementById("category-title");
  const questionsContainer = document.getElementById("questions-container");
  const spinButton = document.getElementById("spin-button");
  const backToWheelButton = document.getElementById("back-to-wheel");
  const canvas = document.getElementById("wheel-canvas");
  const ctx = canvas.getContext("2d");
  
  // Wheel settings
  const categoryNames = Object.keys(categories);
  const numCategories = categoryNames.length;
  const arcSize = (2 * Math.PI) / numCategories;
  let angle = 0;
  let spinning = false;
  let spinVelocity = 0;
  
  // Draw the wheel with categories
  function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    categoryNames.forEach((category, i) => {
      const startAngle = i * arcSize;
      const endAngle = startAngle + arcSize;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, startAngle, endAngle);
      ctx.fillStyle = i % 2 === 0 ? "#ffcc66" : "#66b2ff"; // Alternate colors
      ctx.fill();
      ctx.stroke();
  
      // Add category text
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(startAngle + arcSize / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "black";
      ctx.font = "bold 14px Arial";
      ctx.fillText(category, canvas.width / 2 - 10, 10);
      ctx.restore();
    });
  }
  
  // Spin the wheel
  function spinWheel() {
    if (spinning) return; // Prevent multiple spins at once
  
    spinning = true;
    spinVelocity = Math.random() * 0.3 + 0.3; // Random initial speed
    requestAnimationFrame(animateSpin);
  }
  
  // Spin animation loop
  function animateSpin() {
    if (spinVelocity > 0.01) {
      angle += spinVelocity; // Update angle
      spinVelocity *= 0.98; // Slow down over time
      angle %= 2 * Math.PI; // Keep angle within bounds
  
      drawWheel();
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angle);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
      ctx.restore();
  
      requestAnimationFrame(animateSpin);
    } else {
      spinning = false;
      selectCategory();
    }
  }
  
  // Determine selected category based on stopping angle
  function selectCategory() {
    const selectedCategoryIndex = Math.floor(numCategories - (angle / arcSize) % numCategories) % numCategories;
    const selectedCategory = categoryNames[selectedCategoryIndex];
    showQuestions(selectedCategory);
  }
  
  // Display the questions for the selected category
  function showQuestions(category) {
    categoryTitle.textContent = category;
    questionsContainer.innerHTML = ""; // Clear previous questions
    categories[category].forEach((question, index) => {
      const questionElement = document.createElement("div");
      questionElement.className = "question";
      questionElement.textContent = `Q${index + 1}: ${question}`;
      questionElement.onclick = () => {
        questionElement.style.display = "none"; // Hide question when clicked
      };
      questionsContainer.appendChild(questionElement);
    });
    // Show question view, hide wheel view
    wheelView.style.display = "none";
    questionView.style.display = "block";
  }
  
  // Go back to the wheel view
  function goBackToWheel() {
    wheelView.style.display = "block";
    questionView.style.display = "none";
  }
  
  // Initial setup
  drawWheel();
  spinButton.addEventListener("click", spinWheel);
  backToWheelButton.addEventListener("click", goBackToWheel);
  