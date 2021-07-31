const mealsEl = document.getElementById('meals');
const favoriteContainer = document.getElementById('fav-meals');
const searchTerm= document.getElementById('search-term');
const search= document.getElementById('search');

getRandomMeal();
fetchFavMeal();

async function getRandomMeal() {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const respData = await resp.json();
    const randomMeal = respData.meals[0];

    console.log(randomMeal);

    addMeal(randomMeal, true);
}

async function getMealById(id) {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);

    const respData = await resp.json();
    const meal = respData.meals[0];

    return meal;
}

async function getMealsBySearch(term) {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term);

    const respData = await resp.json();
    const meals = respData.meals;

    return meals;
}

function addMeal(mealData, random = false) {
    const meal = document.createElement('div');
    meal.classList.add('meal');

    meal.innerHTML = `
        <div class="meal-header">
        ${random ? ' <span class="random"> Random Recipes </span> ' : ''}
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        </div>                    
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn ">
                <i class="fas fa-heart"></i>
            </button>                    
        </div>
    `;

    const btn = meal.querySelector('.meal-body .fav-btn');
    btn.addEventListener('click', () => {
        if(btn.classList.contains('active')) {
            removeMealLS(mealData.idMeal);
            btn.classList.remove('active');
        } else {
            addMealLS(mealData.idMeal);
            btn.classList.add('active');
        }

        fetchFavMeal();
    });

    meals.appendChild(meal);
}

function addMealLS(mealId) {
    const mealIds = getMealLS();

    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
}   

function removeMealLS(mealId) {
    const mealIds = getMealLS();

    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id => id !== mealId)));
}

function getMealLS() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));

    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeal() {
    //CLEAN THE CONTAINER
    favoriteContainer.innerHTML = " ";

    const mealIds = getMealLS();

    for(let i=0; i<mealIds.length; i++) {
        const mealId = mealIds[i];
        meal = await getMealById(mealId);
        
        addMealFav(meal);
    }
}


function addMealFav(mealData) {
    const favMeal = document.createElement('li');

    favMeal.innerHTML = `
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        <span> ${mealData.strMeal} </span>
        <button class="clear"><i class="fas fa-window-close"></i></button>
    `;

    const btn = favMeal.querySelector('.clear');

    btn.addEventListener('click', () => {
        removeMealLS(mealData.idMeal);

        fetchFavMeal();
    });

    favoriteContainer.appendChild(favMeal);
}

search.addEventListener('click', async () => {
    // CLEAN CONTAINER
    mealsEl.innerHTML = " ";

    const search = searchTerm.value;

    const meals = await getMealsBySearch(search);

    if(meals){
        meals.forEach((meal) => {
            addMeal(meal);
        });
    }
});

