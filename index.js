// Function to format ingredients for a meal
function formatIngredients(meal) {
    const ingredientsList = [];

    // Include the name of the dish on the same line and make it bold
    ingredientsList.push(`<p><strong>Ingredients for ${meal.strMeal}</strong></p><ul>`);

    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== '') {
            ingredientsList.push(`<li>${measure} ${ingredient}</li>`);
        } else {
            break; // Stop if no more ingredients
        }
    }

    ingredientsList.push('</ul>'); // Close the unordered list
    return ingredientsList.join('');
}

// Function to format instructions for a meal
function formatInstructions(meal) {
   
    if( meal.strInstructions.includes('${meal.strInstructions}')){
        // Manually format instructions without HTML-like template string
        return `<p><strong>Instructions</strong></p>${meal.strInstructions.replace(/(?:\r\n|\r|\n)/g, '<br>')}`;
    } 
    else {
        // if the instruction are already formatted, return them as
        return `<p><strong>Instructions</strong></p>${meal.strInstructions}`;
    } 
}
// Function to create a modal overlay for displaying meal details
function createModalOverlay() {
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');
    return modalOverlay;
}

// Function to create a meal container element
function createMealContainer(meal) {
    // Create a div element for the meal container
    const mealContainer = document.createElement('div');
    mealContainer.classList.add('meal-container', 'details');

    // Create and append the ingredients element to the meal container
    const ingredientsElement = document.createElement('div');
    ingredientsElement.classList.add('ingredients');
    ingredientsElement.innerHTML = formatIngredients(meal);

    // Create and append the instructions element to the meal container
    const instructionsElement = document.createElement('div');
    instructionsElement.classList.add('instructions');
    instructionsElement.innerHTML = formatInstructions(meal);

    // Create a like button and append it to the meal container
    const likeButton = document.createElement('button');
    likeButton.classList.add('like-button');
    likeButton.textContent = 'Like';
    likeButton.addEventListener('click', () => {
        likeMeal(meal);
        updateLikedMeals();
    });

    // Create a close button and append it to the meal container
    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => {
        const mainContainer = document.querySelector('.container');
        mainContainer.removeChild(mealContainer.parentElement); // remove the modal overlay
    });

    mealContainer.appendChild(ingredientsElement);
    mealContainer.appendChild(instructionsElement);
    mealContainer.appendChild(likeButton);
    mealContainer.appendChild(closeButton);

    return mealContainer;
}

// Function to store liked meals in local storage
function likeMeal(meal) {
    const likedMeals = JSON.parse(localStorage.getItem('likedMeals')) || [];
    likedMeals.push(meal.strMealThumb);
    localStorage.setItem('likedMeals', JSON.stringify(likedMeals));
}

// Function to update the liked meals section
function updateLikedMeals() {
    const likedMealsSection = document.getElementById('likedMeals');
    if (!likedMealsSection) return;

    const likedMeals = JSON.parse(localStorage.getItem('likedMeals')) || [];
    likedMealsSection.innerHTML = '<p>Liked Meals:</p>';

    likedMeals.forEach(mealImage => {
        const imageElement = document.createElement('img');
        imageElement.src = mealImage;
        likedMealsSection.appendChild(imageElement);
    });
}

// Function to display meal details when a meal is clicked
function showMealDetails(mealId) {
    // Fetch meal details from the API
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];

            
            // Create a meal container using the fetched meal details
            const modalContainer = document.createElement('div');
            modalContainer.classList.add('modal-overlay');
            modalContainer.appendChild(createMealContainer(meal));

            // Append the modal container to the main container
            const mainContainer = document.querySelector('.container');
            mainContainer.appendChild(modalContainer);
        })
        .catch(error => console.error(`Error fetching details for meal ${mealId}:`, error));
}

// Event listener for the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function () {
    // Get references to HTML elements
    const regionsContainer = document.getElementById('regions');
    const mealsContainer = document.getElementById('meals');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    // Fetch the list of meal areas and populate the regions container
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
        .then(response => response.json())
        .then(data => {
            // Create buttons for each region and add event listeners
            data.meals.forEach(region => {
                const button = document.createElement('button');
                button.textContent = region.strArea;
                button.addEventListener('click', () => fetchAndDisplayMeals(region.strArea));
                regionsContainer.appendChild(button);
            });
        })
        .catch(error => console.error('Error fetching meal areas:', error));

    // Search functionality
    searchButton.addEventListener('click', () => {
        const searchValue = searchInput.value.trim().toLowerCase();
        if (searchValue !== '') {
            // Find the region button that matches the search value
            const regionButton = Array.from(regionsContainer.children).find(button =>
                button.textContent.trim().toLowerCase() === searchValue
            );

            if (regionButton) {
                // Trigger a click on the matching region button
                regionButton.click();
            } else {
                // Display an alert if the region is not found
                alert('Region not found. Please try again.');
            }
        }
    });

    // Function to fetch and display meals for a specific region
    function fetchAndDisplayMeals(region) {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${region}`)
            .then(response => response.json())
            .then(data => {
                // Clear previous content in the meals container
                mealsContainer.innerHTML = '';

                // Create meal elements and append them to the meals container
                data.meals.forEach(meal => {
                    const mealElement = document.createElement('div');
                    mealElement.innerHTML = `
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" onclick="showMealDetails('${meal.idMeal}')">
                        <p>${meal.strMeal}</p>
                    `;
                    mealsContainer.appendChild(mealElement);
                });
            })
            .catch(error => console.error(`Error fetching meals for ${region}:`, error));
    }

    // Display liked meals on page load
    updateLikedMeals();
});