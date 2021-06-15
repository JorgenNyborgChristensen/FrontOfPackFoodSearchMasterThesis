//`https://recipe-search-1.herokuapp.com/${query}`;
//`http://localhost:3000/search1/${query}`

let recipes = [];
let recipesPages = [];
let selectedPage;
let selectedIndex;
let startIndex;
let endIndex;
let pagingList;

// Search
function searchRecipe(query) {
  const url = `https://recipe-search-2.herokuapp.com/search1/${query}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      recipes = data;
      renderResults(recipes);
      getRecipeOrder(recipes);
      document.getElementById("order").value = sessionStorage.getItem("order");
      choiceNumber();
    })
    .catch((error) => {
      console.log(error);
    });
}

function renderResults(recipes) {
  //paging
  let pagesNumber = recipes.length / 10;
  const pagesNumberRemainder = pagesNumber % 1;
  const pagesNumberWithoutRemainder = Math.floor(pagesNumber);
  if (pagesNumberRemainder > 0)
    pagesNumber = Number(pagesNumberWithoutRemainder) + 1;
  recipesPages = Array(pagesNumber)
    .fill(1)
    .map((x, i) => i + 1);
  startIndex = 0;
  endIndex = 10;
  selectedPage = 1;
  //fill the paging list
  injectPagination();
  //start mapping the list
  injectPage();
}

let searchTimeOutToken = 0;

window.onload = () => {
  const searchrecipe = document.getElementById("searchKeyword");
  const searchButton = document.getElementById("searchButton");
  const qo = JSON.parse(sessionStorage.getItem("queryTermsOrder"));
  const term = qo[0].toString();

  searchButton.onclick = (event) => {
    clearTimeout(searchTimeOutToken);
    searchTimeOutToken = setTimeout(() => {
      if (searchrecipe.value.toLowerCase() === term.toLowerCase()) {
        searchRecipe(searchrecipe.value);
      } else {
        alert("Please use the correct search term: " + term);
      }
    }, 250);
  };

  searchrecipe.addEventListener("keypress", (event) => {
    if (event.keyCode == 13) {
      event.preventDefault();
      clearTimeout(searchTimeOutToken);
      searchButton.click();
    }
  });
};
// End search

// Create elements
injectPagination = () => {
  pagingList = `
  <li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="goPrevious()"><i class="fas fa-arrow-left"></i></a></li>
  <li class="page-item"><span class="page-link" id="spanSelectedPage">${selectedPage} | ${recipesPages.length}</span></li>
  <li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="goNext()"><i class="fas fa-arrow-right"></i></a></li>
        `;
  document.getElementById("paging").innerHTML = pagingList;
};

injectPage = () => {
  const list = recipes
    ? recipes
        .slice(startIndex, endIndex)
        .map(
          (recipe, index) =>
            `<div class="Aligner">
        <div class="flip">
          <div class="card" id="${recipe.recipe_id}">
            <div class="face front">
              <div class="recipe-card">
              <div class="recipe-title"> <h1 class="recipe-card__content-recipe-title">
              ${recipe.recipe_name}
              </h1>
          </div>

                <div class="recipe-card__content"> 
                <div class="recipe-image"> 
                <img
                id="recipe-card__image"
                src="${recipe.recipe_image_link}"
              />
              </div>
              <div class="recipe-content-box">

                  <div id="mtl-label">
                  <div class="mtl-item" id="mtl-1" data-color-code=${
                    recipe.sugar_mtl
                  }> 
                    <div class="mtl-text">
                      <h2>${toUpper(recipe.sugar_mtl)}</h2>
                    </div>
                    <div class="mtl-info">
                      <h3>Sugar</h3>
                      <h1>${Math.floor(recipe.sugar_per_100g)}g</h1>
                    </div>
                  </div>
                  <div class="mtl-item" id="mtl-2" data-color-code=${
                    recipe.fat_mtl_score
                  }> 
                    <div class="mtl-text">
                      <h2>${toUpper(recipe.fat_mtl_score)}</h2>
                    </div>
                    <div class="mtl-info">
                      <h3>Fat</h3>
                      <h1>${Math.floor(recipe.fat_per_100g)}g</h1>
                    </div>
                  </div>
                  <div class="mtl-item" id="mtl-3" data-color-code=${
                    recipe.saturated_fat_mtl_score
                  }> 
                    <div class="mtl-text">
                      <h2>${toUpper(recipe.saturated_fat_mtl_score)}</h2>
                    </div>
                    <div class="mtl-info">
                      <h3>Sat Fat</h3>
                      <h1>${Math.floor(recipe.saturated_fat_per_100g)}g</h1>
                    </div>
                  </div>
                  <div class="mtl-item" id="mtl-4" data-color-code=${
                    recipe.sodium_mtl
                  }> 
                    <div class="mtl-text">
                      <h2>${toUpper(recipe.sodium_mtl)}</h2>
                    </div>
                    <div class="mtl-info">
                      <h3>Salt</h3>
                      <h1>${
                        Math.round((recipe.sodium_per_100g / 1000) * 10) / 10
                      }g</h1>
                    </div>
                  </div>
                </div>

                  <ul class="recipe-card-stats">
                    <li class="recipe-card-stats__item">
                      <h2>${recipe.recipe_servings.split(" ")[0]}</h2>
                      <p>Servings</p>
                    </li>
                    <li class="recipe-card-stats__item">
                      <h2>${recipe.recipe_calories}</h2>
                      <p>Calories</p>
                    </li>
                    <li class="recipe-card-stats__item">
                    <h2>${Math.floor(
                      recipe.total_gram_weight / recipe.recipe_serving
                    )}g</h2>
                    <p>Serving Size</p>
                    </li>
                  </ul>
                  <ul class="recipe-card-rating">
                    <li class="recipe-card-rating__item">
                      <div class="stars-outer">
                        <div class="stars-inner" style="width: ${calculateStars(
                          recipe.avg_rating
                        )}"></div>
                      </div>
                    </li>
                    <ul class="recipe-card-rating__item">
                    ${recipe.number_of_ratings}
                    </ul>
                  </ul>
                  <div class="recipe-card-actions">
                    <a
                      class="js-button--recipe button button--primary"
                      id="${recipe.recipe_id}"
                      onclick="flipIt(this.id)"
                      >View Recipe</a
                    ><a class="select-button button button--primary" id="${
                      recipe.recipe_id
                    }"  href="${choiceSurveyRedirect()}" onclick="sessionStoreAppend(this.id)"
                      >Select Recipe</a
                    >
                  </div>
                </div>
                </div>

              </div>
            </div>
            <div class="face back">
              <a
                class="recipe-flip-back fa fa-arrow-left"
                id="${recipe.recipe_id}"
                onclick="flipIt(this.id)"
              ></a>
              <div class="recipe-details">
              <div class="recipe-details__summary">
                <h2>Directions</h2>
                <p>${recipe.recipe_directions}</p>
              </div>
              <div class="recipe-details__content">
                <h2>Ingredients</h2>
                <p>${ingredientNewline(recipe.ingredients)}</p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>`
        )
        .join("") //to prevent unexpected comma
    : "";
  document.getElementById("recipe_list").innerHTML = list;
};

goPrevious = () => {
  if (selectedPage != 1) {
    startIndex -= 10;
    endIndex -= 10;
    selectedPage--;
    injectPage();
    injectPagination();
  }
};

goNext = () => {
  if (selectedPage < recipesPages.length) {
    startIndex += 10;
    endIndex += 10;
    selectedPage++;
    injectPage();
    injectPagination();
  }
};

function calculateStars(ratingNum) {
  const starTotal = 5;
  const rating = parseFloat(ratingNum);
  const starPercentage = (rating / starTotal) * 100;
  const starPercentageRounded = `${starPercentage}%`;
  return starPercentageRounded;
}

// Flip recipe cards
function flipIt(id) {
  document.querySelector(`#${CSS.escape(id)}`).classList.toggle("flipped");

  //e.preventDefault();
}

