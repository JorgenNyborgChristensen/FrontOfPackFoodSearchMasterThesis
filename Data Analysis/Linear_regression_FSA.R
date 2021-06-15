

list <- read.csv(file.choose())


glm.fit <- glm(selected ~ fsa_score_x + position + avg_rating + fat_per_100g + number_of_ratings, data = list, family = binomial)
summary(glm.fit)