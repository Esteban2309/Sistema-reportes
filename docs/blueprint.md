# **App Name**: Sistema de Notas UdC

## Core Features:

- User Authentication & Authorization: Secure user login/logout functionality using Firebase Authentication (email/password) to protect access to the academic reports dashboard.
- Intuitive Dashboard & Navigation: A protected dashboard featuring a static top navigation bar and a dynamic sidebar for seamless navigation across different report types and historical data.
- Comprehensive Academic Data Processing: Retrieval and aggregation of student, teacher, subject, and grade data from Firebase Firestore collections, including on-the-fly calculation of 'definitiva' scores for all grades.
- Dynamic Academic Report Generation: Interactive tools for generating detailed academic reports (by student, subject, teacher, group, and trend analysis) based on user-selected filters from Firestore data.
- Interactive Data Visualization: Integration of Recharts to visually represent academic metrics, grade distributions, approval rates, and grade evolution over time for better insights.
- Multi-Format Report Export: Client-side export functionality, allowing users to download generated reports in professional PDF (using jsPDF) and Excel (using xlsx) formats.
- Report History and Management: A dedicated section to view and manage a historical log of all generated reports, including metadata and download links for quick access.

## Style Guidelines:

- Primary color: A deep indigo blue (#1F2269) for navigation bars, essential buttons, and headings, conveying academic authority and trust in a light scheme.
- Background color: A very light, desaturated grayish-blue (#F0F1F7) to provide a clean and calm canvas for content, maintaining visual harmony with the primary blue hue.
- Accent color: A vibrant yellow-gold (#E8BE0D) chosen to highlight calls-to-action (CTAs) and important information, creating a dynamic contrast with the blue palette.
- Headlines: 'Space Grotesk', a modern sans-serif, used for a technical and precise feel suitable for an engineering university. Body Text: 'Inter', a neutral and highly readable sans-serif, for clear presentation of academic data and detailed reports.
- Clean, outlined icons that align with academic themes (e.g., reports, students, courses, charts) for clarity in navigation and data presentation.
- A fixed top navigation and a persistent left-aligned sidebar create a stable visual hierarchy. Content areas feature cards and tables with rounded corners and subtle shadows for structured information display.
- Subtle, smooth transitions for page loads, filter changes, and chart renderings to enhance user experience without distraction. Loading skeletons will provide visual feedback during data fetching.