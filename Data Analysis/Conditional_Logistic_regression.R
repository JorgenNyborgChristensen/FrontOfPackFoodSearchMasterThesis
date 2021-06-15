

#list <- read.csv("recipe_list.csv")

# Regular logistic regression
glm.fit <- glm(selected ~ fsa_score_x + position + avg_rating + fat_per_100g + number_of_ratings, data = recipe_list, family = binomial)
summary(glm.fit)


## Conditional logistic regression
library(survival)

clogit.fit <- clogit(selected ~ fsa_score_x + position + avg_rating + fat_per_100g + number_of_ratings + list_id, data = recipe_list)

summary(clogit.fit)


model = clogit(selected ~ fsa_score_x + position + avg_rating  + strata(list_id), data=recipe_list)
summary(model)

# Clustered logistic regression
