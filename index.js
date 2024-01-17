document.addEventListener('DOMContentLoaded', function () {
    const regionsContainer = document.getElementById('regions');
    const mealsContainer = document.getElementById('meals');
    const likeButtonContainer = document.getElementById('likeButton');
    const likeCountElement = document.getElementById('likeCount');
    const commentFormContainer = document.getElementById('commentForm');
    const likedFoodsContainer = document.getElementById('likedFoods');

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

    // Function to fetch and display meals for a specific region
    function fetchAndDisplayMeals(region) {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${region}`)
            .then(response => response.json())
            .then(data => {
                mealsContainer.innerHTML = ''; // Clear previous content
                data.meals.forEach(meal => {
                    const mealElement = document.createElement('div');
                    mealElement.innerHTML = `
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" onclick="showLikeButton('${meal.strMeal}')">
                        <p>${meal.strMeal}</p>
                    `;
                    mealsContainer.appendChild(mealElement);
                });
            })
            .catch(error => console.error(`Error fetching meals for ${region}:`, error));
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
});