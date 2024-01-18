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

    // Search functionality
    searchButton.addEventListener('click', () => {
        const searchValue = searchInput.value.trim().toLowerCase();
        if (searchValue !== '') {
            const regionButton = Array.from(regionsContainer.children).find(button =>
                button.textContent.trim().toLowerCase() === searchValue
            );

            if (regionButton) {
                regionButton.click();
            } else {
                alert('Region not found. Please try again.');
            }
        }
    });

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
            const input = form.querySelector('input');
            if (input) {
                const comment = input.value;
                saveComment(mealName, comment);
                form.reset();
            }
        });

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Add a comment...';

        form.appendChild(input);
        form.appendChild(createRemoveButton(mealName));
        form.appendChild(createCommentsList(mealName));
        return form;
    }

    // Function to save a comment
    function saveComment(mealName, comment) {
        const commentObj = { mealName, comment };
        if (!localStorage.comments) {
            localStorage.comments = JSON.stringify([commentObj]);
        } else {
            const comments = JSON.parse(localStorage.comments);
            comments.push(commentObj);
            localStorage.comments = JSON.stringify(comments);
        }
        updateCommentsList(mealName);
    }

    // Function to remove a comment
    function removeComment(mealName, comment) {
        const comments = JSON.parse(localStorage.comments);
        const updatedComments = comments.filter(entry => !(entry.mealName === mealName && entry.comment === comment));
        localStorage.comments = JSON.stringify(updatedComments);
        updateCommentsList(mealName);
    }

    // Function to create a remove button
    function createRemoveButton(mealName) {
        const button = document.createElement('button');
        button.textContent = 'Remove Comment';
        button.addEventListener('click', () => {
            const input = document.querySelector(`#comment-${mealName} input`);
            const comment = input ? input.value : '';
            removeComment(mealName, comment);
        });
        return button;
    }

    // Function to create a comments list
    function createCommentsList(mealName) {
        const commentsList = document.createElement('div');
        commentsList.id = `comment-${mealName}`;
        commentsList.classList.add('comments-list');
        updateCommentsList(mealName);
        return commentsList;
    }

    // Function to update the comments list
    function updateCommentsList(mealName) {
        const commentsList = document.querySelector(`#comment-${mealName}`);
        if (!commentsList) return;

        const comments = JSON.parse(localStorage.comments) || [];
        const mealComments = comments.filter(entry => entry.mealName === mealName);

        commentsList.innerHTML = '<p>Comments:</p>';

        mealComments.forEach(entry => {
            const commentItem = document.createElement('div');
            commentItem.textContent = entry.comment;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => removeComment(mealName, entry.comment));

            commentItem.appendChild(removeButton);
            commentsList.appendChild(commentItem);
        });
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