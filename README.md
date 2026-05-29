# Lector CBZ

Lector web de archivos `.cbz` ejecutado completamente en el navegador.

Permite cargar obras individuales o carpetas completas, leer metadata, buscar por nombre, autor o tags, leer en modo paginado o cascada y exportar obras a PDF.

---

## Características

- Lee archivos `.cbz`.
- Permite cargar una carpeta completa de obras.
- Permite cargar una obra individual.
- Muestra portadas usando la primera imagen del CBZ.
- Lee metadata desde `ComicInfo.xml` cuando está disponible.
- Muestra título, autor y tags.
- Buscador por:
  - nombre de la obra;
  - autor;
  - tags.
- Permite filtrar obras seleccionando tags.
- Incluye modo de lectura paginado.
- Incluye modo de lectura en cascada.
- Permite exportar una obra a PDF.
- Funciona directamente en el navegador.
- No requiere backend.
- No requiere base de datos.
- No sube archivos a servidores.

---

## Uso en línea

Puedes abrir la página del proyecto desde GitHub Pages:

```txt
[https://saaccs.github.io/Cbz-Reader./]```

Desde ahí solo debes seleccionar:

- `Cargar carpeta`, para cargar varias obras.
- `Cargar obra`, para cargar un solo archivo `.cbz`.

Los archivos seleccionados se procesan localmente en el navegador.

---

## Uso local

También puedes descargar el proyecto y abrirlo localmente.

La estructura del proyecto es:

```txt
cbz-reader/
├── index.html
├── style.css
├── app.js
└── README.md
```

---

## Opción 1: Abrir con Visual Studio Code

### Requisitos

- Visual Studio Code.
- Extensión Live Server.
- Navegador moderno.

### Pasos

1. Descargar o clonar el repositorio.

2. Abrir la carpeta del proyecto en Visual Studio Code.

3. Abrir el archivo:

```txt
index.html
```

4. Click derecho y seleccionar:

```txt
Open with Live Server
```

5. Se abrirá la página en el navegador.

---

## Opción 2: Abrir usando Python

### Requisitos

- Python instalado.
- Navegador moderno.

Puedes descargar Python desde:

```txt
https://www.python.org/downloads/
```

Durante la instalación se recomienda marcar la opción:

```txt
Add Python to PATH
```

### Verificar instalación

Abre una terminal, CMD o PowerShell y escribe:

```bash
python --version
```

Debería mostrar algo como:

```txt
Python 3.x.x
```

### Ejecutar servidor local

1. Abre una terminal dentro de la carpeta del proyecto.

Ejemplo:

```bash
cd C:\Users\TuUsuario\Downloads\cbz-reader
```

2. Ejecuta:

```bash
python -m http.server
```

3. Abre en el navegador la dirección mostrada por Python.

Normalmente será algo como:

```txt
http://localhost:8000
```

o:

```txt
http://127.0.0.1:8000
```

El puerto puede variar si el sistema usa otro disponible.

---

## Opción 3: Abrir directamente el archivo

En algunos navegadores puede funcionar abrir directamente:

```txt
index.html
```

Sin embargo, se recomienda usar GitHub Pages, Live Server o Python para evitar restricciones del navegador al cargar archivos locales.

---

## Navegadores probados

- Brave.

También debería funcionar en navegadores modernos como:

- Chrome.
- Edge.
- Firefox.

---

## Cómo usar

1. Abrir la página.

2. Presionar:

```txt
Cargar carpeta
```

para seleccionar una carpeta con archivos `.cbz`.

También puedes presionar:

```txt
Cargar obra
```

para seleccionar un solo archivo `.cbz`.

3. Esperar a que el navegador procese las obras.

4. Usar el buscador para filtrar por:

- nombre;
- autor;
- tags.

5. Seleccionar una obra.

6. Presionar:

```txt
Leer
```

7. Elegir entre:

- modo paginado;
- modo cascada.

8. Opcionalmente usar:

```txt
Descargar PDF
```

para exportar la obra actual.

---

## Importante

La primera carga puede tardar dependiendo de:

- cantidad de archivos;
- tamaño de los CBZ;
- cantidad de páginas;
- resolución de imágenes;
- potencia del equipo;
- navegador usado.

Esto es normal, ya que el navegador procesa:

- portadas;
- metadata;
- tags;
- imágenes;
- estructura interna de los CBZ.

Por favor espera un momento durante el procesamiento inicial.

---

## Privacidad

Este proyecto está diseñado para funcionar localmente o desde una página estática.

Los archivos seleccionados:

- no se suben al servidor;
- no se almacenan remotamente;
- no requieren cuentas;
- no requieren inicio de sesión;
- se procesan dentro del navegador del usuario.

El proyecto no incluye backend ni base de datos remota.

---

## Recomendaciones de seguridad

Si decides descargar y ejecutar el proyecto localmente, se recomienda:

- usar navegadores actualizados;
- descargar el proyecto únicamente desde fuentes confiables;
- mantener el sistema limpio;
- evitar extensiones sospechosas;
- evitar ejecutar el proyecto en equipos comprometidos;
- evitar software pirata, modificado o de origen dudoso.

Aunque el proyecto no accede a archivos sin permiso del usuario, siempre es recomendable trabajar en un entorno seguro.

---

## Notas

- Proyecto creado con fines personales y educativos.
- El usuario es responsable de los archivos que carga y administra.
- Algunas funciones pueden consumir memoria si se cargan cientos de obras simultáneamente.
- La exportación a PDF puede tardar dependiendo del tamaño de la obra.
- El lector trabaja con archivos `.cbz`, que internamente son archivos comprimidos tipo ZIP.

---

## Tecnologías usadas

- HTML.
- CSS.
- JavaScript.
- JSZip.
- jsPDF.

---

## Licencia

Uso personal bajo responsabilidad del usuario.
