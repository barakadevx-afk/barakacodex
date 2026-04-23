# 🚀 Baraka Codex

**Online Coding Learning Platform** built with modern web technologies and powered by Supabase.

## Features

- 📚 **50+ Courses** - Web development, mobile, backend, DevOps
- 🎥 **200+ Tutorials** - Bite-sized learning content
- 🔐 **User Authentication** - Secure login with Supabase Auth
- 📊 **Progress Tracking** - Track your learning journey
- 🌙 **Dark Mode** - Eye-friendly theme switching
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Real-time Updates** - Live progress synchronization

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Build Tool:** Vite
- **Icons:** Font Awesome
- **Fonts:** Inter, Fira Code

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://poyzhoxnvbfumgtcklia.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_riXA6qvXzB6Bo3z8bJYRUg_D4E8fVWV
VITE_APP_NAME=Baraka Codex
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## Database Schema

### Tables Required in Supabase:

#### `courses`
```sql
create table courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  level text check (level in ('beginner', 'intermediate', 'advanced')),
  image_url text,
  lessons_count integer default 0,
  duration_hours integer default 0,
  rating decimal(2,1) default 5.0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

#### `enrollments`
```sql
create table enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  course_id uuid references courses not null,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, course_id)
);
```

#### `user_progress`
```sql
create table user_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  course_id uuid references courses not null,
  lesson_id text not null,
  completed boolean default false,
  completed_at timestamp with time zone,
  unique(user_id, course_id, lesson_id)
);
```

#### `newsletter_subscribers`
```sql
create table newsletter_subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  subscribed_at timestamp with time zone default timezone('utc'::text, now())
);
```

### Storage Buckets

- `avatars` - User profile images
- `course-images` - Course thumbnails
- `tutorial-images` - Tutorial images

## Supabase Integration

The project includes a complete Supabase client at `supabase.js` with helper functions:

### Authentication
```javascript
import { signUp, signIn, signOut, getCurrentUser } from './supabase.js'

// Sign up
const { data, error } = await signUp(email, password, { full_name: 'John' })

// Sign in
const { data, error } = await signIn(email, password)

// Get current user
const { user } = await getCurrentUser()
```

### Database Operations
```javascript
import { getCourses, enrollInCourse, getUserProgress } from './supabase.js'

// Get all courses
const { data: courses } = await getCourses()

// Enroll in course
await enrollInCourse(userId, courseId)

// Get user progress
const { data: progress } = await getUserProgress(userId)
```

### Real-time Subscriptions
```javascript
import { subscribeToUserProgress } from './supabase.js'

// Listen to progress updates
const subscription = subscribeToUserProgress(userId, (payload) => {
  console.log('Progress updated:', payload)
})
```

## Project Structure

```
frontend/
├── index.html              # Main HTML file
├── styles.css              # All styles
├── script.js               # Main JavaScript
├── supabase.js             # Supabase client & helpers
├── .env                    # Environment variables
├── package.json            # Dependencies
├── barakalogo.png          # Logo (add manually)
└── README.md               # This file
```

## Customization

### Change Brand Colors
Edit CSS variables in `styles.css`:

```css
:root {
  --primary: #6366f1;        /* Indigo */
  --secondary: #0ea5e9;      /* Sky Blue */
  --accent: #ec4899;         /* Pink */
  --success: #10b981;        /* Emerald */
}
```

### Update Logo
Replace `barakalogo.png` with your own logo. Recommended size: 512x512px with transparent background.

## Deployment

### Deploy to Netlify/Vercel

1. Push to GitHub
2. Connect to Netlify/Vercel
3. Add environment variables in dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## License

MIT License - Free for personal and commercial use.

---

**Happy Learning! 💻**
