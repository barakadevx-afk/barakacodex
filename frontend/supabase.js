// ========================================
// Supabase Client Configuration
// Baraka Codex - Online Learning Platform
// ========================================

import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Validate configuration
if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase configuration missing. Check your .env file.')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})

// ========================================
// Auth Helpers
// ========================================

export async function signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: metadata
        }
    })
    return { data, error }
}

export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    return { data, error }
}

export async function signInWithProvider(provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider // 'github', 'google', etc.
    })
    return { data, error }
}

export async function signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
}

export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
}

export async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
}

// ========================================
// Database Helpers
// ========================================

// Courses
export async function getCourses() {
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })
    return { data, error }
}

export async function getCourseById(id) {
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single()
    return { data, error }
}

// User Progress
export async function getUserProgress(userId) {
    const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
    return { data, error }
}

export async function updateProgress(userId, courseId, lessonId, completed) {
    const { data, error } = await supabase
        .from('user_progress')
        .upsert({
            user_id: userId,
            course_id: courseId,
            lesson_id: lessonId,
            completed,
            completed_at: completed ? new Date().toISOString() : null
        })
    return { data, error }
}

// Enrollments
export async function enrollInCourse(userId, courseId) {
    const { data, error } = await supabase
        .from('enrollments')
        .insert({
            user_id: userId,
            course_id: courseId,
            enrolled_at: new Date().toISOString()
        })
    return { data, error }
}

export async function getUserEnrollments(userId) {
    const { data, error } = await supabase
        .from('enrollments')
        .select(`
            *,
            courses (*)
        `)
        .eq('user_id', userId)
    return { data, error }
}

// Newsletter Subscriptions
export async function subscribeToNewsletter(email) {
    const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email, subscribed_at: new Date().toISOString() })
    return { data, error }
}

// ========================================
// Real-time Subscriptions
// ========================================

export function subscribeToCourseUpdates(courseId, callback) {
    return supabase
        .channel(`course:${courseId}`)
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'courses',
            filter: `id=eq.${courseId}`
        }, callback)
        .subscribe()
}

export function subscribeToUserProgress(userId, callback) {
    return supabase
        .channel(`user_progress:${userId}`)
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'user_progress',
            filter: `user_id=eq.${userId}`
        }, callback)
        .subscribe()
}

// ========================================
// Storage Helpers
// ========================================

export async function uploadAvatar(file, userId) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)
    
    if (error) return { data: null, error }
    
    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)
    
    return { data: publicUrl, error: null }
}

// ========================================
// Initialize Auth State
// ========================================

export async function initializeAuth() {
    const { session, error } = await getSession()
    
    if (error) {
        console.error('❌ Auth initialization error:', error)
        return null
    }
    
    if (session) {
        console.log('✅ User authenticated:', session.user.email)
        return session.user
    }
    
    return null
}

// Auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔄 Auth state changed:', event)
    
    switch (event) {
        case 'SIGNED_IN':
            console.log('✅ User signed in:', session.user.email)
            break
        case 'SIGNED_OUT':
            console.log('👋 User signed out')
            break
        case 'USER_UPDATED':
            console.log('📝 User updated:', session.user.email)
            break
    }
})

export default supabase
