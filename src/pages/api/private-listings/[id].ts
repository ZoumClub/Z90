import { NextApiHandler } from 'next';
import { supabase } from '@/lib/supabase';

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  const { id } = req.query;

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
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Listing not found' });

        return res.status(200).json(data);
      } catch (error) {
        return res.status(500).json({ error: 'Error fetching listing' });
      }

    case 'PUT':
      try {
        const { status } = req.body;

        if (status === 'approved' || status === 'rejected') {
          const { data, error } = await supabase.rpc('process_private_listing', {
            p_listing_id: id,
            p_status: status
          });

          if (error) throw error;
          return res.status(200).json(data);
        }

        const { data, error } = await supabase
          .from('private_listings')
          .update(req.body)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Listing not found' });

        return res.status(200).json(data);
      } catch (error) {
        return res.status(500).json({ error: 'Error updating listing' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;