document.addEventListener('DOMContentLoaded', function () {
    const regionsContainer = document.getElementById('regions');
    const mealsContainer = document.getElementById('meals');
    const likeButtonContainer = document.getElementById('likeButton');
    const likeCountElement = document.getElementById('likeCount');
    const commentFormContainer = document.getElementById('commentForm');
    const likedFoodsContainer = document.getElementById('likedFoods');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    let likeCount = 0;
    const likedFoods = [];

    // Fetch the list of meal areas
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
        .then(response => response.json())
        .then(data => {
            data.meals.forEach(region => {
                const button = document.createElement('button');
                button.textContent = region.strArea;
                button.addEventListener('click', () => fetchAndDisplayMeals(region.strArea));
                regionsContainer.appendChild(button);
            });
        })
        .catch(error => console.error('Error fetching meal areas:', error));

    // Fetch and display meals for a specific region
    function fetchAndDisplayMeals(region) {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${region}`)
            .then(response => response.json())
            .then(data => {
                mealsContainer.innerHTML = ''; // Clear previous content
                data.meals.forEach(meal => {
                    const mealElement = createMealElement(meal);
                    mealsContainer.appendChild(mealElement);
                });
            })
            .catch(error => console.error(`Error fetching meals for ${region}:`, error));
    }

    // Function to create a meal element
    function createMealElement(meal) {
        const mealDiv = document.createElement('div');
        mealDiv.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" onclick="showLikeButton('${meal.strMeal}')">
            <p>${meal.strMeal}</p>
        `;
        mealDiv.classList.add('meal');
        return mealDiv;
    }

    // Show the like button and increment like count
    window.showLikeButton = function (mealName) {
        const alreadyLiked = likedFoods.includes(mealName);

        if (!alreadyLiked) {
            likeCount++;
            likedFoods.push(mealName);
        } else {
            likeCount--;
            const index = likedFoods.indexOf(mealName);
            likedFoods.splice(index, 1);
        }

        likeCountElement.textContent = `${likeCount} ${likeCount === 1 ? 'like' : 'likes'}`;
        likeButtonContainer.classList.remove('hidden');
        commentFormContainer.innerHTML = ''; // Clear previous comment form
        commentFormContainer.appendChild(createCommentForm(mealName));

        updateLikedFoods(); // Update the liked foods display
        updateLikeButtonState(alreadyLiked); // Update the like button state
    };

    // Function to create a comment form element
    function createCommentForm(mealName) {
        const form = document.createElement('form');
        form.addEventListener('submit', event => {
            event.preventDefault();
            const comment = form.querySelector('input').value;
            alert(`You commented on ${mealName}: ${comment}`);
            form.reset();
        });

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Add a comment...';

        form.appendChild(input);
        return form;
    }

    // Function to update the like button state
    function updateLikeButtonState(alreadyLiked) {
        const likeButton = document.getElementById('like');
        likeButton.setAttribute('data-meal-name', likedFoods[likedFoods.length - 1]);
        if (alreadyLiked) {
            likeButton.textContent = 'Unlike';
            likeButton.removeEventListener('click', likeButtonClickHandler);
            likeButton.addEventListener('click', unlikeButtonClickHandler);
        } else {
            likeButton.textContent = 'Like';
            likeButton.removeEventListener('click', unlikeButtonClickHandler);
            likeButton.addEventListener('click', likeButtonClickHandler);
        }
    }

    // Event handler for the "Like" button
    function likeButtonClickHandler() {
        const mealName = document.getElementById('likeButton').getAttribute('data-meal-name');
        showLikeButton(mealName);
    }

    // Event handler for the "Unlike" button
    function unlikeButtonClickHandler() {
        const mealName = document.getElementById('likeButton').getAttribute('data-meal-name');
        showLikeButton(mealName);
    }

    // Function to update the liked foods display
    function updateLikedFoods() {
        likedFoodsContainer.innerHTML = `<p>Liked Foods: ${likedFoods.join(', ')}</p>`;
    }

    // Search functionality
    searchButton.addEventListener('click', function () {
        const searchValue = searchInput.value.trim().toLowerCase(); // Convert to lowercase and trim

        if (searchValue !== '') {
            const matchingMeal = findMatchingMeal(searchValue);
            if (matchingMeal) {
                const region = matchingMeal.strArea;
                fetchAndDisplayMeals(region);

                // Display the matching meal image as the first tile
                const matchingMealElement = createMealElement(matchingMeal);
                mealsContainer.innerHTML = ''; // Clear previous content
                mealsContainer.appendChild(matchingMealElement);
            } else {
                alert('Meal not found. Please try again.');
            }
        }
    });

    // Function to find a matching meal by name
    function findMatchingMeal(name) {
        const allMeals = regionsContainer.querySelectorAll('.meal p');
        for (const meal of allMeals) {
            if (meal.textContent.trim().toLowerCase() === name) { // Trim and convert to lowercase
                return {
                    strMeal: meal.textContent.trim(), // Trim the meal name
                    strMealThumb: meal.previousElementSibling.src,
                    strArea: meal.closest('.meal').querySelector('button').textContent
                };
            }
        }
        return null;
    }
});