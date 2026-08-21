# 🚀 Professional Developer Portfolio

A modern, responsive portfolio website built with **React + Vite**. Features a clean, minimal design with smooth animations and professional layout perfect for applying to top tech companies.

## ✨ Features

- ✅ **10 Complete Sections**: Home, About, Education, Skills, Projects, Experience, Certifications, Achievements, Resume, Contact
- ✅ **Fully Responsive**: Mobile, tablet, and desktop optimized
- ✅ **Professional Design**: Clean, minimal, developer-focused dark theme
- ✅ **Smooth Animations**: Subtle transitions and scroll effects
- ✅ **Easy Customization**: Single data file for all content
- ✅ **Production Ready**: Optimized build with Vite
- ✅ **Modern Stack**: React 18, Vite 5, Modern CSS

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The site will be available at `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```
Production files will be in the `/dist` folder

## 🎨 Customization

### Edit Your Content (No Coding Required!)

All content is in **one file**: `src/data/portfolioData.js`

Edit this file to customize:
- Personal information (name, email, links)
- About section
- Skills list
- Projects

### Change Colors & Theme

Edit `src/styles/global.css` and modify CSS variables:

```css
:root {
  --accent-primary: #3b82f6;    /* Your brand color */
  --bg-primary: #0a0a0a;        /* Background */
  --text-primary: #f5f5f5;      /* Text color */
}
```

### Add Your Resume

Place your resume PDF in `/public/resume.pdf`

## 📂 Project Structure

```
portfolio/
├── public/              # Static assets
│   └── resume.pdf      # Your resume (add this)
├── src/
│   ├── components/     # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── SectionWrapper.jsx
│   ├── sections/       # Page sections
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Skills.jsx
│   │   ├── Projects.jsx
│   │   ├── Resume.jsx
│   │   └── Contact.jsx
│   ├── styles/         # CSS files
│   ├── data/           # Content data
│   │   └── portfolioData.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## 🌐 Deployment

### Option 1: Vercel (Recommended)
1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Auto-deploys instantly!

### Option 2: Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Deploy!

### Option 3: GitHub Pages
1. Run: `npm run build`
2. Deploy `/dist` folder to `gh-pages` branch

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite 5** - Build tool & dev server
- **Modern CSS** - Grid, Flexbox, Custom Properties
- **Google Fonts** - Crimson Pro, Manrope, JetBrains Mono

## 💡 Customization Tips

1. **Start with content**: Edit `portfolioData.js` first
2. **Test responsively**: Check on mobile devices
3. **Optimize images**: Use WebP format when possible
4. **Update links**: Ensure all GitHub/LinkedIn links work
5. **Personal touch**: Customize colors to match your brand

## 📝 Adding New Sections

1. Create component in `src/sections/YourSection.jsx`
2. Create styles in `src/styles/yourSection.css`
3. Import in `src/App.jsx`
4. Add navigation link in `src/components/Navbar.jsx`

## 🐛 Troubleshooting

**Port already in use:**
```bash
npm run dev -- --port 3000
```

**Build errors:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📈 Enhancement Ideas

- Add contact form (EmailJS, Formspree)
- Implement dark/light mode toggle
- Add blog section
- Include Google Analytics
- Add project screenshots
- Testimonials section
- Skills progress bars
- More animations

## 📄 License

Free to use for personal and commercial projects. No attribution required!

## 🤝 Support

Check documentation files for detailed guides:
- `README.md` - This file
- `PROJECT_INFO.txt` - Comprehensive guide
- `INSTALL_GUIDE.md` - Detailed setup

---

**Built with ❤️ using React + Vite**

Good luck with your portfolio! 🚀
