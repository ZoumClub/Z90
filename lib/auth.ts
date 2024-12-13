import { supabase } from './supabase';

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Create admin profile if it doesn't exist
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: data.user.id,
        username: email,
        role: 'admin'
      })
      .select()
      .single();

    if (profileError) throw profileError;

    return {
      user: data.user,
      profile,
      session: data.session,
    };
  } catch (error) {
    console.error('Auth error:', error);
    throw error;
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { user, profile };
}

export function getSession() {
  return supabase.auth.getSession();
}