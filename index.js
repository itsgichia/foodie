// Event listener to execute code when the DOM (document) is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the container elemen to display meals
    const mealListContainer = document.getElementById('mealList');

    // Fetch meals from the API
    fetch('https://www.themealdb.com/api/json/v1/1/filter.php?a=Malaysian')
        .then(response => response.json()) // parse the JSON response
        .then(data => {
            console.log('data from api:', data); // log data to the console for debugging

            // Check if meals are available in the data
            if(data.meals && data.meals.length > 0){
                // Display each meal by creating HTML elements dynamically
                data.meals.forEach(meal => {
                    const mealCard = createMealCard(meal);
                    mealListContainer.appendChild(mealCard);
                });
            } 
            else() =>{
                // Display a message if no meals are found
                mealListContainer.innerHTML = '<p> No meals found </p>';
            }
        })
        
})