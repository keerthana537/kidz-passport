Kidz Passport - Junior Frontend Challenge

A premium, responsive "Activities Explorer" built with Next.js 14, Tailwind CSS, and the DummyJSON API.

# How to Run the Project

1. Clone the repository: git clone [your-repo-link]
2. Install dependencies: npm install
3. Start the development server: npm run dev
4. View in browser: Open http://localhost:3000

# Completed Requirements

# Core Features

- Activity List: Fetches and displays the required 12 activities in a responsive grid.
- Search: Real-time title filtering (case-insensitive).
- Category Filter: Dynamic dropdown populated from API data.
- Sorting: Functionality to sort by Price (High/Low) and Ratings.
- Details Modal: A custom "Phone-style" modal for viewing activity details.

# Bug Fixes & Edge Cases

- Image Handling: Used aspect-ratio containers to ensure clean layouts during loads.
- N/A Logic: Ratings that are missing or 0 are gracefully displayed as "N/A".
- Empty States: Custom UI shown when search results return no items.
- Error Handling: Basic state management to catch API failures.

# Bonus Features

- Debounced Search (300ms): Optimized performance by delaying filtering logic until the user stops typing.
- URL Parameter Persistence: Filters and search queries are synced with the URL, making the view persistent on page refresh.
- Favorites Feature: Integrated a "Heart" system using LocalStorage, allowing users to save favorite activities.
- Accessibility: Enhanced the UI with semantic HTML, aria-labels, and roles for screen readers.
- Logic Isolation: Structured filtering and sorting within useMemo for high performance and easy unit testing.

# Tech Stack:-

- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS
- Data Source: DummyJSON API

# Assumptions & Trade-offs:-

- Currency: Prices are displayed in USD ($) to remain consistent with the raw numerical data provided by the DummyJSON API.
- Theme Mapping: I have mapped the API's "Products" to function as "Activities" to align with the Kidz Passport brand.
- Item Limit: The app is strictly limited to 12 items as per the primary requirement.