// Convert medium to med
function toUpper(value) {
  if (value == "medium") {
    value = "MED";
  } else if (value == "high") {
    value = "HIGH";
  } else {
    value = "LOW";
  }
  return value;
}

// Set MTL color
function MTLcolor(id, value) {
  if (value == "medium") {
    value = "yellow";
  } else if (value == "high") {
    value = "red";
  } else {
    value = "green";
  }
  document.getElementById(id).style.background = value;
}

// Newline for each ingredient
function ingredientNewline(ingredients) {
  ing = ingredients.split();
  return ingredients.replaceAll(",", "<br />");
}

// Newline for each ingredient
function ingredientNewline(ingredients) {
  ing = ingredients.split();
  return ingredients.replaceAll(",", "<br />");
}

function sessionStoreAppend(data) {
  sessionStorage.setItem("choice", data);
}

// End create elements

// Get the order of the recipes, save to object key=order value=recipe_id
function getRecipeOrder(recipes) {
  const recipeOrder = {};
  //const elements = document.getElementsByClassName("card");
  for (var i = 0; i < recipes.length; i++) {
    recipeOrder[i] = recipes[i].recipe_id;
  }
  sessionStorage.setItem("order", JSON.stringify(recipeOrder));
}

function displayQueryTerm() {
  const terms = sessionStorage.getItem("queryTermsOrder");
  console.log(terms);
}

// Generate Query Terms, in random order
function getQueryTermOrder() {
  var array = ["Chicken", "Salad", "Soup"];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
// Get item, and remove from session storage array
function getQueryTermAndRemove() {
  var qo = JSON.parse(sessionStorage.getItem("queryTermsOrder"));
  const term = qo[0].toString();
  sessionStorage.setItem("prevQueryTerm", JSON.stringify(term));
  qo.shift();
  sessionStorage.setItem("queryTermsOrder", JSON.stringify(qo));
  console.log(term);
  return term;
}
// Set query term
/*
const queryTerm = document.getElementById("queryTerm");
const queryTermForm = document.getElementById("queryTermForm");
const qo = getQueryTermAndRemove();
queryTerm.textContent = qo;
queryTermForm.value = qo;*/

const queryTerm = document.getElementById("queryTerm");
const queryTermForm = document.getElementById("queryTermForm");
var qo = JSON.parse(sessionStorage.getItem("queryTermsOrder"));
const term = qo[0].toString();
queryTerm.textContent = term;
queryTermForm.value = term;

// Get time now
var time = document.getElementById("time");
var now = new Date();
var timeNow = now.toISOString();
time.value = timeNow;

// Set chosen recipe in choice_survey
const choice_id = document.getElementById("choice");
choice_id.value = sessionStorage.getItem("choice");

// Redirect from choice to choice survey
function choiceSurveyRedirect() {
  if (sessionStorage.getItem("choice_num") === "1") {
    var redirect = "choice_1_survey.html";
  } else if (sessionStorage.getItem("choice_num") === "2") {
    var redirect = "choice_2_survey.html";
  } else if (sessionStorage.getItem("choice_num") === "3") {
    var redirect = "choice_3_survey.html";
  }
  return redirect;
}
