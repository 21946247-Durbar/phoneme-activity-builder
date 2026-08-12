# 🎵 Phoneme Activity Builder

A web-based tool for **Speech Pathology educators** to create interactive **phoneme-based** Wordle and Word Search activities using HCE (Harrington, Cox, and Evans) phoneme symbols for Australian English.

---

## 📋 Project Overview

This application is part of **Assessment 1: Frontend Design and Usability**.

The Phoneme Activity Builder allows Speech Pathology teachers to:

- Create **phoneme-based Wordle games** where students guess words using HCE phoneme symbols
- Generate **phoneme-based Word Search puzzles** for classroom activities
- Export **standalone HTML files** that work offline in any browser
- Customize activities with **difficulty settings** and **theme preferences**

### Who Is This For?

- **Speech Pathology Teachers** - Create engaging classroom activities
- **Speech Pathology Students** - Practice phoneme recognition in a fun, interactive way

### Why Phonemes?

Australian English uses **HCE (Harrington, Cox, and Evans)** broad phoneme symbols. This tool helps students recognize and practice these sounds, which is essential for speech pathology education.

---

## 🎯 Features

### 🎯 Wordle Activity Builder
- Select target words from HCE phoneme lists (3, 4, or 5 phonemes)
- Interactive preview with real-time feedback
- **6 attempts** to guess the word
- **Color-coded feedback:**
  - 🟢 Green = Correct phoneme in correct position
  - 🟡 Yellow = Correct phoneme in wrong position
  - ⚪ Gray = Phoneme not in the word
- Phoneme keyboard with **pronunciation hints** (e.g., `/θ/` → "as in thin")
- **Difficulty settings:** Easy (8 attempts, 3-4 phonemes), Medium (6 attempts, 4-5 phonemes), Hard (4 attempts, 5+ phonemes)
- Export as **standalone HTML file**

### 🔍 Word Search Activity Builder
- Configurable grid dimensions (10-40 rows and columns)
- Select 1-10 words from HCE phoneme lists
- **Random word selection** with adjustable count
- **Interactive selection** with click and drag support
- **Show/Hide solution** toggle for self-assessment
- **Difficulty settings:** Easy (8x8 grid, 3 words, 3-phoneme only), Medium (10x10, 5 words, 3-4 phonemes), Hard (12x12, 8 words, 4-5 phonemes)
- Export as **standalone HTML file**

### 🌓 Theme Support
- Light and Dark mode with **cookie persistence**
- Preferences saved across sessions
- Consistent visual design across all pages

### ♿ Accessibility
- **ARIA attributes** on all interactive elements
- **Keyboard navigation** support
- **Semantic HTML** structure
- **Focus management** for screen readers
- **Responsive design** for all devices

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** (App Router) | React framework for building the application |
| **TypeScript** | Type-safe JavaScript for better code quality |
| **Tailwind CSS** | Utility-first CSS framework for styling |
| **React Hooks** | State management and lifecycle features |
| **Browser Cookies** | Persisting user preferences (theme, settings) |
| **Git/GitHub** | Version control and collaboration |

---

## 📚 HCE Phoneme Dataset

This application uses the Harrington, Cox, and Evans (HCE) phoneme symbols for Australian English.

### Phoneme Groups

| Group | Examples |
|-------|----------|
| **Plosives & Nasals** | p, b, t, d, k, g, n, m, ŋ |
| **Fricatives & Approximants** | f, v, θ, ð, s, z, ʃ, ʒ, h, l, ɹ, w, j, tʃ, dʒ |
| **Monophthongs** | iː, ɪ, e, eː, æ, ɐ, ɐː, ɜː, ʉː, ɔ, oː, ʊ |
| **Diphthongs & Schwa** | æɪ, ɑe, oɪ, əʉ, æɔ, ɪə, ə |

### Word Lists

The corpus includes:

- **30 words** with 3 phonemes (e.g., *bed* → b-e-d)
- **30 words** with 4 phonemes (e.g., *stop* → s-t-ɔ-p)
- **30 words** with 5 phonemes (e.g., *stamp* → s-t-æ-m-p)

---

## 🔧 Configuration

### Theme Settings

The application supports Light and Dark modes with cookie persistence:

| Setting | Description |
|---------|-------------|
| **Theme** | Light or Dark mode |
| **Storage** | Browser cookie (expires in 365 days) |

### Difficulty Settings (Wordle)

| Difficulty | Attempts | Word Length |
|------------|----------|-------------|
| **Easy** | 8 attempts | 3-4 phonemes |
| **Medium** | 6 attempts | 4-5 phonemes |
| **Hard** | 4 attempts | 5+ phonemes |

### Difficulty Settings (Word Search)

| Difficulty | Grid Size | Word Count | Word Length |
|------------|-----------|------------|-------------|
| **Easy** | 8x8 | 3 words | 3 phonemes only |
| **Medium** | 10x10 | 5 words | 3-4 phonemes |
| **Hard** | 12x12 | 8 words | 4-5 phonemes |

---

## 📁 Project Directory Structure

```text
phoneme-activity-builder/
├── app/                        # Next.js App Router pages
│   ├── about/                  # About page
│   │   └── page.tsx
│   ├── components/             # Reusable React components
│   │   ├── Footer.tsx          # Site footer with student details
│   │   ├── Navbar.tsx          # Navigation with mobile menu
│   │   ├── PhonemeKeyboard.tsx # Interactive phoneme keyboard
│   │   ├── ThemeToggle.tsx     # Light/Dark mode toggle
│   │   ├── WordlePreview.tsx   # Wordle game preview
│   │   ├── WordListSelector.tsx# Word selection component
│   │   └── WordSearchPreview.tsx # Word Search preview
│   ├── settings/               # Settings page
│   │   └── page.tsx
│   ├── word-search/            # Word Search builder page
│   │   └── page.tsx
│   ├── wordle/                 # Wordle builder page
│   │   └── page.tsx
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── lib/                        # Helper functions and logic
│   ├── cookies.ts              # Cookie management utilities
│   ├── htmlExport.ts           # HTML export generation
│   ├── phonemeData.ts          # HCE phoneme dataset
│   ├── wordleEngine.ts         # Wordle game logic
│   └── wordSearchEngine.ts     # Word Search game logic
├── types/                      # TypeScript type definitions
│   └── index.ts
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration


# 1. Clone the repository
$ git clone [https://github.com/21946247-Durbar/phoneme-activity-builder.git](https://github.com/21946247-Durbar/phoneme-activity-builder.git)

# 2. Navigate to the project folder
$ cd phoneme-activity-builder

# 3. Install dependencies
$ npm install

# 4. Start the development server
$ npm run dev
