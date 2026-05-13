# Deployment Gids - Spaargeld Kinderen App

## 📋 Overzicht

Deze gids beschrijft hoe je de Spaargeld Kinderen App kunt deployen naar verschillende hosting platforms.

## ⚡ Quick Deploy Opties

### 1. Vercel (Aanbevolen)
De eenvoudigste deployment optie voor React apps.

#### Via Vercel CLI
```bash
# Installeer Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Via Vercel Dashboard
1. Push code naar GitHub/GitLab
2. Ga naar [vercel.com](https://vercel.com)
3. "Import Project" → Selecteer repository
4. Configureer:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Node.js Version: 18.x
5. Deploy

### 2. Netlify
Goede optie met focus op frontend apps.

#### Via Netlify CLI
```bash
# Installeer Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Build en deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Via Netlify Dashboard
1. Build lokaal: `npm run build`
2. Ga naar [netlify.com](https://netlify.com)
3. Drag & drop de `dist/` folder
4. Configure redirects (zie hieronder)

### 3. GitHub Pages
Gratis optie voor GitHub repositories.

#### Setup
1. Installeer gh-pages: `npm i -D gh-pages`
2. Add scripts to `package.json`:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```
3. Update `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/spaargeld-app/', // Vervang met je repo naam
     // ... rest van config
   });
   ```
4. Deploy: `npm run deploy`

## 🔧 Configuratie

### SPA Redirects
Voor client-side routing (hash-based), configureer redirects:

#### Netlify
Create `dist/_redirects`:
```
/*    /index.html   200
```

#### Vercel
Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Environment Variabelen
De app heeft geen API keys nodig, maar voor toekomstige uitbreidingen:

#### Vercel
```bash
vercel env add VITE_API_URL
```

#### Netlify
```bash
netlify env:set VITE_API_URL "https://api.example.com"
```

## 📊 Build Optimalisatie

De huidige `vite.config.ts` bevat al productie-optimalisaties:

- **Code splitting**: React, Chart.js en app code worden in aparte chunks geladen
- **ES2020 target**: Moderne JavaScript output
- **Geen sourcemaps**: Kleinere bundle in productie
- **Manual chunks**: Vendor en chart libraries gesplitst voor betere caching

### Bundle Analyse
```bash
# Installeer bundle analyzer
npm i -D rollup-plugin-visualizer

# Add to vite.config.ts plugins:
import { visualizer } from 'rollup-plugin-visualizer'

plugins: [
  react(),
  visualizer({ filename: 'dist/stats.html', open: true })
]

# Build en bekijk analyse
npm run build
```

### Huidige Build Resultaten
```
dist/index.html                  1.75 kB │ gzip:  0.72 kB
dist/assets/index.css           24.95 kB │ gzip:  5.12 kB
dist/assets/rolldown-runtime.js  0.56 kB │ gzip:  0.36 kB
dist/assets/index.js            79.73 kB │ gzip: 20.55 kB
dist/assets/vendor.js          181.89 kB │ gzip: 57.20 kB
dist/assets/chart.js           202.09 kB │ gzip: 69.10 kB
────────────────────────────────────────────────────────────
Totaal                         ~491 kB   │ gzip: ~153 kB
```

## 🔒 Beveiliging

### Content Security Policy (CSP)
Add to `index.html` head:

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' 'unsafe-inline';
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: blob:;">
```

### Headers (Netlify)
Create `_headers`:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
```

## 📱 PWA Deployment Checklist

- [x] `manifest.json` accessible at `/manifest.json`
- [x] Service worker at `/sw.js`
- [x] Icons present: `/icon-192x192.png`, `/icon-512x512.png`
- [ ] HTTPS enabled (vereist voor PWA)
- [ ] Lighthouse PWA score > 90

### PWA Testing
```bash
# Test met Lighthouse CLI
npm i -g lighthouse
lighthouse https://your-app.vercel.app --view
```

## 🌐 Custom Domain

### Vercel
1. Ga naar Project Settings → Domains
2. Add custom domain
3. Update DNS CNAME naar `cname.vercel-dns.com`

### Netlify
1. Site Settings → Domain management
2. Add custom domain
3. Update DNS CNAME naar `your-site.netlify.app`

## 📈 Monitoring

### Analytics
Add Google Analytics (optioneel):

```typescript
// src/utils/analytics.ts
export const initGA = () => {
  if (process.env.NODE_ENV === 'production') {
    // Add your GA implementation
  }
};
```

### Error Monitoring
Consider Sentry voor error tracking:

```bash
npm i @sentry/react @sentry/tracing
```

## 🚀 Deployment Workflow

### Geautomatiseerd (GitHub Actions)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
          vercel-args: '--prod'
```

## ⚠️ Troubleshooting

### Veelvoorkomende Problemen

**Build Failed - Module Not Found**
```bash
# Clear cache en reinstall
rm -rf node_modules package-lock.json
npm install
```

**White Screen na Deploy**
- Check browser console voor errors
- Verify base URL in vite.config.ts
- Check SPA redirects configuratie

**PWA niet installeerbaar**
- Verify HTTPS enabled
- Check manifest.json accessibility
- Verify service worker registration
- Use Chrome DevTools → Application → Manifest

**Charts niet zichtbaar**
- Check Chart.js chunks loaded correctly
- Verify no CSP blocking scripts
- Test in incognito mode

### Performance Issues
```bash
# Analyse bundle size
npm run build
du -sh dist/assets/*

# Lokale preview
npm run preview
```

## 📞 Support

Voor deployment problemen:
1. Check platform status pages
2. Controleer build logs
3. Test lokaal met `npm run preview`
4. Check browser developer tools

---

**Tip**: Begin met Vercel voor de snelste deployment ervaring!
