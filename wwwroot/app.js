const STORAGE_KEY = 'recetas_app_v2';

document.addEventListener('DOMContentLoaded', () => {
    initData();
    renderRecipes();

    document.getElementById('recipeForm').addEventListener('submit', handleFormSubmit);
});

function getStoredRecipes() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveStoredRecipes(recipes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    renderRecipes();
}

function initData() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        const defaults = [
            { id: "1", title: "Sancocho Dominicano", category: "Almuerzo", prepTimeMinutes: 120, ingredients: "Carne de res, Pollo, Yuca, Plátano", instructions: "Hervir las carnes y víveres a fuego lento." }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const idInput = document.getElementById('recipeId').value;
    const recipeData = {
        id: idInput ? idInput : crypto.randomUUID(),
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        prepTimeMinutes: parseInt(document.getElementById('prepTimeMinutes').value),
        ingredients: document.getElementById('ingredients').value,
        instructions: document.getElementById('instructions').value
    };

    const isEditing = Boolean(idInput);
    const method = isEditing ? 'PUT' : 'POST';

    try {
        await fetch('/api/recipes', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipeData)
        });
    } catch (err) {
        console.error(err);
    }

    let recipes = getStoredRecipes();
    if (isEditing) {
        recipes = recipes.map(r => String(r.id) === String(recipeData.id) ? recipeData : r);
    } else {
        recipes.push(recipeData);
    }

    saveStoredRecipes(recipes);
    resetForm();
}

function renderRecipes(filterText = '') {
    const container = document.getElementById('recipesList');
    if (!container) return;

    const recipes = getStoredRecipes().filter(r => r.title.toLowerCase().includes(filterText.toLowerCase()));

    if (recipes.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-muted text-center">No hay recetas guardadas.</p></div>';
        return;
    }

    container.innerHTML = recipes.map(r => `
        <div class="col-md-6 mb-3">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <span class="badge bg-info text-dark float-end">${r.category}</span>
                    <h5 class="card-title">${r.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">⏱️ ${r.prepTimeMinutes} mins</h6>
                    <p class="card-text"><strong>Ingredientes:</strong> ${r.ingredients}</p>
                    <p class="card-text"><strong>Pasos:</strong> ${r.instructions}</p>
                    <button class="btn btn-sm btn-warning" onclick="editRecipe('${r.id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteRecipe('${r.id}')">Eliminar</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterRecipes() {
    renderRecipes(document.getElementById('searchInput').value);
}

function editRecipe(id) {
    const recipes = getStoredRecipes();
    const recipe = recipes.find(r => String(r.id) === String(id));
    if (!recipe) return;

    document.getElementById('recipeId').value = recipe.id;
    document.getElementById('title').value = recipe.title;
    document.getElementById('category').value = recipe.category;
    document.getElementById('prepTimeMinutes').value = recipe.prepTimeMinutes;
    document.getElementById('ingredients').value = recipe.ingredients;
    document.getElementById('instructions').value = recipe.instructions;

    document.getElementById('formTitle').innerText = 'Editar Receta';
    document.getElementById('btnCancel').classList.remove('d-none');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteRecipe(id) {
    if (!confirm('¿Seguro que deseas eliminar esta receta?')) return;

    try {
        await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
    } catch (e) {
        console.error(e);
    }

    const recipes = getStoredRecipes().filter(r => String(r.id) !== String(id));
    saveStoredRecipes(recipes);
}

function resetForm() {
    document.getElementById('recipeForm').reset();
    document.getElementById('recipeId').value = '';
    document.getElementById('formTitle').innerText = 'Nueva Receta';
    document.getElementById('btnCancel').classList.add('d-none');
}