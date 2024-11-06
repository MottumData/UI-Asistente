
## Ejecución en local :computer:

### Prerrequisitos

Asegúrate de tener instalados previamente los siguientes componentes:

- [Node.js](https://nodejs.org/en/download/prebuilt-installer/) v.22
- [Docker](https://www.docker.com/products/docker-desktop/)

A continuación, se muestra el despliegue tanto en local como en un contenedor Docker

### Despliegue en local :house:

1. **Clonar el repositorio**
   
   Primero, clona el repositorio y situate en el directorio clonado:
   ```bash
   git clone https://github.com/MottumData/UI-Asistente.git
   ```

2. **Instalación de dependencias**
    ```bash
    npm install
    ```
3. **Ejecutar UI en local (develop)**
    ```bash
    npm run dev
    ```
4. **Ejecutar UI en local (production)**
    ```bash
    npm run start
    ```

### Despliegue con Docker :whale:

1. **Clonar el repositorio**
   
   Primero, clona el repositorio y situate en el directorio clonado:
   ```bash
   git clone https://github.com/MottumData/UI-Asistente.git
   ```
2. **Crear imagen de Docker**
    ```bash
        docker build -t ui-codexca .
    ```
3. **Ejecutar contenedor Docker**
    
    ```bash
    docker run -p 3000:3000 ui-codexca
    ```



... *Work in Progress*:gear:...
<!-- Incluir: test, pull del registry, despliegue con api -->