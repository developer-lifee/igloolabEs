Para ejecutar este proyecto en tu entorno local, sigue estos pasos:

1. Clonar el Repositorio
git clone (https://github.com/developer-lifee/igloolabEs)
cd igloolabEs
2. Configurar Variables de Entorno
Crea un archivo .env en la raíz del directorio del proyecto (en el directorio donde se encuentra vite.config.ts y package.json del frontend).  Dentro de este archivo, define las siguientes variables de entorno proporcionadas por Supabase:

VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjenlxamtmY3BzcndxbG5zd3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MDY3NjgsImV4cCI6MjA1NTM4Mjc2OH0.8LSe5EePP_AfJXlZKyoGWir45xFbUAP-r-5hK0fWoAk
VITE_SUPABASE_URL=https://gczyqjkfcpsrwqlnswph.supabase.co

3. Instalar las Dependencias del Frontend
Navega al directorio raíz del proyecto (donde está package.json del frontend) y ejecuta el siguiente comando para instalar las dependencias de Node.js:

Bash

npm install
4. Iniciar el Servidor de Desarrollo del Frontend
Una vez que las dependencias se hayan instalado, inicia el servidor de desarrollo de Vite con el siguiente comando:

Bash

npm run dev
Esto iniciará la aplicación frontend en modo desarrollo.  Normalmente, la aplicación estará disponible en tu navegador en la dirección  http://localhost:5173 (o el puerto que Vite indique en la consola).

5. Base de Datos en Supabase (Preconfigurada para la Demostración)
En esta versión preconfigurada para demostración, la base de datos products en Supabase ya debería estar creada y configurada en el proyecto de Supabase cuyas credenciales se proporcionan en el .env.  No necesitas realizar pasos adicionales para crear la tabla en Supabase para esta demostración simplificada.

Entregables Extra
Como un entregable extra, se incluye la documentación para la implementación de una API RESTful alternativa para el backend utilizando C# y ASP.NET Core.  Esta documentación detalla los pasos necesarios para construir un backend similar al funcionalmente, pero utilizando un stack tecnológico diferente (C# en lugar de Node.js/Supabase) y con la posibilidad de conectar a una base de datos PostgreSQL gestionada localmente o en otro entorno.

Puedes encontrar la documentación completa de la API en C# (Entregable Extra) en el archivo: c#API.md

