// Search
function searchRecipeID(query) {
  const url = `https://recipe-search-1.herokuapp.com/searchid/${query}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      recipes = data;
      console.log(recipes);
    })
    .catch((error) => {
      console.log(error);
    });
}

searchRecipeID(
  "http://allrecipes.com/recipe/chinese-chicken-salad/detail.aspx"
);
