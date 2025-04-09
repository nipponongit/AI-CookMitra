// Spoonacular API configuration
const API_KEY = '701b3c298a074e34b17c67fc9778e77b'; 
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
        const input = document.getElementById('ingredients-input').value.trim();
        if (!input) {
            alert('Please enter at least one ingredient before proceeding.');
            return;
        }
        userIngredients = input.split(',').map(item => item.trim().toLowerCase());
    } else if (currentStep === 'cuisine') {
        const cuisineInput = document.getElementById('cuisine-input').value;
        if (!cuisineInput) {
            alert('Please select a cuisine type before proceeding.');
            return;
        }
        userCuisine = cuisineInput;
    } else if (currentStep === 'servings') {
        const servingsInput = document.getElementById('servings-input').value;
        if (!servingsInput || servingsInput < 1) {
            alert('Please enter a valid number of servings (1-20).');
            return;
        }
        userServings = parseInt(servingsInput);
        // Generate recipe immediately after servings
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
    
    // Remove any existing buttons
    const existingButtons = recipeCard.querySelector('.recipe-buttons');
    if (existingButtons) {
        existingButtons.remove();
    }
    
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
    
    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'recipe-buttons';
    
    // Create regenerate button
    const regenerateButton = document.createElement('button');
    regenerateButton.textContent = '🔄 Generate Another Recipe';
    regenerateButton.className = 'regenerate-button';
    regenerateButton.onclick = generateRecipe;
    
    // Add regenerate button to container
    buttonsContainer.appendChild(regenerateButton);
    
    // Add buttons container to the bottom of recipe card
    recipeCard.appendChild(buttonsContainer);
    
    // Show recipe card and hide input form
    inputForm.style.display = 'none';
    recipeCard.style.display = 'block';
}

// Function to add ingredient to input field
function addIngredient(ingredient) {
    const input = document.getElementById('ingredients-input');
    const currentValue = input.value.trim();
    
    if (currentValue === '') {
        input.value = ingredient;
    } else {
        // Check if ingredient is already in the list
        const ingredients = currentValue.split(',').map(item => item.trim().toLowerCase());
        if (!ingredients.includes(ingredient.toLowerCase())) {
            input.value = currentValue + ', ' + ingredient;
        }
    }
    
    // Focus the input field
    input.focus();
}

// Update the button styles
const buttonStyles = document.createElement('style');
buttonStyles.textContent = `
.recipe-buttons {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}

.regenerate-button {
    background-color: #2ecc71;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.regenerate-button:hover {
    background-color: #27ae60;
    transform: translateY(-2px);
}
`;
document.head.appendChild(buttonStyles);

// Function to select a recipe from the grid
function selectRecipe(recipeType) {
    // Redirect to recipe-form.html with recipe type as query parameter
    window.location.href = `recipe-form.html#${recipeType}`;
}

// Function to handle recipe selection on page load
function handleRecipeSelection() {
    // Check if we're on the recipe form page
    if (!document.getElementById('recipe-options-step')) return;

    // Get the recipe type from URL hash
    const recipeType = window.location.hash.slice(1);
    if (recipeType) {
        // Hide all steps first
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });

        // Show the recipe options step
        const recipeOptionsStep = document.getElementById('recipe-options-step');
        if (recipeOptionsStep) {
            recipeOptionsStep.classList.add('active');
        }

        // Trigger the recipe selection
        showRecipeDetails(recipeType);
    }
}

