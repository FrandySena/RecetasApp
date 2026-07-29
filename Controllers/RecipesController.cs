using Microsoft.AspNetCore.Mvc;
using RecetasApp.Models;
using RecetasApp.Services;

namespace RecetasApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecipesController : ControllerBase
{
    private readonly RecipeService _service;

    public RecipesController(RecipeService service)
    {
        _service = service;
    }

    [HttpPost]
    public IActionResult Create([FromBody] Recipe recipe)
    {
        if (string.IsNullOrWhiteSpace(recipe.Title))
            return BadRequest(new { message = "El título es obligatorio" });

        _service.Add(recipe);
        return Ok(recipe);
    }
}