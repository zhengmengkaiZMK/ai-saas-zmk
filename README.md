# AI SaaS Starter

[中文文档](./README.zh-CN.md)

**AI SaaS Starter** is a modern, full-featured SaaS website template perfect for launching your product globally. It includes all essential pages for international SaaS businesses: landing page, blog system, and comprehensive documentation.

## Features

- 🚀 **Complete Landing Page** - Modern hero section, features, pricing, and CTAs
- 📝 **Built-in Blog System** - MDX-powered blog with full Markdown support
- 📚 **Documentation Pages** - Ready-to-use docs structure for your product
- 🌓 **Dark Mode** - Seamless light/dark theme switching
- 🌐 **Internationalization** - Full bilingual support (English & Chinese)
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS and Aceternity UI
- ⚡ **Performance** - Built on Next.js 15 with App Router for optimal speed
- 🔍 **SEO Ready** - Optimized meta tags and Open Graph support

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Aceternity UI
- **Animations**: Framer Motion
- **Content**: MDX for blog and documentation
- **Theme**: next-themes for dark mode
- **Deployment**: Vercel

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: 18.x or higher ([Download](https://nodejs.org/))
- **npm**: 9.x or higher (comes with Node.js)
- **Git**: For version control ([Download](https://git-scm.com/))

You can verify your installations by running:

```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
git --version   # Should show git version 2.x.x or higher
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-saas.git
cd ai-saas
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js and React
- Tailwind CSS and PostCSS
- TypeScript
- UI component libraries
- MDX processors

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Add your own API keys as needed
# DATABASE_URL="your_database_url"
# NEXTAUTH_URL="http://localhost:3000"
# NEXTAUTH_SECRET="your_secret_key"
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The page auto-updates as you edit files.

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run dev -- -p 3001  # Start on custom port

# Production
npm run build        # Create production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check

# Utilities
npm run clean        # Clean build files
```

## Project Structure

```
ai-saas/
├── app/                    # Next.js App Router
│   ├── (marketing)/       # Marketing pages (public)
│   │   ├── blog/          # Blog system
│   │   ├── docs/          # Documentation
│   │   └── page.tsx       # Home page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # UI primitives (buttons, etc)
│   └── navbar/           # Navigation components
├── content/              # MDX content
│   ├── blog/            # Blog posts (EN & ZH)
│   └── docs/            # Documentation (EN & ZH)
├── lib/                  # Utility functions
│   ├── blog-utils.ts    # Blog helpers
│   └── utils.ts         # General utilities
├── public/               # Static assets
└── README.md            # This file
```

## Development Guide

### Adding Blog Posts

1. Create a new MDX file in `content/blog/`:

```mdx
---
title: Your Post Title
description: A brief description
author: Your Name
date: 2024-12-04
image: /images/post-image.jpg
---

Your content here...
```

2. The post will automatically appear in `/blog`

### Adding Documentation

1. Create a new MDX file in `content/docs/`:

```mdx
---
title: Doc Title
description: Doc description
---

Your documentation content...
```

2. Access it at `/docs/your-file-name`

### Customizing Styles

- Edit `app/globals.css` for global styles
- Modify `tailwind.config.ts` for theme customization
- Update components in `components/` directory

### Internationalization

- English content: `content/blog/` and `content/docs/`
- Chinese content: `content/blog/zh/` and `content/docs/zh/`
- Add translations in respective directories

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Configure environment variables
5. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ai-saas)

### Self-Hosting

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

The app will run on `http://localhost:3000` by default.

### Docker (Optional)

```bash
# Build Docker image
docker build -t ai-saas .

# Run container
docker run -p 3000:3000 ai-saas
```

## Use Cases

This template is perfect for:

- 🤖 **AI/ML SaaS products** - Showcase your AI features and capabilities
- 💼 **B2B SaaS platforms** - Professional landing pages for enterprise tools
- 🛠️ **Developer tools** - Technical documentation and API references
- 📱 **Mobile app landing pages** - Promote your app with beautiful design
- 🌍 **Global products** - Built-in i18n for international markets

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Aceternity UI](https://ui.aceternity.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## Support

- 📖 Documentation: [/docs](/docs)
- 💬 Issues: [GitHub Issues](https://github.com/yourusername/ai-saas/issues)

## Roadmap

- [ ] User authentication system
- [ ] Payment integration (Stripe)
- [ ] Admin dashboard
- [ ] Email marketing integration
- [ ] Analytics dashboard
- [ ] A/B testing tools
- [ ] Multi-language expansion

---

Made with ❤️ for the global SaaS community
