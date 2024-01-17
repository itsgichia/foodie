# Foodie Project

## Description

**Foodie** is a web application that leverages The Meal DB API to provide users with a delightful experience exploring and discovering meals from different regions. The project focuses on a user-centric approach, and planning involves features development based on user stories.

## Planning

### Features

- **Feature 1: Explore Meals by Area**
  - **User Story:** As a user, I want to filter meals by a specific area so that I can discover diverse cuisines.
  
- **Feature 2: View Meal Details**
  - **User Story:** As a user, I want to view detailed information about a specific meal so that I can learn more about its ingredients and preparation.

- **Feature 3: Responsive Design**
  - **User Story:** As a user, I want the application to be accessible and visually appealing on different devices and screen sizes.

### JSON Request Structure

The project uses The Meal DB API with the following structure:

- Endpoint: `https://www.themealdb.com/api/json/v1/1/filter.php?a=Malaysian`

### Files

The project consists of the following files:

- `index.html`: The main HTML file for the application.
- `index.js`: JavaScript file responsible for handling API requests and manipulating the DOM.
- `styles.css`: CSS file for styling the application.

### Development Steps

1. **Explore Meals by Area**
   - Use the provided API endpoint to fetch a list of meals based on a specific area.
   - Dynamically populate the UI with the retrieved meal data.
   - Implement event handlers to respond to user interactions.

2. **View Meal Details**
   - Integrate the API to fetch detailed information about a specific meal.
   - Display the retrieved information in a modal or a dedicated section.
   - Ensure a seamless user experience when transitioning between meal details.

3. **Responsive Design**
   - Utilize media queries in the CSS to create a responsive design.
   - Test the application on various devices to ensure a consistent and user-friendly layout.

### Author

- Author: Gichia Muiruri
- Contact: gichiamuiruri@gmail.co

### License

This project is licensed under the MIT. See the https://choosealicense.com/licenses/mit/ for details.

## Getting Started

To run the Foodie project locally, follow these steps:

1. Clone the repository: `git clone git@github.com:itsgichia/foodie.git`
2. Open `index.html` in your preferred web browser.

## Contribution

We welcome contributions! Please check the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

## Issues

If you encounter any issues or have suggestions, please create an issue on the [issue tracker](https://github.com/[your-username]/foodie/issues).
