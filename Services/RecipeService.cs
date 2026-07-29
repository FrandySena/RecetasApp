using RecetasApp.Models;

namespace RecetasApp.Services;

public class RecipeService
{
    private readonly List<Recipe> _recipes = new();

    public IEnumerable<Recipe> GetAll() => _recipes;
    public Recipe? GetById(string id) => _recipes.FirstOrDefault(r => r.Id == id);
    public void Add(Recipe recipe) => _recipes.Add(recipe);

    public bool Update(Recipe recipe)
    {
        var index = _recipes.FindIndex(r => r.Id == recipe.Id);
        if (index == -1) return false;
        _recipes[index] = recipe;
        return true;
    }

    public bool Delete(string id)
    {
        var recipe = GetById(id);
        if (recipe == null) return false;
        return _recipes.Remove(recipe);
    }
}