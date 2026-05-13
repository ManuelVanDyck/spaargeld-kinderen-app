# Spaargeld Kinderen App 💰

Een moderne web-app voor het beheren van spaargeld van kinderen, met transactie logging, dashboards, en spaar-doelstellingen.

## ✨ Features

### Core Functionaliteit
- **Multi-kind beheer**: Beheer spaargeld voor meerdere kinderen
- **Transactie logging**: Registreer inkomsten en uitgaven met categorieën
- **Real-time saldo**: Automatische saldo berekening
- **Dashboard**: Overzicht met statistieken en recente transacties
- **Data export**: Exporteer naar JSON voor backup

### Geavanceerde Features
- **Visuele statistieken**: Grafieken voor spaargeld ontwikkeling en uitgaven patronen
- **Categorieën**: Automatische categorisatie van transacties
- **Responsive design**: Werkt perfect op mobiel, tablet en desktop
- **PWA ondersteuning**: Installeerbaar als native app
- **Offline functionaliteit**: Werkt zonder internetverbinding

## 🚀 Snel aan de slag

### Ontwikkeling

```bash
# Clone het project
git clone <repository-url>
cd spaargeld-app

# Installeer dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Productie build

```bash
# Build voor productie
npm run build

# Preview productie build
npm run preview
```

## 📱 Gebruik

### Eerste keer opstarten
1. Open de app in je browser
2. Klik "Import" → "Voorbeelddata laden" om te starten met sample data
3. Of begin direct met het toevoegen van transacties

### Transacties toevoegen
1. Klik op "Toevoegen" of "Uitgeven" in het dashboard
2. Vul het formulier in (bedrag, beschrijving, categorie, datum)
3. Klik "Toevoegen" om op te slaan

### Kinderen wisselen
- Gebruik de knoppen bovenaan om tussen kinderen te wisselen
- Elk kind heeft zijn eigen transacties en statistieken

### Data beheren
- **Export**: Klik "Export" in de header voor JSON backup
- **Import**: Klik "Import" om data te importeren

## 🏗️ Technische Details

### Tech Stack
- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **State**: React Context + localStorage
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: Lucide React
- **Build**: Vite 8
- **PWA**: Service Worker + Web App Manifest

### Project Structuur
```
src/
├── components/         # React componenten
│   ├── ui/            # Basis UI componenten
│   ├── Dashboard.tsx   # Hoofd dashboard
│   ├── TransactionsList.tsx  # Transacties overzicht
│   └── Charts.tsx     # Statistieken grafieken
├── context/           # React Context voor state
├── hooks/             # Custom React hooks
├── types/             # TypeScript interfaces
└── utils/             # Utilities en helpers
```

### Data Model
```typescript
interface Child {
  id: string;
  name: string;
  birthDate: string;
  currentBalance: number; // Berekend, niet opgeslagen
  profileColor: string;
}

interface Transaction {
  id: string;
  childId: string;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
  date: string; // ISO string
}
```

### Data Opslag
- **LocalStorage**: Alle data wordt lokaal opgeslagen in de browser
- **Key**: `spaargeld-app-data`
- **Format**: JSON object met children array en transactions array
- **Backup**: Export/import functionaliteit voor data portabiliteit

### PWA Features
- **Manifest**: `/manifest.json` met app metadata
- **Service Worker**: `/sw.js` voor offline caching
- **Installeerbaar**: Via browser "Add to home screen"
- **Offline**: Basic functionaliteit werkt zonder internet

## 🧪 Testing

### Handmatige Test Checklist
- [ ] Dashboard laadt met juiste saldi
- [ ] Kinderen wisselen werkt
- [ ] Transactie toevoegen (income & expense)
- [ ] Transactie bewerken & verwijderen
- [ ] Transactie filtering & sortering
- [ ] Charts tonen juiste data
- [ ] Export functionaliteit
- [ ] Import functionaliteit
- [ ] Mobile responsiveness
- [ ] PWA install prompt
- [ ] Offline functionaliteit

### Browser Testing
- Chrome 90+ ✅
- Firefox 85+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

### Mobile Testing
- iOS Safari ✅
- Android Chrome ✅
- PWA geïnstalleerd ✅

## 🚀 Deployment

Zie `DEPLOYMENT.md` voor gedetailleerde deployment instructies.

### Quick Deploy (Vercel)
1. Push code naar GitHub
2. Import project in Vercel
3. Deploy automatisch

### Quick Deploy (Netlify)
1. `npm run build`
2. Upload `dist/` folder naar Netlify
3. Configure redirects for SPA

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment
- Node.js 18+ required
- Package manager: npm
- Build tool: Vite 8
- TypeScript 6

### Build Output
De productie build genereert geoptimaliseerde chunks:
- `vendor` — React + ReactDOM (~182 kB, ~57 kB gzip)
- `chart` — Chart.js + react-chartjs-2 (~202 kB, ~69 kB gzip)
- `index` — Applicatie code (~80 kB, ~21 kB gzip)
- `index.css` — Alle styles (~25 kB, ~5 kB gzip)

Totale bundle grootte: ~536 kB (ongecomprimeerd), ~152 kB gzip.

## 📄 License

MIT License - Gebruik vrijelijk voor persoonlijke of commerciële doeleinden.

## 🤝 Contributing

Pull requests welcome! Voor grote wijzigingen, open eerst een issue.
