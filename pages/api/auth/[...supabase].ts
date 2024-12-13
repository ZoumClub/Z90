import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextApiHandler } from 'next';
import { supabase } from '@/lib/supabase';

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;

  // Create authenticated Supabase Client
  const supabaseServerClient = createMiddlewareSupabaseClient({ req, res });

  switch (method) {
    case 'POST':
      try {
        const { email, password } = req.body;

        const { data, error } = await supabaseServerClient.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        return res.status(200).json(data);
      } catch (error) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

    case 'DELETE':
      try {
        const { error } = await supabaseServerClient.auth.signOut();
        if (error) throw error;

        return res.status(200).json({ message: 'Signed out successfully' });
      } catch (error) {
        return res.status(500).json({ error: 'Error signing out' });
      }

    default:
      res.setHeader('Allow', ['POST', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;