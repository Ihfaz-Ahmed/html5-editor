[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-13.0-black?logo=next.js)](https://nextjs.org/)
[![TinyMCE](https://img.shields.io/badge/TinyMCE-6.0-blue?logo=tinymce)](https://www.tiny.cloud/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

# Modern HTML5 Editor

A powerful HTML5 editor with WYSIWYG (What You See Is What You Get) capabilities, built with Next.js, TinyMCE, and Tailwind CSS. This editor provides an intuitive interface for HTML editing with real-time preview and advanced cleaning options, perfect for modern web development workflows.

## ✨ Features

- 🎨 **Rich Text Editing** - Full-featured WYSIWYG editor powered by TinyMCE
- 🌓 **Dark/Light Mode** - Seamless theme switching with system preference support
- 🧹 **HTML Cleaning Tools** - Comprehensive set of HTML cleaning options:
  - Clear inline styles
  - Remove classes and IDs
  - Fix character encoding
  - Remove comments
  - Clean span tags
  - Handle whitespace and nbsp
  - Remove empty tags
  - Clear specific HTML elements (images, links, tables)
  - Convert tables to divs
  - Organize HTML tree view
- 📝 **Live Preview** - Real-time HTML preview with syntax highlighting
- 📋 **Copy to Clipboard** - Easy copying of both original and cleaned HTML
- 🎯 **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

[![Next.js](https://img.shields.io/badge/Next.js-13.0-black?logo=next.js&style=for-the-badge)](https://nextjs.org/)
[![TinyMCE](https://img.shields.io/badge/TinyMCE-6.0-blue?logo=tinymce&style=for-the-badge)](https://www.tiny.cloud/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css&style=for-the-badge)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue?logo=typescript&style=for-the-badge)](https://www.typescriptlang.org/)

Additional dependencies:
- [![DOMPurify](https://img.shields.io/badge/DOMPurify-3.0-success)](https://github.com/cure53/DOMPurify) - HTML sanitization
- [![Prism.js](https://img.shields.io/badge/Prism.js-1.29-orange)](https://prismjs.com/) - Syntax highlighting
- [![next-themes](https://img.shields.io/badge/next--themes-0.2-purple)](https://github.com/pacocoursey/next-themes) - Theme management

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wysiwyg.git
cd wysiwyg
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your TinyMCE API key:
```env
NEXT_PUBLIC_TINYMCE_API_KEY=your_api_key_here
```

You can get a free API key from [TinyMCE's website](https://www.tiny.cloud/auth/signup/).

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

1. Use the rich text editor to create or paste your HTML content
2. Configure cleaning options using the gear icon
3. Click "Clean HTML" to apply the selected cleaning options
4. View the cleaned HTML in the preview panel
5. Copy the cleaned HTML using the clipboard button

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- TinyMCE for their excellent editor
- The Next.js team for the amazing framework
- The Tailwind CSS team for the utility-first CSS framework
