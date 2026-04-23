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

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (No build tools!)
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Supabase Client:** Loaded via CDN
- **Icons:** Font Awesome (CDN)
- **Fonts:** Inter, Fira Code (Google Fonts)

## Setup Instructions

### 🚀 Quick Start (No Build Required!)

Simply open `index.html` in your browser:

```bash
# Option 1: Direct open
open index.html

# Option 2: Use any static server (optional)
npx serve . -p 3000
```

### 2. Configure Supabase

Supabase credentials are already configured in `script.js`:

```javascript
const SUPABASE_URL = 'https://poyzhoxnvbfumgtcklia.supabase.co';
const SUPABASE_KEY = 'sb_publishable_riXA6qvXzB6Bo3z8bJYRUg_D4E8fVWV';
```

No environment variables needed! 🎉

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
├── styles.css              # All styles (3,257 lines)
├── script.js               # All JavaScript + Supabase
├── package.json            # Project info (no deps!)
├── barakalogo.png          # Logo
└── README.md               # This file
```

**Note:** No `node_modules/`, no build step, no bundler required!

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

### Deploy Anywhere (Static Hosting)

Since this is pure HTML/CSS/JS, you can deploy to ANY static host:

**Option 1: Netlify**
1. Drag & drop the `frontend/` folder
2. Done! ✅

**Option 2: Vercel**
```bash
npx vercel --prod
```

**Option 3: GitHub Pages**
1. Push to GitHub
2. Enable GitHub Pages in settings
3. Select `main` branch

**Option 4: Any Web Server**
Just upload these files:
- `index.html`
- `styles.css`
- `script.js`
- `barakalogo.png`

## License

MIT License - Free for personal and commercial use.

---

**Happy Learning! 💻**
