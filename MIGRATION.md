# Migrace: Base44 → Vercel + GitHub

Tento dokument popisuje vše, co potřebuješ vědět pro správu a nasazení webu.

---

## Co se změnilo

| Dříve (Base44) | Nyní |
|---|---|
| Base44 databáze | `src/data/projects.json` |
| Base44 nastavení | `src/data/settings.json` |
| Base44 autentizace | Žádná (admin je veřejný na `/admin`) |
| Base44 upload souborů | URL z Vimea nebo externího hostingu |
| Base44 email | `mailto:` odkaz otevírající mailového klienta |

**Náklady:** Platíš jen za doménu (~300 Kč/rok). GitHub a Vercel jsou zdarma.

---

## 1. Jak spustit web lokálně (poprvé)

### Co budeš potřebovat
- [Node.js](https://nodejs.org/) (stáhni verzi LTS)
- [Git](https://git-scm.com/)
- Účet na [GitHub](https://github.com)
- Účet na [Vercel](https://vercel.com)

### Kroky

1. Založ si repozitář na GitHubu:
   - Jdi na [github.com/new](https://github.com/new)
   - Pojmenuj ho např. `janvalis-portfolio`
   - Nastav jako **Private**
   - Klikni **Create repository**

2. Rozbal stažený zip tohoto projektu na svém počítači

3. Otevři terminál (na Macu: `Terminal`, na Windows: `cmd` nebo `PowerShell`) a přejdi do složky projektu:
   ```
   cd cesta/k/janvalis-migrated
   ```

4. Inicializuj Git a nahraj na GitHub:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TVOJE_UZIVATELSKE_JMENO/janvalis-portfolio.git
   git push -u origin main
   ```
   *(Nahraď `TVOJE_UZIVATELSKE_JMENO` svým GitHub jménem)*

5. Nainstaluj závislosti a spusť lokálně:
   ```
   npm install
   npm run dev
   ```

6. Web poběží na `http://localhost:5173`

---

## 2. Jak nasadit web na Vercel

1. Jdi na [vercel.com](https://vercel.com) a přihlas se přes GitHub

2. Klikni **Add New → Project**

3. Najdi svůj repozitář `janvalis-portfolio` a klikni **Import**

4. Nastavení nech beze změny — Vercel automaticky detekuje Vite/React

5. Klikni **Deploy**

6. Za 1–2 minuty je web živý na adrese jako `janvalis-portfolio.vercel.app`

**Automatické nasazení:** Pokaždé, když nahraješ změnu na GitHub, Vercel web automaticky aktualizuje. Nemusíš nic dělat ručně.

---

## 3. Jak připojit vlastní doménu

1. Kup doménu u registrátora (např. [Wedos](https://wedos.cz), [Active24](https://active24.cz), [Forpsi](https://forpsi.cz))

2. Na Vercelu jdi do svého projektu → **Settings → Domains**

3. Zadej svou doménu (např. `janvalis.com`) a klikni **Add**

4. Vercel ti ukáže DNS záznamy — zkopíruj je

5. U svého registrátora domény přejdi do nastavení DNS a přidej záznamy, které ti Vercel ukázal (typ A nebo CNAME)

6. Počkej 5–30 minut — DNS se propaguje. Poté web pojede na tvé doméně s automatickým HTTPS.

---

## 4. Jak přidat nový projekt (nejčastější úkon)

### Způsob A: Přes admin panel (doporučeno)

1. Jdi na `tvujweb.com/admin`

2. Klikni **Add Project**

3. Vyplň:
   - **Title** — název projektu
   - **Client / Brand** — klient (nepovinné)
   - **Category** — Commercial nebo Other
   - **Vimeo URL** — vlož URL videa, thumbnail se automaticky stáhne z Vimea
   - **Aspect Ratio** — poměr stran videa
   - **Featured** — zapni, pokud chceš projekt na hlavní stránce

4. Klikni **Create Project**

5. Klikni zelené tlačítko **Download projects.json** (zobrazí se nahoře)

6. Nahraj stažený soubor na GitHub:
   - Jdi na [github.com](https://github.com) → tvůj repozitář
   - Najdi `src/data/projects.json`
   - Klikni na tužku (Edit)
   - Smaž obsah a vlož obsah staženého souboru
   - Dole klikni **Commit changes**

7. Vercel web automaticky aktualizuje za ~1 minutu ✓

### Způsob B: Editovat JSON přímo na GitHubu

1. Jdi na GitHub → `src/data/projects.json`

2. Klikni na tužku (Edit)

3. Zkopíruj existující objekt projektu a uprav hodnoty:
   ```json
   {
     "id": "UNIKATNI_CISLO",
     "title": "Název projektu",
     "clientBrand": "Klient",
     "category": "commercial",
     "descriptor": "Krátký popis",
     "thumbnailUrl": "https://vumbnail.com/VIMEO_ID.jpg",
     "videoUrl": "https://vimeo.com/VIMEO_ID",
     "aspectRatio": "16:9",
     "sortOrder": 10,
     "isVisible": true,
     "featured": true
   }
   ```
   > **Thumbnail z Vimea:** Otevři `https://vimeo.com/api/oembed.json?url=https://vimeo.com/VIMEO_ID` a najdi `thumbnail_url`.
   > Nebo použij zkratku: `https://vumbnail.com/VIMEO_ID.jpg`

4. Klikni **Commit changes** — web se aktualizuje automaticky

---

## 5. Jak upravit nebo smazat existující projekt

### Úprava:
- `/admin` → klikni tužku u projektu → uprav → **Save Changes** → stáhni JSON → nahraj na GitHub

### Smazání:
- `/admin` → klikni koš u projektu → potvrď → stáhni JSON → nahraj na GitHub

### Změna pořadí:
- `/admin` → přetáhni projekty myší do požadovaného pořadí → stáhni JSON → nahraj na GitHub

---

## 6. Jak upravit CV (stránka Bio)

CV je napevno v kódu v souboru `src/pages/Bio.jsx`. Jsou tam tři sekce:

- `filmWorks` — filmové projekty
- `commercialWorks` — komerční projekty  
- `musicVideos` — hudební videa

**Postup úpravy:**

1. Na GitHubu otevři `src/pages/Bio.jsx`
2. Klikni na tužku (Edit)
3. Najdi příslušné pole a uprav text
4. Formát záznamu:
   ```js
   { title: 'Název projektu (d. Režisér)', note: 'Festival · Cena' },
   ```
5. Klikni **Commit changes**

Fotografii, jméno a podtitulek (pod jménem) můžeš změnit přes `/admin` → Settings.

---

## 7. Jak změnit kontaktní údaje a sociální sítě

1. Jdi na `tvujweb.com/admin` → **Settings** (odkaz v levém panelu)

2. Uprav:
   - **Contact Email** — zobrazuje se na contact stránce
   - **Name** a **Subtitle** — zobrazují se na Bio stránce
   - **Bio Text** — tvůj bio text
   - **Bio Photo URL** — URL tvé fotky (nahraj na [imgur.com](https://imgur.com) a vlož URL)
   - **Social Links** — JSON pole odkazů

3. Klikni **Download settings.json**

4. Nahraj soubor na GitHub do `src/data/settings.json` (stejný postup jako u projektů)

### Formát social links:
```json
[
  { "label": "INSTAGRAM", "url": "https://instagram.com/janvalis" },
  { "label": "LINKEDIN", "url": "https://linkedin.com/in/janvalis" },
  { "label": "IMDB", "url": "https://www.imdb.com/name/..." },
  { "label": "VIMEO", "url": "https://vimeo.com/janvalis" }
]
```

---

## Struktura projektu

```
src/
  data/
    projects.json     ← TADY jsou všechny projekty (edituj toto)
    settings.json     ← TADY jsou nastavení webu (edituj toto)
  pages/
    Home.jsx          ← Hlavní stránka (grid)
    Commercial.jsx    ← Commercial + Other stránka
    Bio.jsx           ← Bio / CV stránka
    Contact.jsx       ← Kontaktní stránka
    admin/
      AdminProjects.jsx   ← Admin: správa projektů
      AdminSettings.jsx   ← Admin: nastavení
      ProjectForm.jsx     ← Formulář pro projekt
  components/
    MasonryGrid.jsx   ← Grid layout
    Lightbox.jsx      ← Video přehrávač
    Navigation.jsx    ← Menu
    SocialFooter.jsx  ← Footer se sociálními sítěmi
```

---

## Poznámky

**Admin panel je veřejný** — kdokoli kdo zná URL `/admin` tam může přijít. Pokud by ti to vadilo, stačí mi říct a přidám ochranu heslem.

**Kontaktní formulář** — po odeslání otevře mailového klienta s předvyplněnou zprávou. Pokud bys chtěl formulář, který opravdu odešle email na pozadí, dá se přidat [Resend](https://resend.com) nebo [Formspree](https://formspree.io) zdarma.

**Thumbnaily** — Vimeo API vrací thumbnail automaticky při vložení URL. Pokud chceš vlastní thumbnail, vlož URL obrázku ručně do pole Thumbnail URL.
