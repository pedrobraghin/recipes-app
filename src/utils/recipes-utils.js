export class RecipesUtils {
  static groupRecipesByCategory(recipes) {
    const result = recipes.reduce((x, y) => {
      (x[y.categories[0].name] = x[y.categories[0].name] || []).push(y);

      return x;
    }, {});

    return result;
  }

  static calculateAverageRecipeRatings(ratings) {
    const average =
      ratings.reduce((sum, { rating }) => {
        return sum + rating;
      }, 0) / ratings.length;

    return average;
  }
}
