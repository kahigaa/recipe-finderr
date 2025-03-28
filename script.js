const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');


searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
}
);

function getMealList(){
    let searchInputTxt = document.getElementById('search-input').value; 
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`) 
    .then(response => response.json())   
    .then(data => {                      
        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">    
                    <div class = "meal-img">
                    <img src = "${meal.strMealThumb}" alt = "food">
                    </div>
                    <div class = "meal-name">
                    <h3>${meal.strMeal}</h3>
                    <a href = "#" class = "recipe-btn">Get Recipe</a>
                    </div>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        } else{
            html = "Sorry, we didn't find any meal!";
            mealList.classList.add('notFound');
        }

        mealList.innerHTML = html;
    });
}

function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){ 
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals)); 
    }
}

function mealRecipeModal(meal) {
    // Get the first meal object from the array
    meal = meal[0];
    // Initialize an empty string to store the list of ingredients
    let ingredientsList = '';
    // Loop through possible 20 ingredients
    for (let i = 1; i <= 20; i++) {
        // Get the ingredient and remove extra spaces if it exists
        let ingredient = meal[`strIngredient${i}`]?.trim();
        // Get the corresponding measurement for the ingredient
        let measure = meal[`strMeasure${i}`];
        // If the ingredient exists it is added to the list
        if (ingredient) {
            ingredientsList += `<li>${ingredient} - ${measure}</li>`;
        }
    }
}
    
    let html = `
        <div class="recipe-header">
            <h2 class="recipe-title">${meal.strMeal}</h2>
            <p class="recipe-category">${meal.strCategory}</p>
            <div class="recipe-meal-img">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            </div>
        </div>
        
        <div class="recipe-details">
            <div class="recipe-ingredients">
                <h3>Ingredients:</h3>
                <ul class="ingredients-list">
                    ${ingredientsList}
                </ul>
            </div>
            
            <div class="recipe-instruct">
                <h3>Instructions:</h3>
                <p>${formatInstructions(meal.strInstructions)}</p>
            </div>
        </div>
        
    `;
    
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');


function formatInstructions(instructions) {
    return instructions.split('\r\n').filter(step => step.trim() !== '').join('<br><br>');
}