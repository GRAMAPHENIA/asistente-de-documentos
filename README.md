# DocuMind - Asistente de Documentos con IA

Una aplicación web moderna que permite a los usuarios cargar documentos y chatear con ellos usando RAG (Generación Aumentada por Recuperación) impulsada por IA.

## Características

- 🔐 **Autenticación**: Inicio de sesión seguro con Supabase Auth (Email + Google OAuth)
- 📄 **Carga de Documentos**: Soporte para archivos PDF, DOCX, TXT y Markdown
- 🤖 **Chat con IA**: Chatea con tus documentos usando OpenAI GPT-4o
- 📊 **Resúmenes Inteligentes**: Resumen automático de documentos
- 🎨 **Interfaz de Usuario Moderna**: Diseño limpio y responsivo con modo claro/oscuro
- 🔍 **Búsqueda Vectorial**: Búsqueda semántica usando embeddings
- 📱 **Adaptable a Móviles**: Diseño completamente responsivo

## Tecnologías Utilizadas

- **Framework**: Next.js 15 con App Router
- **Estilos**: TailwindCSS + shadcn/ui
- **Base de Datos**: Supabase (PostgreSQL + Vector)
- **Autenticación**: Supabase Auth
- **IA**: OpenAI GPT-4o + Embeddings
- **Animaciones**: Framer Motion
- **Carga de Archivos**: React Dropzone

## Cómo Empezar

### Prerrequisitos

- Node.js 18+
- Cuenta de Supabase
- Clave de API de OpenAI

### Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd documind-ai-assistant
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env.local
```

Completa con tus credenciales de Supabase y OpenAI.

4. Configura la base de datos:
   - Crea un nuevo proyecto en Supabase
   - Activa la extensión Vector
   - Ejecuta los scripts SQL en la carpeta `scripts/`

5. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto

```
├── app/                    # Directorio de la app Next.js
│   ├── api/               # Rutas de la API
│   ├── chat/              # Páginas de chat
│   ├── dashboard/         # Página del panel de control
│   ├── login/             # Autenticación
│   └── upload/            # Carga de archivos
├── components/            # Componentes de React
│   ├── ui/               # Componentes de shadcn/ui
│   └── ...               # Componentes personalizados
├── lib/                  # Utilidades y configuraciones
├── scripts/              # Scripts de base de datos
└── ...
```

## Explicación de Características Clave

### Procesamiento de Documentos
- Extracción de texto de varios formatos de archivo
- Resumen automático usando IA
- Embeddings vectoriales para búsqueda semántica
- Almacenamiento seguro en Supabase

### Implementación de RAG
- El contenido del documento se convierte en embeddings usando `text-embedding-3-small` de OpenAI
- Las consultas del usuario se comparan con los embeddings del documento
- Se proporciona contexto relevante a GPT-4o para obtener respuestas precisas

### Seguridad
- Row Level Security (RLS) en Supabase
- Aislamiento de documentos y chats por usuario
- Carga y procesamiento seguro de archivos

## Despliegue

La aplicación se puede desplegar en Vercel con integración automática de Supabase:

1. Sube tu código a GitHub
2. Conecta el repositorio a Vercel
3. Añade las variables de entorno
4. Despliega

## Cómo Contribuir

1. Haz un fork del repositorio
2. Crea una rama para tu nueva característica
3. Realiza tus cambios
4. Envía una pull request

## Licencia

Licencia MIT - consulta el archivo `LICENSE` para más detalles.
