// Spoonacular API configuration
const API_KEY = 'e66cb5d3906b48e7b1bb9efd14101447o';
const BASE_URL = 'https://api.spoonacular.com/recipes';

// Function to fetch recipes based on ingredients
async function searchRecipes() {
    const ingredients = document.getElementById('ingredients').value;
    const cuisine = document.getElementById('cuisine').value;
    const servings = document.getElementById('servings').value;

    try {
        const response = await fetch(`${BASE_URL}/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${API_KEY}`);
        const data = await response.json();
        
        if (data.length === 0) {
            showError('No recipes found with these ingredients. Try different ingredients.');
            return;
        }

        displayRecipes(data);
    } catch (error) {
        showError('Error fetching recipes. Please try again later.');
        console.error('Error:', error);
    }
}

// Function to display recipes
function displayRecipes(recipes) {
    const recipeGrid = document.querySelector('.recipe-grid');
    recipeGrid.innerHTML = '';

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-option-card';
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <div class="recipe-info">
                <span><i class="fas fa-clock"></i> ${recipe.readyInMinutes} mins</span>
                <span><i class="fas fa-users"></i> ${recipe.servings} servings</span>
            </div>
        `;
        recipeCard.addEventListener('click', () => showRecipeDetails(recipe.id));
        recipeGrid.appendChild(recipeCard);
    });
}

// Function to show detailed recipe
async function showRecipeDetails(recipeId) {
    try {
        const response = await fetch(`${BASE_URL}/${recipeId}/information?apiKey=${API_KEY}`);
        const recipe = await response.json();

        const recipeCard = document.querySelector('.recipe-card');
        recipeCard.innerHTML = `
            <h2>${recipe.title}</h2>
            <div class="recipe-details">
                <div class="ingredients">
                    <h3>Ingredients</h3>
                    <ul>
                        ${recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('')}
                    </ul>
                </div>
                <div class="instructions">
                    <h3>Instructions</h3>
                    <ol>
                        ${recipe.analyzedInstructions[0]?.steps.map(step => `<li>${step.step}</li>`).join('') || 'No instructions available'}
                    </ol>
                </div>
            </div>
        `;
        recipeCard.style.display = 'block';
    } catch (error) {
        showError('Error fetching recipe details. Please try again later.');
        console.error('Error:', error);
    }
}

// Function to show error messages
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(errorDiv, container.firstChild);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

// Event Listeners
document.querySelector('.search-btn').addEventListener('click', searchRecipes);

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

// Predefined recipes database
const recipeDatabase = {
    "pasta carbonara": {
        name: "Pasta Carbonara",
        ingredients: [
            "400g spaghetti",
            "200g pancetta or guanciale",
            "4 large eggs",
            "50g pecorino cheese",
            "50g parmesan",
            "Freshly ground black pepper",
            "Salt"
        ],
        instructions: [
            "Bring a large pot of salted water to boil and cook spaghetti according to package instructions.",
            "While pasta cooks, fry pancetta in a large pan until crispy.",
            "In a bowl, whisk eggs and grated cheeses together.",
            "Drain pasta, reserving some cooking water.",
            "Working quickly, mix hot pasta with pancetta, then stir in egg mixture.",
            "Add pasta water as needed to create a creamy sauce.",
            "Season with black pepper and serve immediately."
        ]
    },
    "margherita pizza": {
        name: "Margherita Pizza",
        ingredients: [
            "500g pizza dough",
            "400g canned tomatoes",
            "200g fresh mozzarella",
            "Fresh basil leaves",
            "Olive oil",
            "Salt"
        ],
        instructions: [
            "Preheat oven to 475°F (245°C).",
            "Roll out pizza dough on a floured surface.",
            "Spread crushed tomatoes over the dough.",
            "Tear mozzarella and distribute evenly.",
            "Drizzle with olive oil and season with salt.",
            "Bake for 10-12 minutes until crust is golden.",
            "Top with fresh basil leaves before serving."
        ]
    },
    "butter chicken": {
        name: "Butter Chicken",
        ingredients: [
            "500g chicken thighs",
            "1 cup yogurt",
            "2 tbsp lemon juice",
            "2 tsp garam masala",
            "2 tsp turmeric",
            "2 tsp cumin",
            "2 tsp chili powder",
            "2 tbsp butter",
            "1 onion, chopped",
            "3 garlic cloves, minced",
            "1 tbsp ginger, grated",
            "400g canned tomatoes",
            "1 cup heavy cream",
            "Fresh cilantro"
        ],
        instructions: [
            "Marinate chicken in yogurt, lemon juice, and spices for at least 1 hour.",
            "Grill or bake chicken until cooked through.",
            "In a pan, melt butter and sauté onions, garlic, and ginger.",
            "Add tomatoes and cook until softened.",
            "Blend sauce until smooth, return to pan.",
            "Add cream and cooked chicken, simmer for 10 minutes.",
            "Garnish with fresh cilantro and serve with rice or naan."
        ]
    },
    "chicken biryani": {
        name: "Chicken Biryani",
        ingredients: [
            "500g basmati rice",
            "500g chicken pieces",
            "2 onions, sliced",
            "2 tomatoes, chopped",
            "1 cup yogurt",
            "2 tbsp ginger-garlic paste",
            "2 tsp biryani masala",
            "1 tsp turmeric",
            "1 tsp red chili powder",
            "Fresh mint leaves",
            "Fresh coriander leaves",
            "Saffron strands",
            "Ghee or oil",
            "Salt"
        ],
        instructions: [
            "Soak rice for 30 minutes, then cook until 70% done.",
            "Marinate chicken with yogurt and spices for 1 hour.",
            "Fry onions until golden brown.",
            "Cook marinated chicken with tomatoes until tender.",
            "Layer rice and chicken in a pot, adding fried onions and herbs.",
            "Sprinkle saffron milk on top.",
            "Cover and cook on low heat for 20 minutes.",
            "Serve hot with raita."
        ]
    },
    "chocolate cake": {
        name: "Chocolate Cake",
        ingredients: [
            "2 cups all-purpose flour",
            "2 cups sugar",
            "3/4 cup cocoa powder",
            "2 tsp baking powder",
            "1.5 tsp baking soda",
            "1 tsp salt",
            "1 cup milk",
            "1/2 cup vegetable oil",
            "2 eggs",
            "2 tsp vanilla extract",
            "1 cup boiling water"
        ],
        instructions: [
            "Preheat oven to 350°F (175°C).",
            "Mix dry ingredients in a large bowl.",
            "Add milk, oil, eggs, and vanilla, beat for 2 minutes.",
            "Stir in boiling water (batter will be thin).",
            "Pour into greased and floured cake pans.",
            "Bake for 30-35 minutes until toothpick comes out clean.",
            "Cool for 10 minutes, then remove from pans.",
            "Frost when completely cool."
        ]
    },
    "vegetable stir fry": {
        name: "Vegetable Stir Fry",
        ingredients: [
            "2 cups mixed vegetables (bell peppers, broccoli, carrots, snap peas)",
            "2 tbsp soy sauce",
            "1 tbsp oyster sauce",
            "1 tsp sugar",
            "2 cloves garlic, minced",
            "1 inch ginger, grated",
            "2 tbsp vegetable oil",
            "1 tsp cornstarch",
            "2 tbsp water",
            "Spring onions for garnish"
        ],
        instructions: [
            "Cut vegetables into bite-sized pieces.",
            "Mix soy sauce, oyster sauce, and sugar in a bowl.",
            "Heat oil in a wok or large pan.",
            "Stir-fry garlic and ginger until fragrant.",
            "Add vegetables and stir-fry for 3-4 minutes.",
            "Add sauce mixture and stir well.",
            "Mix cornstarch with water and add to thicken sauce.",
            "Garnish with spring onions and serve hot."
        ]
    },
    "masala dosa": {
        name: "Masala Dosa",
        ingredients: [
            "2 cups rice",
            "1 cup urad dal",
            "1/2 tsp fenugreek seeds",
            "Salt to taste",
            "Oil for cooking",
            "For potato filling:",
            "4 potatoes, boiled and mashed",
            "1 onion, chopped",
            "2 green chilies, chopped",
            "1/2 tsp mustard seeds",
            "1/2 tsp turmeric",
            "Curry leaves",
            "Oil for tempering"
        ],
        instructions: [
            "Soak rice and dal separately for 6 hours.",
            "Grind to make a smooth batter, ferment overnight.",
            "For filling, heat oil and add mustard seeds.",
            "Add onions, chilies, and curry leaves, sauté.",
            "Add mashed potatoes and spices, mix well.",
            "Heat a griddle, pour batter and spread thin.",
            "Drizzle oil, cook until crisp.",
            "Add potato filling, fold and serve with chutney."
        ]
    }
};

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
async function showQuickRecipe(recipeType) {
    try {
        // Map recipe types to search terms
        const searchTerms = {
            'pasta': 'pasta carbonara',
            'pizza': 'margherita pizza',
            'curry': 'butter chicken',
            'salad': 'greek salad',
            'soup': 'tomato soup',
            'dessert': 'chocolate cake'
        };

        const searchTerm = searchTerms[recipeType];
        
        // First, search for the recipe
        const searchResponse = await fetch(`${BASE_URL}/complexSearch?query=${searchTerm}&number=1&apiKey=${API_KEY}`);
        const searchData = await searchResponse.json();
        
        if (searchData.results && searchData.results.length > 0) {
            const recipeId = searchData.results[0].id;
            
            // Store the recipe ID in sessionStorage
            sessionStorage.setItem('selectedRecipeId', recipeId);
            
            // Redirect to recipe details page
            window.location.href = 'recipe-details.html';
        } else {
            showError('Recipe not found. Please try again.');
        }
    } catch (error) {
        showError('Error fetching recipe. Please try again later.');
        console.error('Error:', error);
    }
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

function showRecipeForm() {
    // Hide the search section
    document.querySelector('.get-recipe-section').style.display = 'none';
    
    // Show the recipe form
    document.querySelector('.recipe-form').style.display = 'block';
    
    // Scroll to form
    document.querySelector('.recipe-form').scrollIntoView({ behavior: 'smooth' });
}

function searchRecipe() {
    const searchInput = document.getElementById('recipe-search');
    const searchTerm = searchInput.value.toLowerCase().trim();
    const servings = parseInt(document.getElementById('search-servings').value) || 4;
    
    if (searchTerm === '') {
        alert('Please enter a recipe name');
        return;
    }
    
    // Find matching recipe
    const matchingRecipe = Object.entries(recipeDatabase).find(([name]) => 
        name.includes(searchTerm) || searchTerm.includes(name)
    );
    
    if (matchingRecipe) {
        // Hide the form
        document.querySelector('.recipe-form').style.display = 'none';
        
        // Show and update recipe card
        const recipeCard = document.querySelector('.recipe-card');
        recipeCard.style.display = 'block';
        
        // Display the recipe with servings
        displayRecipe(matchingRecipe[1], servings);
    } else {
        alert('Recipe not found. Please try another name or use the ingredient-based search.');
    }
}

function displayRecipe(recipe, servings = 4) {
    // Update recipe details
    document.getElementById('recipe-name').textContent = `${recipe.name} (${servings} servings)`;
    
    // Clear and update ingredients with adjusted quantities
    const ingredientsList = document.getElementById('ingredients-list');
    ingredientsList.innerHTML = '';
    recipe.ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        // Try to extract number from ingredient string
        const match = ingredient.match(/^([\d.]+)?\s*(.+)/);
        if (match && match[1]) {
            // If there's a number, adjust it for servings
            const originalAmount = parseFloat(match[1]);
            const adjustedAmount = (originalAmount * servings / 4).toFixed(1);
            li.textContent = `${adjustedAmount} ${match[2]}`;
        } else {
            li.textContent = ingredient;
        }
        ingredientsList.appendChild(li);
    });
    
    // Clear and update instructions
    const instructionsList = document.getElementById('instructions-list');
    instructionsList.innerHTML = '';
    recipe.instructions.forEach((instruction, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${instruction}`;
        instructionsList.appendChild(li);
    });
    
    // Make sure recipe card is visible
    const recipeCard = document.querySelector('.recipe-card');
    recipeCard.style.display = 'block';
    
    // Add a back button
    const backButton = document.createElement('button');
    backButton.textContent = '← Back to Search';
    backButton.className = 'back-button';
    backButton.onclick = function() {
        recipeCard.style.display = 'none';
        document.querySelector('.recipe-form').style.display = 'block';
        document.querySelector('.search-section').style.display = 'block';
    };
    
    // Add the back button to the recipe card if it doesn't exist
    if (!recipeCard.querySelector('.back-button')) {
        recipeCard.insertBefore(backButton, recipeCard.firstChild);
    }
    
    // Scroll to recipe
    recipeCard.scrollIntoView({ behavior: 'smooth' });
} 