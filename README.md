Markdown
# SpendWise — Personal Budget & Expense Tracker

SpendWise is a responsive, interactive personal budget and expense tracking web application built from the ground up with semantic HTML5, modern CSS3 (CSS Grid, Flexbox, and CSS Custom Properties), and vanilla JavaScript. Designed as a full-stack-ready frontend capstone project, it enables users to set a monthly budget, log and categorize expenses, monitor real-time spending thresholds, and persist data locally in the browser.

## Live Demo

- **Live Application:** `https://<your-netlify-subdomain>.netlify.app` *(replace with your live Netlify URL)*
- **GitHub Repository:** `https://github.com/GoanarYien/SpendWise` *(replace with your repository URL)*

---

## Features

- **Real-Time Budget Summary:** Dynamically calculates and displays your **Monthly Budget**, **Total Spent**, and **Remaining Balance**.
- **Automated Budget Health Alerts:** Uses conditional logic to display color-coded status feedback—**On Track** (under 80% used), **Heads Up** (80%–100% used), and **Over Budget Alert** (exceeding the monthly limit).
- **Interactive Category Breakdown:** Six responsive category cards (**Food**, **Transport**, **Rent**, **Entertainment**, **Utilities**, and **Other**) with live transaction counts, totals, smooth hover/focus micro-interactions, and click-to-filter functionality.
- **Expense Management & Filtering:** Add validated expenses with a name, dollar amount, category, and date; filter the expense history table by category; or delete individual entries.
- **Browser Persistence (`localStorage`):** Automatically saves your custom budget and expense records across page refreshes, with a one-click **Reset Sample Data** option.
- **Responsive Design & Dark Mode:** Collapses cleanly into a single-column layout below `768px` and automatically adapts to system light/dark preferences via `@media (prefers-color-scheme: dark)`.
- **Built-In Budgeting Resources:** Includes an interactive `<details>` quick-start guide and an embedded budgeting tutorial video.

---

## Project Structure

```text
SpendWise/
├── index.html      # Semantic HTML5 structure, dashboard layout, form, table, and multimedia
├── style.css       # CSS custom properties, Grid/Flexbox layout, card styling, and dark mode
├── script.js       # Budget calculations, DOM manipulation, event listeners, and localStorage
└── README.md       # Project documentation, setup, and deployment instructions