// Recipe card container
const recipeList = document.getElementById("recipe_list");

// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest();

// Open a new connection, using the GET request on the URL endpoint
//request.open("GET", "https://express-recipes.herokuapp.com/recipes", true);

request.open("GET", "http://localhost:3000/recipes", true);
request.onload = function () {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response);

  if (request.status >= 200 && request.status < 400) {
    data.forEach((recipe) => {
      console.log(recipe);

      // Aligner class
      const aligner = document.createElement("div");
      aligner.setAttribute("class", "Aligner");

      recipeList.appendChild(aligner);

      // flip class
      const flip = document.createElement("div");
      flip.setAttribute("class", "flip");

      aligner.appendChild(flip);

      // card class
      const card = document.createElement("div");
      card.setAttribute("class", "card");
      card.setAttribute("id", recipe.servings);

      flip.appendChild(card);

      // face front class
      const faceFront = document.createElement("div");
      faceFront.setAttribute("class", "face front");

      card.appendChild(faceFront);

      // recipe-card
      const recipeCard = document.createElement("div");
      recipeCard.setAttribute("class", "recipe-card");
      faceFront.appendChild(recipeCard);

      const recipeImage = document.createElement("img");
      recipeImage.setAttribute("id", "recipe-card__image");
      recipeCard.appendChild(recipeImage);

      console.log(recipe.imagex);
      document.getElementById("recipe-card__image").src = String(recipe.imagex);

      const recipeContent = document.createElement("div");
      recipeContent.setAttribute("class", "recipe-card__content");
      recipeCard.appendChild(recipeContent);

      // Recipe-card front content
      const recipeTitle = document.createElement("h1");
      recipeTitle.setAttribute("class", "recipe-card__content-recipe-title");
      recipeTitle.textContent = recipe.namex;
      recipeContent.appendChild(recipeTitle);

      // Recipe card info (servins, kcal etc.)
      const recipeStats = document.createElement("ul");
      recipeStats.setAttribute("class", "recipe-card-stats");
      recipeContent.appendChild(recipeStats);

      const recipeStatsItem1 = document.createElement("li");
      recipeStatsItem1.setAttribute("class", "recipe-card-stats__item");
      const servingsStats = document.createElement("h2");
      servingsStats.textContent = recipe.servings;
      recipeStatsItem1.appendChild(servingsStats);
      const servingsP = document.createElement("p");
      servingsP.textContent = "Servings";
      recipeStatsItem1.appendChild(servingsP);
      recipeStats.appendChild(recipeStatsItem1);

      const recipeStatsItem2 = document.createElement("li");
      recipeStatsItem2.setAttribute("class", "recipe-card-stats__item");
      const kcalStats = document.createElement("h2");
      kcalStats.textContent = recipe.calories_kcal;
      recipeStatsItem2.appendChild(kcalStats);
      const kcalP = document.createElement("p");
      kcalP.textContent = "Calories";
      recipeStatsItem2.appendChild(kcalP);

      recipeStats.appendChild(recipeStatsItem2);

      const recipeStatsItem3 = document.createElement("li");
      recipeStatsItem3.setAttribute("class", "recipe-card-stats__item");
      const sizeStats = document.createElement("h2");
      sizeStats.textContent = recipe.size_g;
      recipeStatsItem3.appendChild(sizeStats);
      const sizeP = document.createElement("p");
      sizeP.textContent = "Size";
      recipeStatsItem3.appendChild(sizeP);
      recipeStats.appendChild(recipeStatsItem3);

      // Recipe rating
      const recipeRating = document.createElement("ul");
      recipeRating.setAttribute("class", "recipe-card-rating");
      recipeContent.appendChild(recipeRating);

      const recipeRatingItem = document.createElement("li");
      recipeRatingItem.setAttribute("class", "recipe-card-rating__item");
      recipeRating.appendChild(recipeRatingItem);

      const starsOuter = document.createElement("div");
      starsOuter.setAttribute("class", "stars-outer");
      recipeRatingItem.appendChild(starsOuter);

      const starsInner = document.createElement("div");
      starsInner.setAttribute("class", "stars-inner");
      starsOuter.appendChild(starsInner);

      const starTotal = 5;
      const rating = parseFloat(recipe.average_rating);
      const starPercentage = (rating / starTotal) * 100;
      const starPercentageRounded = `${starPercentage}%`;

      document.querySelector(
        `.stars-inner`
      ).style.width = starPercentageRounded;

      const recipeRatingNum = document.createElement("ul");
      recipeRatingNum.setAttribute("class", "recipe-card-rating__item");
      recipeRatingNum.textContent = recipe.number_of_ratings;
      recipeRating.appendChild(recipeRatingNum);

      // Buttons
      const recipeActions = document.createElement("div");
      recipeActions.setAttribute("class", "recipe-card-actions");
      recipeContent.appendChild(recipeActions);

      const flipButton = document.createElement("a");
      flipButton.setAttribute(
        "class",
        "js-button--recipe button button--primary"
      );
      flipButton.setAttribute("id", recipe.servings);
      flipButton.setAttribute("onclick", "flipIt(this.id)");
      flipButton.textContent = "View Recipe";
      recipeActions.appendChild(flipButton);

      const selectButton = document.createElement("a");
      selectButton.setAttribute(
        "class",
        "select-button button button--primary"
      );

      selectButton.textContent = "Select Recipe";
      recipeActions.appendChild(selectButton);

      // face back
      const faceBack = document.createElement("div");
      faceBack.setAttribute("class", "face back");
      card.appendChild(faceBack);

      const flipBack = document.createElement("a");
      flipBack.setAttribute("class", "recipe-flip-back fa fa-arrow-left");
      flipBack.setAttribute("id", recipe.servings);
      flipBack.setAttribute("onclick", "flipIt(this.id)");
      faceBack.appendChild(flipBack);

      // recipe-details class
      const recipeDetails = document.createElement("div");
      recipeDetails.setAttribute("class", "recipe-details");
      faceBack.appendChild(recipeDetails);

      // recipe-details__summary class
      const recipeDetailsSummary = document.createElement("div");
      recipeDetailsSummary.setAttribute("class", "recipe-details__summary");
      recipeDetails.appendChild(recipeDetailsSummary);
      const recipeh2 = document.createElement("h2");
      recipeh2.textContent = "Method";
      recipeDetailsSummary.appendChild(recipeh2);

      // recipe-details__content
      const recipeDetailsContent = document.createElement("div");
      recipeDetailsContent.setAttribute("class", "recipe-details__content");
      recipeDetails.appendChild(recipeDetailsContent);
    });
  } else {
    console.log("error");
  }
};

request.send();

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

// NOT IN USER, REMOVE
function doX() {
  console.log("XX");
  $(function () {
    $(".Aligner").slice(0, 1).show(); // select the first ten
    $("#loadMore").click(function (e) {
      // click event for load more
      e.preventDefault();
      $(".Aligner:hidden").slice(0, 1).show(); // select next 10 hidden divs and show them
      if ($(".Aligner:hidden").length == 0) {
        // check if any hidden divs still exist
        alert("No more divs"); // alert if there are none left
      }
    });
  });
}
