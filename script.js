const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');


searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);