// Function to show recipe details
function showRecipeDetails(recipeType) {
    const recipes = {
        'pasta': {
            title: 'Pasta Carbonara',
            ingredients: [
                '400g spaghetti',
                '200g pancetta or guanciale',
                '4 large eggs',
                '100g Pecorino Romano cheese',
                '100g Parmigiano Reggiano',
                '2 cloves garlic',
                'Black pepper',
                'Salt'
            ],
            instructions: [
                'Bring a large pot of salted water to boil',
                'Cook spaghetti according to package instructions',
                'Meanwhile, cut pancetta into small cubes',
                'In a bowl, whisk eggs, grated cheeses, and black pepper',
                'Cook pancetta in a large pan until crispy',
                'Reserve 1 cup of pasta water before draining',
                'Add hot pasta to the pancetta pan',
                'Remove from heat and quickly stir in egg mixture',
                'Add pasta water if needed for creaminess',
                'Serve immediately with extra cheese and black pepper'
            ]
        },
        'pizza': {
            title: 'Margherita Pizza',
            ingredients: [
                'Pizza dough',
                'San Marzano tomatoes',
                'Fresh mozzarella',
                'Fresh basil leaves',
                'Extra virgin olive oil',
                'Salt',
                'Black pepper'
            ],
            instructions: [
                'Preheat oven to highest setting (usually 450-500°F)',
                'Roll out pizza dough on floured surface',
                'Spread crushed tomatoes as base',
                'Add torn mozzarella pieces',
                'Drizzle with olive oil',
                'Bake until crust is golden and cheese is bubbly',
                'Add fresh basil leaves after baking',
                'Season with salt and pepper'
            ]
        },
        'curry': {
            title: 'Butter Chicken',
            ingredients: [
                '800g chicken thighs, cut into pieces',
                '2 cups tomato puree',
                '1 cup heavy cream',
                '2 tbsp butter',
                '2 onions, finely chopped',
                '4 cloves garlic',
                '2 tbsp garam masala',
                '1 tbsp turmeric',
                'Fresh coriander',
                'Salt to taste'
            ],
            instructions: [
                'Marinate chicken in yogurt and spices for 2 hours',
                'Sauté onions and garlic in butter until golden',
                'Add spices and cook until fragrant',
                'Add tomato puree and simmer for 15 minutes',
                'Add chicken and cook until done',
                'Stir in cream and simmer for 5-10 minutes',
                'Garnish with fresh coriander',
                'Serve with naan bread or rice'
            ]
        },
        'salad': {
            title: 'Greek Salad',
            ingredients: [
                'Cucumber, chunked',
                'Tomatoes, chunked',
                'Red onion, sliced',
                'Green bell pepper, chunked',
                'Kalamata olives',
                'Feta cheese',
                'Extra virgin olive oil',
                'Dried oregano',
                'Salt and pepper'
            ],
            instructions: [
                'Chop all vegetables into large chunks',
                'Combine vegetables in a large bowl',
                'Add olives and cubed feta cheese',
                'Drizzle with olive oil',
                'Sprinkle with oregano, salt, and pepper',
                'Toss gently to combine',
                'Serve immediately or chill'
            ]
        },
        'soup': {
            title: 'Tomato Soup',
            ingredients: [
                '6 ripe tomatoes',
                '1 onion, diced',
                '3 cloves garlic',
                '2 cups vegetable broth',
                '1 cup heavy cream',
                'Fresh basil',
                'Olive oil',
                'Salt and pepper'
            ],
            instructions: [
                'Roast tomatoes and garlic in oven until caramelized',
                'Sauté onions in olive oil until translucent',
                'Add roasted tomatoes and garlic',
                'Pour in vegetable broth',
                'Simmer for 20 minutes',
                'Blend until smooth',
                'Stir in cream and heat through',
                'Season with salt and pepper',
                'Garnish with fresh basil'
            ]
        },
        'dessert': {
            title: 'Chocolate Cake',
            ingredients: [
                '2 cups all-purpose flour',
                '2 cups sugar',
                '3/4 cup cocoa powder',
                '2 eggs',
                '1 cup milk',
                '1/2 cup vegetable oil',
                '2 tsp vanilla extract',
                '2 tsp baking powder',
                '1 tsp salt'
            ],
            instructions: [
                'Preheat oven to 350°F (175°C)',
                'Mix dry ingredients in a large bowl',
                'Whisk wet ingredients in another bowl',
                'Combine wet and dry ingredients',
                'Pour into greased cake pan',
                'Bake for 30-35 minutes',
                'Cool completely before frosting',
                'Decorate as desired'
            ]
        }
    };

    const recipe = recipes[recipeType];
    if (recipe) {
        // Update recipe name
        document.getElementById('recipe-name').textContent = recipe.title;
        
        // Update ingredients
        const ingredientsList = document.getElementById('ingredients-list');
        ingredientsList.innerHTML = '';
        recipe.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
        });
        
        // Update instructions
        const instructionsList = document.getElementById('instructions-list');
        instructionsList.innerHTML = '';
        recipe.instructions.forEach(instruction => {
            const li = document.createElement('li');
            li.textContent = instruction;
            instructionsList.appendChild(li);
        });
        
        // Show recipe card and hide input form
        document.getElementById('input-form').style.display = 'none';
        document.getElementById('recipe-card').style.display = 'block';
        
        // Scroll to recipe card
        document.getElementById('recipe-card').scrollIntoView({ behavior: 'smooth' });
    }
}

