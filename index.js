// Wait for the HTML document to be fully loaded before executing JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Get the container element where meal cards will be displayed
    const mealListContainer = document.getElementById('mealList');

    // Fetch meals from the API
    fetch('https://www.themealdb.com/api/json/v1/1/filter.php?a=Malaysian')
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            // Check if meals are available in the data
            if (data.meals && data.meals.length > 0) {
                // Create a meal card for each meal and append it to the container
                data.meals.forEach(meal => mealListContainer.appendChild(createMealCard(meal)));
            } else {
                // Display a message if no meals are found
                mealListContainer.innerHTML = '<p>No meals found</p>';
            }
        })
        .catch(error => {
            // Log an error message and display an error message in case of fetch failure
            console.error('Error fetching data:', error);
            mealListContainer.innerHTML = '<p>Error fetching data</p>';
        });

    // Function to create a meal card
    function createMealCard(meal) {
        // Create a card element
        const card = document.createElement('div');
        card.className = 'card'; // Apply a CSS class for styling

        // Create a card body element
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body'; // Apply a CSS class for styling

        // Create an image element for the meal
        const mealImage = createImage(meal.strMealThumb, meal.strMeal);
        // Create a title element for the meal
        const mealTitle = createTitle(meal.strMeal);
        // Create a "Like" button for the meal
        const likeButton = createButton('Like', () => alert(`You liked ${meal.strMeal}!`));
        // Create a comment form for the meal
        const commentForm = createCommentForm(meal);

        // Append the created elements to the card body
        [mealImage, mealTitle, likeButton, commentForm].forEach(element => cardBody.appendChild(element));

        // Append the card body to the card
        card.appendChild(cardBody);

        // Return the complete card element
        return card;
    }

    // Function to create an image element
    function createImage(src, alt) {
        const image = document.createElement('img');
        image.src = src; // Set the image source from the API data
        image.className = 'card-img-top'; // Apply a CSS class for styling
        image.alt = alt; // Set the alt attribute for accessibility
        return image;
    }

    // Function to create a title element
    function createTitle(titleText) {
        const title = document.createElement('h5');
        title.className = 'card-title'; // Apply a CSS class for styling
        title.textContent = titleText; // Set the text content from the API data
        return title;
    }

    // Function to create a button element
    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.className = 'btn btn-primary'; // Apply CSS classes for styling
        button.textContent = text; // Set the button text
        button.addEventListener('click', onClick); // Add a click event listener
        return button;
    }

    // Function to create a comment form element
    function createCommentForm(meal) {
        // Create a form element
        const form = document.createElement('form');
        // Add a submit event listener to the form
        form.addEventListener('submit', event => {
            event.preventDefault(); // Prevent the default form submission behavior
            const comment = form.querySelector('input').value; // Get the comment from the form input
            // Display an alert with the meal name and the submitted comment
            alert(`You commented on ${meal.strMeal}: ${comment}`);
            form.reset(); // Clear the form input after submission
        });

        // Create an input element for entering comments
        const input = document.createElement('input');
        input.type = 'text'; // Set the input type
        input.placeholder = 'Add a comment...'; // Set a placeholder text

        // Append the input element to the form
        form.appendChild(input);

        // Return the complete form element
        return form;
    }
});