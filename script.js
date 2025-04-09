// Spoonacular API configuration
const API_KEY = 'e66cb5d3906b48e7b1bb9efd14101447'; 
const BASE_URL = 'https://api.spoonacular.com/recipes';

// DOM elements
const recipeName = document.getElementById('recipe-name');
const ingredientsList = document.getElementById('ingredients-list');
const instructionsList = document.getElementById('instructions-list');
const recipeCard = document.getElementById('recipe-card');
const inputForm = document.getElementById('input-form');

// User inputs
let userIngredients = [];
let userCuisine = '';
let userServings = 4;

// Function to handle next step
function nextStep(currentStep) {
    const currentStepElement = document.getElementById(`${currentStep}-step`);
    const nextStepElement = document.getElementById(`${getNextStep(currentStep)}-step`);
    
    // Save current input
    if (currentStep === 'ingredients') {
        const input = document.getElementById('ingredients-input').value;
        userIngredients = input.split(',').map(item => item.trim().toLowerCase());
    } else if (currentStep === 'cuisine') {
        userCuisine = document.getElementById('cuisine-input').value;
    } else if (currentStep === 'servings') {
        userServings = parseInt(document.getElementById('servings-input').value);
        generateRecipe();
        return;
    }
    
    // Move to next step
    currentStepElement.classList.remove('active');
    nextStepElement.classList.add('active');
}

// Function to get next step
function getNextStep(currentStep) {
    const steps = ['ingredients', 'cuisine', 'servings'];
    const currentIndex = steps.indexOf(currentStep);
    return steps[currentIndex + 1];
}

// Function to generate recipe using Spoonacular API
async function generateRecipe() {
    try {
        // Show loading state
        recipeName.textContent = "Finding the perfect recipe...";
        ingredientsList.innerHTML = '<li>Loading...</li>';
        instructionsList.innerHTML = '<li>Loading...</li>';
        
        // Build the API URL
        const ingredientsQuery = userIngredients.join(',+');
        const cuisineQuery = userCuisine ? `&cuisine=${userCuisine}` : '';
        
        // First, search for recipes
        const searchUrl = `${BASE_URL}/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredientsQuery}&number=5${cuisineQuery}`;
        const searchResponse = await fetch(searchUrl);
        const recipes = await searchResponse.json();
        
        if (recipes.length === 0) {
            throw new Error('No recipes found with these ingredients');
        }
        
        // Get a random recipe from the results
        const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
        
        // Get detailed recipe information
        const recipeUrl = `${BASE_URL}/${randomRecipe.id}/information?apiKey=${API_KEY}`;
        const recipeResponse = await fetch(recipeUrl);
        const recipeDetails = await recipeResponse.json();
        
        // Get recipe instructions
        const instructionsUrl = `${BASE_URL}/${randomRecipe.id}/analyzedInstructions?apiKey=${API_KEY}`;
        const instructionsResponse = await fetch(instructionsUrl);
        const instructionsData = await instructionsResponse.json();
        
        // Update the UI with the recipe
        displayRecipe(recipeDetails, instructionsData, userServings);
        
    } catch (error) {
        console.error('Error fetching recipe:', error);
        recipeName.textContent = "Error finding recipe";
        ingredientsList.innerHTML = '<li>Please try again with different ingredients</li>';
        instructionsList.innerHTML = '';
    }
}

// Function to display the recipe
function displayRecipe(recipe, instructions, servings) {
    // Update recipe name
    recipeName.textContent = recipe.title;
    
    // Clear previous lists
    ingredientsList.innerHTML = '';
    instructionsList.innerHTML = '';
    
    // Add ingredients (adjusted for servings)
    recipe.extendedIngredients.forEach(ingredient => {
        const li = document.createElement('li');
        const adjustedAmount = (ingredient.amount * servings / recipe.servings).toFixed(2);
        li.textContent = `${adjustedAmount} ${ingredient.unit} ${ingredient.name}`;
        ingredientsList.appendChild(li);
    });
    
    // Add instructions
    if (instructions.length > 0) {
        instructions[0].steps.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step.step;
            instructionsList.appendChild(li);
        });
    }
    
    // Show recipe card and hide input form
    inputForm.style.display = 'none';
    recipeCard.style.display = 'block';
}

// Function to reset the form
function resetForm() {
    // Reset user inputs
    userIngredients = [];
    userCuisine = '';
    userServings = 4;
    
    // Reset form elements
    document.getElementById('ingredients-input').value = '';
    document.getElementById('cuisine-input').value = '';
    document.getElementById('servings-input').value = '4';
    
    // Show input form and hide recipe card
    inputForm.style.display = 'block';
    recipeCard.style.display = 'none';
    
    // Reset to first step
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('ingredients-step').classList.add('active');
} 