// Function to show quick recipe
function showQuickRecipe(recipeType) {
    // Redirect to recipe-form.html and show recipe details
    window.location.href = 'recipe-form.html';
    
    // Store the recipe type for access after redirect
    sessionStorage.setItem('quickRecipe', recipeType);
}

// Function to check and display quick recipe on page load
function checkForQuickRecipe() {
    // Only run this on recipe-form.html page
    const recipeCard = document.getElementById('recipe-card');
    const inputForm = document.getElementById('input-form');
    if (!recipeCard || !inputForm) return;

    const quickRecipeType = sessionStorage.getItem('quickRecipe');
    if (quickRecipeType) {
        // Clear the storage
        sessionStorage.removeItem('quickRecipe');
        
        // Define quick recipes
        const quickRecipes = {
            'pasta': {
                title: 'Classic Pasta Carbonara',
                ingredients: [
                    '400g spaghetti',
                    '200g guanciale or pancetta',
                    '4 large eggs',
                    '100g Pecorino Romano',
                    '100g Parmigiano Reggiano',
                    'Black pepper',
                    'Salt'
                ],
                instructions: [
                    'Bring a large pot of salted water to boil',
                    'Cook pasta according to package instructions',
                    'Meanwhile, cut guanciale into small cubes',
                    'Beat eggs with grated cheese and pepper',
                    'Cook guanciale until crispy',
                    'Toss hot pasta with guanciale',
                    'Remove from heat and mix in egg mixture',
                    'Serve immediately with extra cheese and pepper'
                ]
            },
            'pizza': {
                title: 'Margherita Pizza',
                ingredients: [
                    'Pizza dough',
                    'San Marzano tomatoes',
                    'Fresh mozzarella',
                    'Fresh basil',
                    'Olive oil',
                    'Salt'
                ],
                instructions: [
                    'Preheat oven to 450°F',
                    'Roll out pizza dough',
                    'Spread crushed tomatoes',
                    'Add torn mozzarella',
                    'Bake until crust is golden',
                    'Top with fresh basil and olive oil'
                ]
            },
            'curry': {
                title: 'Butter Chicken',
                ingredients: [
                    '800g chicken thighs',
                    '2 cups tomato puree',
                    '1 cup heavy cream',
                    '2 tbsp butter',
                    'Garam masala',
                    'Turmeric',
                    'Ginger-garlic paste',
                    'Salt to taste'
                ],
                instructions: [
                    'Marinate chicken in yogurt and spices',
                    'Cook chicken until golden',
                    'Make sauce with tomatoes and spices',
                    'Add cream and butter',
                    'Simmer until thick',
                    'Serve with naan bread'
                ]
            }
        };

        const recipe = quickRecipes[quickRecipeType];
        if (recipe) {
            // Hide all form steps
            document.querySelectorAll('.form-step').forEach(step => {
                step.classList.remove('active');
            });

            // Update recipe name
            document.getElementById('recipe-name').textContent = recipe.title;
            
            // Update ingredients
            const ingredientsList = document.getElementById('ingredients-list');
            ingredientsList.innerHTML = '';
            recipe.ingredients.forEach(ingredient => {
                const li = document.createElement('li');
                li.textContent = ingredient;
                ingredientsList.appendChild(li);
            });
            
            // Update instructions
            const instructionsList = document.getElementById('instructions-list');
            instructionsList.innerHTML = '';
            recipe.instructions.forEach(instruction => {
                const li = document.createElement('li');
                li.textContent = instruction;
                instructionsList.appendChild(li);
            });
            
            // Show recipe card and hide input form
            inputForm.style.display = 'none';
            recipeCard.style.display = 'block';
            
            // Scroll to recipe card
            recipeCard.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Add event listener to check for quick recipe when page loads
document.addEventListener('DOMContentLoaded', () => {
    checkForQuickRecipe();
    handleRecipeSelection();
}); 