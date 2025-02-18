# IgloolabEs

Este proyecto es un **monorepo** que contiene dos carpetas principales:

- **frontend**: Aplicación web desarrollada con Vite.
- **backend**: Implementación del backend que utiliza Supabase para la gestión de la base de datos. Además, se incluye un entregable extra con la documentación para una API RESTful alternativa desarrollada en C# y ASP.NET Core.

---

## Nota para la Prueba Técnica

La única dependencia requerida es **Node.js** en la versión **v22.13.1**.  
Verifica tu versión con:

    node -v

Debería mostrar: `v22.13.1`

---

## Instalación y Ejecución

### 1. Clonar el Repositorio

Abre tu terminal y ejecuta:

    git clone https://github.com/developer-lifee/igloolabEs
    cd igloolabEs

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (o dentro de la carpeta `frontend`, donde se encuentran `vite.config.ts` y `package.json`) con el siguiente contenido:

    VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjenlxamtmY3BzcndxbG5zd3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MDY3NjgsImV4cCI6MjA1NTM4Mjc2OH0.8LSe5EePP_AfJXlZKyoGWir45xFbUAP-r-5hK0fWoAk
    VITE_SUPABASE_URL=https://gczyqjkfcpsrwqlnswph.supabase.co

### 3. Ejecutar el Frontend

Navega a la carpeta del **frontend**:

    cd frontend

Instala las dependencias:

    npm install

Inicia el servidor de desarrollo:

    npm run dev

La aplicación se ejecutará en modo desarrollo. Normalmente podrás verla en [http://localhost:5173](http://localhost:5173) o en el puerto que indique la consola.

### 4. Ejecutar el Backend

El **backend** utiliza Supabase para la gestión de la base de datos, y la tabla `products` ya se encuentra preconfigurada en el proyecto de Supabase asociado, utilizando las credenciales definidas en el archivo `.env`.

**Nota:** No es necesario realizar pasos adicionales para la configuración de la base de datos en esta demostración.

#### API RESTful en C# (Entregable Extra)

Como un extra, se incluye la documentación para la implementación de una API RESTful alternativa en C# y ASP.NET Core.

Para más detalles sobre cómo configurar y ejecutar esta API, consulta el archivo:  
[c#API.md](https://github.com/developer-lifee/igloolabEs/blob/main/c%23API.md)

**Consejo:** Si decides implementar la API en C#, asegúrate de tener instalado el .NET SDK y sigue las instrucciones en la documentación.

---

## Consideraciones Finales

- **Variables de Entorno:** Asegúrate de que el archivo `.env` esté correctamente configurado para que tanto el frontend como el backend se conecten a Supabase.
- **Ejecución Local:** El proyecto está preparado para ejecutarse localmente para fines de demostración.
- **Monorepo:** Este repositorio agrupa ambos entornos (frontend y backend) para facilitar su manejo y despliegue.
