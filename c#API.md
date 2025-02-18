```markdown

Explicación de la Implementación de la API en C# (Entregable Extra)
Introducción
Este documento describe los pasos para implementar la API de gestión de productos utilizando C# y ASP.NET Core.  Se presenta como una alternativa o extensión a la implementación principal del backend (asumiendo que tenías otra implementación, como en Node.js). Esta explicación detalla cómo configurar un backend RESTful en C# que cumpla con los mismos endpoints y funcionalidades requeridas para la gestión de productos: listar, crear y eliminar productos.

Prerrequisitos
Antes de comenzar con la implementación de la API en C#, asegúrate de tener instalado y configurado lo siguiente en tu entorno de desarrollo:

.NET SDK: Necesitarás tener instalado el .NET SDK (Software Development Kit) en su versión más reciente o una versión compatible con ASP.NET Core. Puedes descargarlo desde https://dotnet.microsoft.com/download.
Editor de Código: Se recomienda utilizar un editor de código como Visual Studio (versión Community es gratuita) o Visual Studio Code con la extensión de C#.
Base de Datos PostgreSQL (o MySQL): Para esta explicación, asumiremos el uso de PostgreSQL, siguiendo la línea del proyecto principal. Asegúrate de tener PostgreSQL instalado y en ejecución, y tener las credenciales de acceso a la base de datos (host, usuario, contraseña, nombre de la base de datos).
pgAdmin (Opcional): pgAdmin es una herramienta de administración gráfica para PostgreSQL que puede ser útil para gestionar la base de datos.
Pasos para la Implementación de la API en C#
A continuación, se detallan los pasos para crear la API RESTful en C# utilizando ASP.NET Core.

1. Crear un Nuevo Proyecto ASP.NET Core Web API
Abre tu terminal o línea de comandos y utiliza el CLI de .NET para crear un nuevo proyecto de Web API. Navega a la carpeta donde deseas crear el proyecto y ejecuta el siguiente comando:

Bash

dotnet new webapi -o ProductosApiCsharp
cd ProductosApiCsharp
Este comando creará una nueva carpeta llamada ProductosApiCsharp con la estructura básica de un proyecto Web API en ASP.NET Core.

2. Instalar Paquetes NuGet Necesarios
Para interactuar con la base de datos PostgreSQL y utilizar un ORM (Object-Relational Mapper) como Entity Framework Core, necesitas instalar los paquetes NuGet correspondientes.  Puedes usar el CLI de .NET en la terminal dentro de la carpeta del proyecto:

Bash

dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.EntityFrameworkCore.SqlServer # Si prefieres SQL Server en lugar de PostgreSQL
dotnet add package Microsoft.EntityFrameworkCore.InMemory # Para pruebas unitarias (opcional)
Para este ejemplo, nos centraremos en PostgreSQL, por lo que los paquetes Npgsql.EntityFrameworkCore.PostgreSQL y Microsoft.EntityFrameworkCore.Design son esenciales.

3. Definir el Modelo de Producto (Product Model)
Crea una carpeta llamada Models en tu proyecto (si no existe) y dentro de ella, crea un archivo llamado Product.cs. Define la clase Product que mapeará a la tabla products en la base de datos.   

C#

// Models/Product.cs
using System.ComponentModel.DataAnnotations.Schema;

namespace ProductosApiCsharp.Models
{
    [Table("products")] // Especifica el nombre de la tabla en la base de datos
    public class Product
    {
        [Column("id")] // Especifica el nombre de la columna, aunque por convención podría ser innecesario
        public int Id { get; set; }

        [Column("name")]
        public string? Name { get; set; } // Usando 'string?' para permitir valores null

        [Column("description")]
        public string? Description { get; set; }

        [Column("price")]
        public decimal Price { get; set; }
    }
}
4. Configurar el Contexto de la Base de Datos (Database Context)
Crea una carpeta llamada Data (o Contexts) y dentro, un archivo llamado ProductContext.cs. Este archivo definirá el contexto de Entity Framework Core, que actuará como un puente entre tu código C# y la base de datos.

C#

// Data/ProductContext.cs
using Microsoft.EntityFrameworkCore;
using ProductosApiCsharp.Models;

namespace ProductosApiCsharp.Data
{
    public class ProductContext : DbContext
    {
        public ProductContext(DbContextOptions<ProductContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; } // DbSet para la entidad Product
    }
}
5. Registrar el Contexto de la Base de Datos en Program.cs
Abre el archivo Program.cs (o Startup.cs en versiones anteriores de .NET) y configura la inyección de dependencias para el ProductContext y la cadena de conexión a la base de datos.  Modifica la sección builder.Services dentro de Program.cs:

C#

// Program.cs (fragmento)
using ProductosApiCsharp.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ... (otras configuraciones)

builder.Services.AddDbContext<ProductContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")) // Usar PostgreSQL
    // options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")) // Si prefieres SQL Server
);

// ... (resto de configuraciones)
Asegúrate de tener una cadena de conexión llamada "DefaultConnection" configurada en tu archivo appsettings.json o appsettings.Development.json.  Por ejemplo, en appsettings.Development.json:

JSON

{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=nombre_base_de_datos;Username=tu_usuario_postgres;Password=tu_contraseña_postgres"
  },
  "AllowedHosts": "*"
}
Reemplaza "nombre_base_de_datos", "tu_usuario_postgres" y "tu_contraseña_postgres" con tus credenciales reales de PostgreSQL.

6. Crear el Controlador de Productos (Product Controller)
Crea una carpeta llamada Controllers y dentro, un archivo llamado ProductsController.cs.  Este controlador manejará las peticiones HTTP para los endpoints de productos.

C#

// Controllers/ProductsController.cs
using Microsoft.AspNetCore.Mvc;
using ProductosApiCsharp.Data;
using ProductosApiCsharp.Models;
using Microsoft.EntityFrameworkCore;

namespace ProductosApiCsharp.Controllers
{
    [Route("api/[controller]")] // Define la ruta base del controlador (api/products)
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ProductContext _context;

        public ProductsController(ProductContext context)
        {
            _context = context;
        }

        // GET: api/products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }

        // POST: api/products
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            if (!ModelState.IsValid) // Valida el modelo según Data Annotations (si las añadieras)
            {
                return BadRequest(ModelState);
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product); // Retorna 201 con el producto creado
        }

        // DELETE: api/products/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(); // 404 si no encuentra el producto
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent(); // 204 No Content (eliminación exitosa)
        }

        // GET: api/products/{id} (Opcional, si quieres un endpoint para obtener un producto por ID)
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }
    }
}
7. Aplicar Migraciones (Opcional, pero recomendado para desarrollo)
Entity Framework Core utiliza migraciones para gestionar los cambios en el esquema de la base de datos.  Para crear la tabla products en tu base de datos utilizando migraciones, ejecuta los siguientes comandos en la terminal (asegúrate de estar en la carpeta del proyecto):

Bash

dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet ef migrations add InitialCreate: Crea una migración inicial basada en tu modelo Product y el ProductContext.   
dotnet ef database update: Aplica las migraciones pendientes a la base de datos, creando la tabla products y cualquier otra estructura necesaria.
Nota sobre Migraciones:  Para entornos de producción, es importante gestionar las migraciones de manera controlada y no ejecutarlas automáticamente al inicio de la aplicación. En este ejemplo simple, para fines demostrativos y de desarrollo, se utilizan para facilitar la creación inicial de la base de datos.

8. Ejecutar y Probar la API
Ejecuta la API de C# utilizando el siguiente comando en la terminal:

Bash

dotnet run
La API se iniciará y estará disponible por defecto en http://localhost:5000 o http://localhost:5001 (o el puerto que configure Kestrel).

Puedes utilizar herramientas como Postman, Insomnia o curl para probar los endpoints de la API C#:

GET /api/products: Obtiene la lista de productos.
POST /api/products: Crea un nuevo producto (envía un objeto JSON en el body con nombre, descripción y precio).
DELETE /api/products/{id}: Elimina un producto por su ID.