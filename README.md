# The Smart Box - Inventory Management System

## Environment Setup

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Getting Started

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd the-smart-box
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables
   - Create a `.env` file at the root of the project
   - Copy the contents from `.env.example`
   - Update the values with your Supabase credentials:
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

   You can find these credentials in your Supabase project dashboard under Project Settings > API.

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

### Building for Production

1. Ensure your environment variables are properly set
2. Build the project
   ```bash
   npm run build
   # or
   yarn build
   ```

3. Start the production server
   ```bash
   npm start
   # or
   yarn start
   ```

## Dependencies

- Next.js - React framework
- Tailwind CSS - Styling
- Supabase - Authentication and database
- React Hook Form - Form handling
- Zod - Form validation

## Project Structure

- `/app` - Next.js pages and routes
- `/components` - Reusable UI components
- `/lib` - Utility functions and shared logic
- `/hooks` - Custom React hooks
- `/data` - Data models and fixtures
