# KING – Branding & Creative Portfolio

A modern, responsive portfolio website for KING, a premium branding and design studio. Built with a focus on aesthetics, performance, and user experience to showcase creative work and attract potential clients.

## 🌟 Features

- **Responsive Design**: Looks great on all devices
- **Modern UI/UX**: Built with shadcn/ui and Tailwind CSS
- **Performance Optimized**: Fast loading with Vite and React
- **Interactive Elements**: Custom cursor, smooth animations
- **Case Study Showcase**: Detailed project presentations
- **Contact & Onboarding**: Easy client engagement

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React Query
- **Routing**: React Router
- **Form Handling**: React Hook Form
- **Icons**: Lucide Icons
- **Deployment**: Vercel/Netlify ready

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ (recommend using [nvm](https://github.com/nvm-sh/nvm))
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/king-portfolio.git
   cd king-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
src/
├── assets/           # Images, icons, and other static files
├── components/       # Reusable UI components
│   ├── forms/       # Form components
│   ├── layout/      # Layout components
│   └── sections/    # Page sections
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and API clients
├── pages/           # Page components
└── styles/          # Global styles
```

## 🔧 Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# Backend API URL (if applicable)
VITE_API_URL=your_api_url_here

# Supabase (if using)
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📦 Deployment

This project can be deployed to any static hosting service:

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [GitHub Pages](https://pages.github.com/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
