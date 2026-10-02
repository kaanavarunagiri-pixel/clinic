# AuraMed™ Multi-Specialty Clinic Web Application

Production-ready, interactive Multi-Specialty Clinic Web Application built with Vite, React 19, Tailwind CSS, Lucide React, Framer Motion, and Three.js / React Three Fiber (`@react-three/fiber`, `@react-three/drei`).

---

## 🚀 How to Deploy to Netlify

This repository is pre-configured with `netlify.toml`, `public/_redirects`, and `public/_headers` for automatic deployment and client-side SPA routing.

### Option 1: Git Integration (Recommended - Automated CI/CD)
1. Push this repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [app.netlify.com](https://app.netlify.com/) and click **"Add new site" > "Import an existing project"**.
3. Select your repository. Netlify will automatically detect the settings from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Click **Deploy Site**. Every future commit will auto-deploy!

---

### Option 2: Netlify Drag-and-Drop (Instant 30-Second Deploy)
1. Build the production output locally:
   ```bash
   npm run build
   ```
2. Navigate to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the generated `dist` folder directly into the browser window.
4. Your website will be live immediately with a secure SSL URL.

---

### Option 3: Netlify CLI (Command Line)
1. Install or run Netlify CLI:
   ```bash
   npx netlify deploy --prod --dir=dist
   ```
2. Follow the terminal prompts to link or create a new site.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🛠️ Netlify Configurations Included

- **`netlify.toml`**: Defines build command, publish directory, Node.js version, SPA rewrites, and security headers.
- **`public/_redirects`**: Fallback `/* /index.html 200` rewrite to ensure all deep client-side links route cleanly.
- **`public/_headers`**: Configures security policies (`X-Frame-Options`, `X-Content-Type-Options`) and immutable caching for `/assets/*` assets on Netlify's Global Edge CDN.
- **Code Splitting**: Configured in `vite.config.js` to split `react-vendor` and `three-vendor` for optimal cache hits and instant initial load.
