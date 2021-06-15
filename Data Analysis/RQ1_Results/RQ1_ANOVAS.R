
my_data <- read.csv(file.choose())

# TWo-way anova
res.aov2 <- aov(fsa_score ~ Rank + Label, data = my_data)
summary(res.aov2)

res.aov2 <- aov(fsa_score ~ Rank * Label, data = my_data)
summary(res.aov2)

# One-way anova
res.aov <- aov(fsa_score ~ condition, data = my_data)
summary(res.aov)