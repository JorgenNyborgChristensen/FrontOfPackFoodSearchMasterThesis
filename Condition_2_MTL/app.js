const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { pool } = require("./config");

const app = express();

// use the express-static middleware to serve HTML, CSS JS from public folder
app.use(express.static("public", { index: "landing_page.html" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

// GET recipe by id
const searchRecipeId = (req, res) => {
  const recipe_id = String(req.params.recipe_id);

  // use $1 as a placeholder to avoid SQL injection and pass the id through as a parameter, instead of building a concatenated string, which would be less secure.
  // use UPPER to search with both upper and lowercase letters
  pool.query(
    "SELECT * FROM recipes WHERE recipe_id LIKE ('%' || $1 || '%')",
    [recipe_id],
    (error, res) => {
      if (error) {
        throw error;
      }
      res.status(200).json(res.rows);
    }
  );
};

// GET recipes by name, use colon (:) to denote route parameter --> RATING RANK
const searchRecipePopularityRank = (request, response) => {
  const recipe_name = String(request.params.recipe_name);

  // use $1 as a placeholder to avoid SQL injection and pass the id through as a parameter, instead of building a concatenated string, which would be less secure.
  // use UPPER to search with both upper and lowercase letters
  pool.query(
    "SELECT * FROM recipes WHERE UPPER(keyword) LIKE UPPER('%' || $1 || '%') ORDER BY avg_rating DESC",
    [recipe_name],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

// GET recipes by name --> HEALTH RANK FSA
const searchRecipeHealthFSA = (request, response) => {
  const recipe_name = String(request.params.recipe_name);

  pool.query(
    "SELECT * FROM recipes WHERE UPPER(keyword) LIKE UPPER('%' || $1 || '%') ORDER BY fsa_score ASC",
    [recipe_name],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

// GET recipes by name --> HEALTH RANK Nutriscore
const searchRecipeHealthNS = (request, response) => {
  const recipe_name = String(request.params.recipe_name);

  pool.query(
    "SELECT * FROM recipes WHERE UPPER(keyword) LIKE UPPER('%' || $1 || '%') ORDER BY nutri_score ASC",
    [recipe_name],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

// GET and order by random()
const searchRecipeRandom = (request, response) => {
  const recipe_name = String(request.params.recipe_name);
  pool.query(
    "SELECT * FROM recipes WHERE UPPER(keyword) LIKE UPPER('%' || $1 || '%') ORDER BY RANDOM ()",
    [recipe_name],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

// POST Main survey
const demographics_survey = (req, res) => {
  const user_id = parseInt(req.body.user_id);
  const condnum = parseInt(req.body.condnum);
  //const prolific_id = req.body.prolific;
  const nationality = req.body.nationality;
  const gender = req.body.gender;
  const age = parseInt(req.body.age);
  const education = req.body.education;
  const experience = req.body.cooking;
  const eating_habits = req.body.health;
  const goal = [];
  const time = req.body.time;
  const restrictions = [];
  const redirect = req.body.redirect;

  if (req.body.vegan !== undefined) {
    restrictions.push(req.body.vegan);
  }
  if (req.body.ingredient !== undefined) {
    restrictions.push(req.body.ingredient);
  }
  if (req.body.image !== undefined) {
    restrictions.push(req.body.image);
  }
  if (req.body.lactose !== undefined) {
    restrictions.push(req.body.lactose);
  }
  if (req.body.halal !== undefined) {
    restrictions.push(req.body.halal);
  }
  if (req.body.gluten !== undefined) {
    restrictions.push(req.body.gluten);
  }
  if (req.body.pescatarian !== undefined) {
    restrictions.push(req.body.pescatarian);
  }
  if (req.body.allergies !== undefined) {
    restrictions.push(req.body.allergies);
  }
  if (req.body.other_restriction !== "") {
    restrictions.push(req.body.other_restriction);
  }
  if (req.body.no_restriction !== undefined) {
    restrictions.push(req.body.no_restriction);
  }
  if (req.body.protein !== undefined) {
    goal.push(req.body.protein);
  }
  if (req.body.salt !== undefined) {
    goal.push(req.body.salt);
  }
  if (req.body.fruit !== undefined) {
    goal.push(req.body.fruit);
  }
  if (req.body.vegetables !== undefined) {
    goal.push(req.body.vegetables);
  }
  if (req.body.lweight !== undefined) {
    goal.push(req.body.lweight);
  }
  if (req.body.gweight !== undefined) {
    goal.push(req.body.gweight);
  }
  if (req.body.other_goal !== "") {
    goal.push(req.body.other_goal);
  }
  if (req.body.nogoal !== undefined) {
    goal.push(req.body.nogoal);
  }

  pool.query(
    "INSERT INTO demographics(user_id, condnum, gender, age, education, nationality, experience, eating_habits, goal, restrictions, iso_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
    [
      user_id,
      condnum,
      gender,
      age,
      education,
      nationality,
      experience,
      eating_habits,
      goal,
      restrictions,
      time,
    ],
    (error) => {
      if (error) {
        throw error;
      }
      res.redirect(redirect);
      //res.status(201).end();
    }
  );
};

// POST Selected recipe + survey
const selectRecipe = (req, res) => {
  const variant = parseInt(req.body.variant);
  const user_id = parseInt(req.body.user_id);
  const redirect = req.body.redirect;
  const choice = req.body.choice;
  const queryTermForm = req.body.queryTermForm;
  const order = req.body.order;
  const choice_num = parseInt(req.body.choice_num);
  const condition = parseInt(req.body.condition);
  const submitted_at = req.body.submitted_at;
  const loadMore = req.body.loadMore;
  const choice_sat_q1 = parseInt(req.body.choice_sat_q1);
  const choice_sat_q2 = parseInt(req.body.choice_sat_q2);
  const choice_sat_q3 = parseInt(req.body.choice_sat_q3);
  const choice_sat_q4 = parseInt(req.body.choice_sat_q4);
  const choice_sat_q5 = parseInt(req.body.choice_sat_q5);
  const choice_sat_q6 = parseInt(req.body.choice_sat_q6);
  const choice_sat_q7 = parseInt(req.body.choice_sat_q7);

  pool.query(
    "INSERT INTO shownrecipes(variant, user_id, recipe_id, query_term, recipe_order,choice_num,condition,submitted_at,load_more, choice_sat_q1 ,choice_sat_q2,choice_sat_q3,choice_sat_q4,choice_sat_q5, choice_sat_q6, choice_sat_q7) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)",
    [
      variant,
      user_id,
      choice,
      queryTermForm,
      order,
      choice_num,
      condition,
      submitted_at,
      loadMore,
      choice_sat_q1,
      choice_sat_q2,
      choice_sat_q3,
      choice_sat_q4,
      choice_sat_q5,
      choice_sat_q6,
      choice_sat_q7,
    ],
    (error) => {
      if (error) {
        throw error;
      }
      res.redirect(redirect);
    }
  );
};

// POST Selected recipe + survey
const endSurvey = (req, res) => {
  const user_id = parseInt(req.body.user_id);
  const condition = parseInt(req.body.condition);
  const submitted_at = req.body.submitted_at;
  const label_q1 = req.body.label_q1;
  const label_q2 = req.body.label_q1;
  const label_q3 = [];

  if (req.body.health !== undefined) {
    label_q3.push(req.body.health);
  }
  if (req.body.ingredient !== undefined) {
    label_q3.push(req.body.ingredient);
  }
  if (req.body.image !== undefined) {
    label_q3.push(req.body.image);
  }
  if (req.body.rating !== undefined) {
    label_q3.push(req.body.rating);
  }
  if (req.body.numrating !== undefined) {
    label_q3.push(req.body.numrating);
  }
  if (req.body.cal !== undefined) {
    label_q3.push(req.body.cal);
  }
  if (req.body.salt !== undefined) {
    label_q3.push(req.body.salt);
  }
  if (req.body.sugar !== undefined) {
    label_q3.push(req.body.sugar);
  }
  if (req.body.fat !== undefined) {
    label_q3.push(req.body.fat);
  }
  if (req.body.protein !== undefined) {
    label_q3.push(req.body.protein);
  }
  if (req.body.title !== undefined) {
    label_q3.push(req.body.title);
  }
  if (req.body.goals !== undefined) {
    label_q3.push(req.body.goals);
  }
  if (req.body.other_reason !== "") {
    label_q3.push(req.body.other_reason);
  }

  pool.query(
    "INSERT INTO endsurvey(user_id, condition,submitted_at, label_q1 ,label_q2,label_q3) VALUES ($1, $2, $3, $4, $5, $6)",
    [user_id, condition, submitted_at, label_q1, label_q2, label_q3],
    (error) => {
      if (error) {
        throw error;
      }
      res.redirect("end_page.html");
    }
  );
};

// GET POULARITY RANK
app.route("/search1/:recipe_name").get(searchRecipePopularityRank);

// GET RANDOM RANK
app.route("/search2/:recipe_name").get(searchRecipeRandom);

// GET HEALTH RANK FSA
app.route("/search3/:recipe_name").get(searchRecipeHealthFSA);

// GET HEALTH RANK NS
app.route("/search4/:recipe_name").get(searchRecipeHealthNS);

// GET recipe by id
app.route("/searchid/:recipe_id").get(searchRecipeId);

// POST Main survey
app.route("/demographicssurvey").post(demographics_survey);

// POST Selected recipe + survey
app.route("/selectrecipe").post(selectRecipe);

// POST end survey about label info
app.route("/endsurvey").post(endSurvey);

// start the server listening for requests
app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));
