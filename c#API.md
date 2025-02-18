# Explicación de la Implementación de la API en C# (Entregable Extra)

**Table of Contents**
- [Introducción](#introducción)
- [Prerrequisitos](#prerrequisitos)
- [Pasos para la Implementación de la API en C#](#pasos-para-la-implementación-de-la-api-en-c)
  - [Paso 1: Crear un Nuevo Proyecto ASP.NET Core Web API](#paso-1-crear-un-nuevo-proyecto-aspnet-core-web-api)
  - [Paso 2: Instalar Paquetes NuGet Necesarios](#paso-2-instalar-paquetes-nuget-necesarios)
  - [Paso 3: Definir el Modelo de Producto (Product Model)](#paso-3-definir-el-modelo-de-producto-product-model)
  - [Paso 4: Configurar el Contexto de la Base de Datos (Database Context)](#paso-4-configurar-el-contexto-de-la-base-de-datos-database-context)
  - [Paso 5: Registrar el Contexto en Program.cs](#paso-5-registrar-el-contexto-en-programcs)
  - [Paso 6: Crear el Controlador de Productos (Product Controller)](#paso-6-crear-el-controlador-de-productos-product-controller)
  - [Paso 7: Aplicar Migraciones](#paso-7-aplicar-migraciones)
  - [Paso 8: Ejecutar y Probar la API](#paso-8-ejecutar-y-probar-la-api)
- [Notas y Consejos](#notas-y-consejos)
- [Ejemplo de Code Block (Indented Style)](#ejemplo-de-code-block-indented-style)

---

## Introducción

Este documento describe los pasos para implementar una API de gestión de productos utilizando C# y ASP.NET Core. Se presenta como una alternativa o extensión a la implementación principal del backend (por ejemplo, en Node.js). La API se diseña para crear, listar y eliminar productos a través de un backend RESTful.

---

## Prerrequisitos

Antes de comenzar, asegúrate de contar con los siguientes elementos en tu entorno de desarrollo:

- **.NET SDK:** Instala la versión más reciente o compatible con ASP.NET Core.  
  [Descargar .NET SDK](https://dotnet.microsoft.com/download)
- **Editor de Código:** Se recomienda utilizar Visual Studio o Visual Studio Code con la extensión de C#.
- **Base de Datos PostgreSQL (o MySQL):** Este ejemplo utiliza PostgreSQL, pero puedes adaptar la configuración a MySQL si lo prefieres.
- **pgAdmin (Opcional):** Herramienta gráfica para la administración de PostgreSQL.

---

## Pasos para la Implementación de la API en C#

### Paso 1: Crear un Nuevo Proyecto ASP.NET Core Web API

Abre la terminal o línea de comandos, navega a la carpeta deseada y ejecuta:

    dotnet new webapi -o ProductosApiCsharp
    cd ProductosApiCsharp

Este comando crea una nueva carpeta llamada `ProductosApiCsharp` con la estructura básica de un proyecto Web API en ASP.NET Core.

### Paso 2: Instalar Paquetes NuGet Necesarios

Para interactuar con la base de datos PostgreSQL y utilizar Entity Framework Core, instala los siguientes paquetes:

    dotnet add package Microsoft.EntityFrameworkCore.Design
    dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
    dotnet add package Microsoft.EntityFrameworkCore.Tools
    dotnet add package Microsoft.EntityFrameworkCore.SqlServer  # Si prefieres SQL Server
    dotnet add package Microsoft.EntityFrameworkCore.InMemory   # Para pruebas unitarias (opcional)

### Paso 3: Definir el Modelo de Producto (Product Model)

Crea una carpeta llamada `Models` y, dentro de ella, un archivo `Product.cs` con el siguiente contenido:

    // Models/Product.cs
    using System.ComponentModel.DataAnnotations.Schema;
    
    namespace ProductosApiCsharp.Models
    {
        [Table("products")]
        public class Product
        {
            [Column("id")]
            public int Id { get; set; }
    
            [Column("name")]
            public string? Name { get; set; }
    
            [Column("description")]
            public string? Description { get; set; }
    
            [Column("price")]
            public decimal Price { get; set; }
        }
    }

### Paso 4: Configurar el Contexto de la Base de Datos (Database Context)

Crea una carpeta llamada `Data` y un archivo `ProductContext.cs` con el siguiente contenido:

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
    
            public DbSet<Product> Products { get; set; }
        }
    }

### Paso 5: Registrar el Contexto en Program.cs

Abre el archivo `Program.cs` y configura la inyección de dependencias para `ProductContext`:

    // Program.cs (fragmento)
    using ProductosApiCsharp.Data;
    using Microsoft.EntityFrameworkCore;
    
    var builder = WebApplication.CreateBuilder(args);
    
    builder.Services.AddDbContext<ProductContext>(options =>
        options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
    );
    
    var app = builder.Build();
    
    app.UseHttpsRedirection();
    app.UseAuthorization();
    app.MapControllers();
    app.Run();

Asegúrate de tener la siguiente cadena de conexión en el archivo `appsettings.Development.json`:

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

### Paso 6: Crear el Controlador de Productos (Product Controller)

Crea una carpeta llamada `Controllers` y, dentro de ella, un archivo `ProductsController.cs` con el siguiente contenido:

    // Controllers/ProductsController.cs
    using Microsoft.AspNetCore.Mvc;
    using ProductosApiCsharp.Data;
    using ProductosApiCsharp.Models;
    using Microsoft.EntityFrameworkCore;
    
    namespace ProductosApiCsharp.Controllers
    {
        [Route("api/[controller]")]
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
    
            // GET: api/products/{id}
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
    
            // POST: api/products
            [HttpPost]
            public async Task<ActionResult<Product>> PostProduct(Product product)
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
    
                _context.Products.Add(product);
                await _context.SaveChangesAsync();
    
                return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
            }
    
            // DELETE: api/products/{id}
            [HttpDelete("{id}")]
            public async Task<IActionResult> DeleteProduct(int id)
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return NotFound();
                }
    
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
    
                return NoContent();
            }
        }
    }

### Paso 7: Aplicar Migraciones

Para crear y aplicar migraciones que configuren la base de datos, ejecuta los siguientes comandos en la terminal:

    dotnet ef migrations add InitialCreate
    dotnet ef database update

### Paso 8: Ejecutar y Probar la API

Ejecuta la API utilizando el siguiente comando:

    dotnet run

La API se iniciará y estará disponible en `http://localhost:5000` o `http://localhost:5001` según la configuración de Kestrel. Para probar los endpoints, se recomienda utilizar herramientas como Postman, Insomnia o curl:

- **GET** `/api/products`: Obtiene la lista de productos.
- **POST** `/api/products`: Crea un nuevo producto (envía un objeto JSON en el body).
- **DELETE** `/api/products/{id}`: Elimina un producto por su ID.

---

## Notas y Consejos

- **Gestión de Migraciones:** En entornos de producción, es fundamental gestionar las migraciones de forma controlada y evitar su ejecución automática al iniciar la aplicación.
- **Pruebas Unitarias:** Se recomienda utilizar el paquete `Microsoft.EntityFrameworkCore.InMemory` para simular la base de datos durante las pruebas unitarias.
- **Seguridad:** Mantén segura la cadena de conexión utilizando variables de entorno o mecanismos de gestión de secretos.
- **Mantenimiento:** Documenta y versiona adecuadamente los cambios tanto en la base de datos como en la API para facilitar el mantenimiento a largo plazo.

---
