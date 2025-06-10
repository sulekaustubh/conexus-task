## 🛠 Tech Stack

-   **Framework**: Next.js 14 with App Router
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **State Management**: Zustand
-   **Forms**: React Hook Form with Zod validation
-   **Data Fetching**: TanStack Query (React Query)
-   **Icons**: Lucide React
-   **Date Handling**: date-fns

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Tasks page (home)
│   ├── providers.tsx     # Global providers
│   └── recipes/          # Recipe pages
├── components/           # React components
│   ├── ui/              # Shadcn UI base components
│   ├── navigation.tsx   # Main navigation
│   ├── recipe-table.tsx # Recipe browser
│   ├── task-board.tsx   # Kanban board
│   ├── task-card.tsx    # Individual task cards
│   └── task-form.tsx    # Task creation/editing form
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── store/               # Zustand stores
└── types/               # TypeScript interfaces
```

## 🚀 Getting Started

### Installation

1. **Clone the repo**

    ```bash
    git clone <repository-url>
    cd collaborative-task-manager
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Start the development server**

    ```bash
    npm run dev
    ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)
