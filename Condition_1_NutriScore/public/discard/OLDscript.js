let recipes = [];
let recipesPages = [];
let selectedPage;
let selectedIndex;
let startIndex;
let endIndex;
let pagingList;

fetch("http://localhost:3000/recipes")
  .then((response) => response.json())
  .then((json) => {
    recipes = json;
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
  });

injectPagination = () => {
  pagingList = `
            <li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="goPrevious()">Previous</a></li>
            <li class="page-item"><span class="page-link" id="spanSelectedPage">${selectedPage} | ${recipesPages.length}</span></li>
            <li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="goNext()">Next</a></li>
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
              <div class="card" id="${recipe.servings}">
                <div class="face front">
                  <div class="recipe-card">
                    <img
                      id="recipe-card__image"
                      src="${recipe.imagex}"
                    />
                    <div class="recipe-card__content">
                      <h1 class="recipe-card__content-recipe-title">
                      ${recipe.namex}
                      </h1>
                      <ul class="recipe-card-stats">
                        <li class="recipe-card-stats__item">
                          <h2>${recipe.servings}</h2>
                          <p>Servings</p>
                        </li>
                        <li class="recipe-card-stats__item">
                          <h2>${recipe.calories_kcal}</h2>
                          <p>Calories</p>
                        </li>
                        <li class="recipe-card-stats__item">
                          <h2>${recipe.size_g}</h2>
                          <p>Size</p>
                        </li>
                      </ul>
                      <ul class="recipe-card-rating">
                        <li class="recipe-card-rating__item">
                          <div class="stars-outer">
                            <div class="stars-inner" style="width: ${calculateStars(
                              recipe.average_rating
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
                          id="${recipe.servings}"
                          onclick="flipIt(this.id)"
                          >View Recipe</a
                        ><a class="select-button button button--primary"
                          >Select Recipe</a
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <div class="face back">
                  <a
                    class="recipe-flip-back fa fa-arrow-left"
                    id="${recipe.servings}"
                    onclick="flipIt(this.id)"
                  ></a>
                  <div class="recipe-details">
                    <div class="recipe-details__summary"><h2>Method</h2></div>
                    <div class="recipe-details__content"></div>
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

function loadMore() {
  document.querySelector(".Aligner").slice(0, 10).show();
  document.getElementById("loadMore").addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector;
  });
}
