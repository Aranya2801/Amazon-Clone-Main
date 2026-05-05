<div align="center">

<img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon Logo" width="200"/>

# 🛒 Amazon Clone — Advanced Edition

### A pixel-perfect, feature-rich Amazon India clone built with pure HTML, CSS & Vanilla JavaScript

[![GitHub Stars](https://img.shields.io/github/stars/Aranya2801/Amazon-Clone-Main?style=for-the-badge&color=FF9900&labelColor=131921)](https://github.com/Aranya2801/Amazon-Clone-Main/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Aranya2801/Amazon-Clone-Main?style=for-the-badge&color=FF9900&labelColor=131921)](https://github.com/Aranya2801/Amazon-Clone-Main/network)
[![License](https://img.shields.io/badge/License-MIT-FF9900?style=for-the-badge&labelColor=131921)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

<br/>

**[🚀 Live Demo](#)** · **[📦 Features](#-features)** · **[🖼️ Screenshots](#%EF%B8%8F-screenshots)** · **[⚙️ Setup](#%EF%B8%8F-installation--setup)**

</div>

---

## 📸 Preview

<div align="center">
<table>
<tr>
<td align="center"><strong>🌞 Light Mode</strong></td>
<td align="center"><strong>🌙 Dark Mode</strong></td>
</tr>
<tr>
<td><img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop" alt="Light Mode Preview" style="border-radius:8px;"/></td>
<td><img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=300&fit=crop" alt="Dark Mode Preview" style="border-radius:8px;"/></td>
</tr>
</table>
</div>

---

## ✨ Features

### 🏠 Homepage
| Feature | Details |
|---|---|
| 🎠 **Auto Hero Carousel** | 3-slide auto-rotating carousel with countdown timers, navigation dots & keyboard support |
| 📢 **Announcement Banner** | Dismissible live deal notification bar |
| 🗂️ **Category Grid** | 8 department cards with hover animations and badge overlays |
| ⚡ **Today's Deals** | Horizontally scrollable deal cards with live countdown & progress bars |
| 🌟 **Featured Products** | 16+ products with category filter tabs and load-more pagination |
| ⭐ **Customer Reviews** | 6 real-style review cards with star ratings and avatars |
| 🔵 **Prime Banner** | Animated Prime membership promotional section |

### 🧭 Navigation
| Feature | Details |
|---|---|
| 🔍 **Smart Search** | Live suggestions dropdown with product & keyword matching + sort filter |
| 🍔 **Mega Menu** | Animated slide-in sidebar with departmental navigation |
| 📍 **Location Picker** | Delivery location display (Kolkata) |
| 👤 **Account Dropdown** | Hover-triggered dropdown with account links |
| 🌙 **Dark Mode Toggle** | Instant theme switch persisted to localStorage |
| 📱 **Fully Responsive** | Works on all screen sizes — desktop, tablet, mobile |

### 🛒 Shopping Cart
| Feature | Details |
|---|---|
| ➕ **Add to Cart** | One-click from product card, deal card or product modal |
| 🔢 **Quantity Controls** | Increment / decrement with max 10 cap |
| ❤️ **Wishlist** | Add/remove from wishlist with floating FAB counter |
| 💾 **localStorage Sync** | Cart, wishlist & recently viewed all persist across sessions |
| 🧾 **Cart Page** | Full `/pages/cart.html` — quantity selectors, save-for-later, promo codes, order summary |
| 🏷️ **Promo Codes** | Try: `ARANYA10`, `SAVE20`, `PRIME50` |

### 📦 Orders Page
| Feature | Details |
|---|---|
| 📋 **Order History** | 5 sample orders with full product details |
| 🔄 **Live Tracking Timeline** | 5-step animated progress indicator per order |
| 🔎 **Order Search** | Search across order IDs and product names |
| ↩️ **Returns & Reviews** | Action buttons for delivered orders |
| 🧾 **Invoice Download** | Demo invoice button |

### 🔐 Authentication
| Feature | Details |
|---|---|
| 🔑 **Sign In** | Email + password login with validation |
| 📝 **Register** | Full name, email, password + confirm with localStorage persistence |
| 🚪 **Sign Out** | Session clear with toast notification |
| 🔒 **Checkout Guard** | Redirects to sign-in if unauthenticated at checkout |

---

## 🗂️ Project Structure

```
Amazon-Clone-Main/
│
├── 📄 index.html               ← Main homepage
│
├── 📁 css/
│   ├── main.css                ← Global styles, CSS variables, dark mode
│   ├── navbar.css              ← Header, search bar, mega menu
│   ├── hero.css                ← Carousel & countdown
│   ├── products.css            ← Product cards, deal cards
│   ├── footer.css              ← Footer layout
│   ├── modals.css              ← Cart sidebar, product modal, auth modal
│   └── animations.css          ← Keyframes, scroll reveal, skeleton loaders
│
├── 📁 js/
│   ├── data.js                 ← All product, category, deal & review data
│   ├── cart.js                 ← Full cart system (add/remove/qty/persist)
│   ├── auth.js                 ← Sign in / register / session management
│   ├── ui.js                   ← Toast, wishlist, star renderer, modal builder
│   └── main.js                 ← App orchestrator (carousel, search, filters…)
│
├── 📁 pages/
│   ├── cart.html               ← Full dedicated cart page
│   └── orders.html             ← Order history & tracking page
│
└── 📁 assets/
    └── favicon.svg             ← Custom SVG favicon
```

---

## ⚙️ Installation & Setup

### Option 1 — Open directly (Zero setup)
```bash
# Just open index.html in your browser!
open index.html
```

### Option 2 — Local server (Recommended)
```bash
# Clone the repository
git clone https://github.com/Aranya2801/Amazon-Clone-Main.git

# Navigate to the project
cd Amazon-Clone-Main

# Using Python
python -m http.server 3000

# OR using Node.js live-server
npx live-server

# OR using VS Code → Install "Live Server" extension → Click "Go Live"
```

Then open **http://localhost:3000** in your browser.

---

## 🎨 Tech Stack

<div align="center">

| Technology | Usage |
|---|---|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) | Semantic structure, accessibility, ARIA |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) | Custom properties, Grid, Flexbox, Animations |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) | ES6+, modules pattern, localStorage, IntersectionObserver |
| ![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?style=flat&logo=fontawesome&logoColor=white) | 500+ icons |
| ![Google Fonts](https://img.shields.io/badge/Google_Fonts-4285F4?style=flat&logo=google&logoColor=white) | Nunito Sans, Playfair Display |
| ![Unsplash](https://img.shields.io/badge/Unsplash-000000?style=flat&logo=unsplash&logoColor=white) | High-quality product & hero images |

</div>

**No frameworks. No build tools. No dependencies installed.** Just open and go. ✅

---

## 🌙 Dark Mode

The app includes a fully implemented dark mode with smooth transitions. Toggle it with the **moon icon** in the navbar. Your preference is saved to `localStorage` and persisted across sessions.

---

## 📱 Responsive Design

| Breakpoint | Layout |
|---|---|
| `> 1200px` | Full desktop — 4 column product grid |
| `900px – 1200px` | Tablet — 3 column grid, condensed nav |
| `600px – 900px` | Small tablet — 2 column grid |
| `< 600px` | Mobile — 2 column grid, hidden nav items |

---

## 🔑 Demo Credentials

You can sign in with any email/password you register, or use these test accounts:

| Email | Password |
|---|---|
| `test@amazon.in` | `test123` |
| Create your own | via the Register form |

**Promo Codes to try:** `ARANYA10` · `SAVE20` · `PRIME50`

---

## 🚀 Upcoming Features

- [ ] 🔎 Advanced filter sidebar (price range, brand, rating)
- [ ] 📄 Individual product detail page (`/pages/product.html`)
- [ ] 💳 Mock checkout flow with address & payment
- [ ] 🔔 Push notification simulation
- [ ] 📊 Sales analytics dashboard
- [ ] 🤖 AI-powered product recommendations
- [ ] 🌐 Multi-language support (Hindi, Bengali, Tamil)

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the repository
2. Create your branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👩‍💻 Author

<div align="center">

**Aranya**

[![GitHub](https://img.shields.io/badge/GitHub-Aranya2801-181717?style=for-the-badge&logo=github)](https://github.com/Aranya2801)

*Built with ❤️ for learning and daily use*

---

> ⭐ **If you found this project helpful, please give it a star! It means a lot.**

</div>

---

<div align="center">
<sub>This project is for educational purposes only. Amazon™ is a trademark of Amazon.com, Inc.</sub>
</div>
