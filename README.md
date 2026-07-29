# RecetasApp - Gestor de Recetas de Cocina

RecetasApp es una aplicación web desarrollada con ASP.NET Core Web API en el backend y una interfaz ligera estructurada en HTML, CSS (Bootstrap 5) y JavaScript en el frontend. El sistema permite gestionar un catálogo de recetas de cocina realizando operaciones de lectura, creación, actualización y eliminación.

## Características

- Creacion de nuevas recetas con titulo, categoria, tiempo de preparacion, ingredientes e instrucciones.
- Listado y busqueda en tiempo real por titulo.
- Edicion y actualizacion de recetas existentes.
- Eliminacion de registros.
- Persistencia de datos en el cliente mediante almacenamiento local (LocalStorage) y sincronizacion con la API.

## Tecnologias Utilizadas

- Backend: .NET / C# (ASP.NET Core Web API)
- Frontend: HTML5, JavaScript (ES6+), Bootstrap 5
- Control de versiones: Git y GitHub

## Estructura del Proyecto

- `Controllers/`: Contiene `RecipesController.cs` con los endpoints RESTful.
- `Models/`: Contiene la clase `Recipe.cs` que define el modelo de datos.
- `Services/`: Contiene `RecipeService.cs` para el manejo de los datos en memoria.
- `wwwroot/`: Archivos estaticos que sirven la interfaz web (`index.html` y `app.js`).

## Instrucciones de Ejecucion

1. Clonar el repositorio:
   git clone https://github.com/FrandySena/RecetasApp.git

2. Navegar al directorio del proyecto:
   cd RecetasApp

3. Compilar el proyecto:
   dotnet build

4. Ejecutar la aplicacion:
   dotnet run

5. Abrir el navegador e ingresar a la URL local indicada en la terminal (por ejemplo, `http://localhost:5000` o `https://localhost:7001`).

## Estrategia de Ramificación

El desarrollo del proyecto siguió un flujo de trabajo estructurado mediante ramas:

- `main`: Codigo en produccion.
- `qa`: Entorno de pruebas.
- `dev`: Entorno de desarrollo principal.
- Ramas `feature/*` y `hotfix/*`: Utilizadas para la implementacion de funcionalidades especificas y correcciones de errores, integradas mediante Pull Requests hacia las ramas correspondientes.
