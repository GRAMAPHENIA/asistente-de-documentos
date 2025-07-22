# DocuMind - AI Document Assistant

A modern web application that allows users to upload documents and chat with them using AI-powered RAG (Retrieval Augmented Generation).

## Features

- 🔐 **Authentication**: Secure login with Supabase Auth (Email + Google OAuth)
- 📄 **Document Upload**: Support for PDF, DOCX, TXT, and Markdown files
- 🤖 **AI Chat**: Chat with your documents using OpenAI GPT-4o
- 📊 **Smart Summaries**: Automatic document summarization
- 🎨 **Modern UI**: Clean, responsive design with dark/light mode
- 🔍 **Vector Search**: Semantic search using embeddings
- 📱 **Mobile Friendly**: Fully responsive design

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: TailwindCSS + shadcn/ui
- **Database**: Supabase (PostgreSQL + Vector)
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT-4o + Embeddings
- **Animations**: Framer Motion
- **File Upload**: React Dropzone

## Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd documind-ai-assistant
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Fill in your Supabase and OpenAI credentials.

4. Set up the database:
   - Create a new Supabase project
   - Enable the Vector extension
   - Run the SQL scripts in the \`scripts/\` folder

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── chat/              # Chat pages
│   ├── dashboard/         # Dashboard page
│   ├── login/             # Authentication
│   └── upload/            # File upload
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utilities and configurations
├── scripts/              # Database scripts
└── ...
\`\`\`

## Key Features Explained

### Document Processing
- Text extraction from various file formats
- Automatic summarization using AI
- Vector embeddings for semantic search
- Secure storage in Supabase

### RAG Implementation
- Document content is embedded using OpenAI's text-embedding-3-small
- User queries are matched against document embeddings
- Relevant context is provided to GPT-4o for accurate responses

### Security
- Row Level Security (RLS) in Supabase
- User isolation for documents and chats
- Secure file upload and processing

## Deployment

The application can be deployed to Vercel with automatic Supabase integration:

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
