import { NextApiHandler } from 'next';
import { supabase } from '@/lib/supabase';

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { data, error } = await supabase
          .from('private_listings')
          .select(`
            *,
            brand:brands (
              id,
              name,
              logo_url
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        return res.status(200).json(data);
      } catch (error) {
        return res.status(500).json({ error: 'Error fetching private listings' });
      }

    case 'POST':
      try {
        const { data, error } = await supabase
          .from('private_listings')
          .insert([req.body])
          .select()
          .single();

        if (error) throw error;

        return res.status(201).json(data);
      } catch (error) {
        return res.status(500).json({ error: 'Error creating private listing' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;