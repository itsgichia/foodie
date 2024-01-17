document.addEventListener('DOMContentLoaded', () => {
    const categorySelector = document.getElementById('categorySelector');
    const foodGallery = document.getElementById('foodGallery');

    if (categorySelector) {
        categorySelector.addEventListener('change', fetchAndDisplayFood);
    } else {
        console.error('Category selector not found.');
    }

    function fetchAndDisplayFood() {
        const selectedCategory = categorySelector.value;

        fetchFoodData(selectedCategory)
            .then(data => displayFoodGallery(data))
            .catch(error => console.error('Error fetching and displaying food data:', error));
    }

    function fetchFoodData(category) {
        return fetch(`https://world.openfoodfacts.org/cgi/search.pl?category=${category}&json=1`)
            .then(response => response.json());
    }

    function displayFoodGallery(data) {
        // Clear previous content
        foodGallery.innerHTML = '';

        // Display food products
        data.products.forEach(product => {
            const foodCard = createFoodCard(product);
            foodGallery.appendChild(foodCard);
        });
    }

    function createFoodCard(product) {
        const card = document.createElement('div');
        card.className = 'card';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const foodImage = createImage(product.image_url, product.product_name);
        const commentSection = createCommentSection(product);
        const upvoteButton = createButton('Upvote', () => upvoteProduct(product.product_name));

        [foodImage, commentSection, upvoteButton].forEach(element => cardBody.appendChild(element));

        card.appendChild(cardBody);

        return card;
    }

    function createImage(src, alt) {
        const image = document.createElement('img');
        image.src = src;
        image.className = 'card-img-top';
        image.alt = alt;
        return image;
    }

    function createCommentSection(product) {
        const commentSection = document.createElement('div');
        commentSection.className = 'comment-section';

        if (product.comments && product.comments.length > 0) {
            const commentsList = document.createElement('ul');
            product.comments.forEach(comment => {
                const listItem = document.createElement('li');
                listItem.textContent = comment;
                commentsList.appendChild(listItem);
            });
            commentSection.appendChild(commentsList);
        }

        const commentForm = createCommentForm(product);
        commentSection.appendChild(commentForm);

        return commentSection;
    }

    function createCommentForm(product) {
        const form = document.createElement('form');
        form.addEventListener('submit', event => {
            event.preventDefault();
            const newComment = form.querySelector('input').value;
            product.comments = product.comments || [];
            product.comments.push(newComment);
            form.reset();
            updateCommentSection(product);
        });

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Add a comment...';

        const submitButton = document.createElement('button');
        submitButton.className = 'btn btn-primary';
        submitButton.type = 'submit';
        submitButton.textContent = 'Add Comment';

        [input, submitButton].forEach(element => form.appendChild(element));

        return form;
    }

    function updateCommentSection(product) {
        const commentSection = document.querySelector('.comment-section');
        commentSection.innerHTML = '';
        commentSection.appendChild(createCommentSection(product));
    }

    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.className = 'btn btn-primary';
        button.textContent = text;
        button.addEventListener('click', onClick);
        return button;
    }

    function upvoteProduct(productName) {
        const upvotes = {};
        upvotes[productName] = upvotes[productName] || 0;
        upvotes[productName]++;
        alert(`${productName} has been upvoted! Total upvotes: ${upvotes[productName]}`);
        // Update UI to reflect the upvote count if needed
    }
});
