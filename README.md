# Zorx Agency Dashboard

A high-performance, AI-powered digital marketing agency dashboard built with React, Vite, and Tailwind CSS.

## 🚀 Deployment & Data Persistence

To ensure data is saved permanently when deployed to Vercel, this app uses **Supabase**.

### 1. Set up Supabase
1. Create a free account at [supabase.com](https://supabase.com).
2. Create a new project.
3. Go to the **SQL Editor** in the Supabase dashboard.
4. Copy the contents of `supabase_setup.sql` from this project and run it. This creates the necessary tables.

### 2. Connect to Vercel
1. In your Supabase Project Settings > API, copy the **Project URL** and **anon / public Key**.
2. Go to your Vercel Project Settings > Environment Variables.
3. Add the following variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
API_KEY=your_google_gemini_api_key
```

4. Redeploy your project. The app will now automatically detect the keys and switch from Local Storage to Supabase Cloud Storage.

## 🛠 Tech Stack

- **Framework:** React + Vite
- **Styling:** Tailwind CSS (configured via PostCSS)
- **Icons:** Lucide React
- **AI Integration:** Google Gemini API (`@google/genai`)
- **Data Persistence:** LocalStorage (Default) or Supabase (Cloud).

## 📂 Project Structure

- **`App.tsx`**: Main application router and layout logic.
- **`components/`**: Reusable UI components.
- **`services/`**: 
  - `db.ts`: Unified data access layer (Switches between Local/Cloud automatically).
- **`types.ts`**: TypeScript definitions.
