import { NextApiHandler } from 'next';
import { supabase } from '@/lib/supabase';

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        const { data, error } = await supabase
          .from('cars')
          .select(`
            *,
            brand:brands (
              id,
              name,
              logo_url
            ),
            images:car_images (
              id,
              image_url,
              display_order
            ),
            features:car_features (
              id,
              name,
              available
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Car not found' });

        return res.status(200).json(data);
      } catch (error) {
        return res.status(500).json({ error: 'Error fetching car' });
      }

    case 'PUT':
      try {
        const { data, error } = await supabase
          .from('cars')
          .update(req.body)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Car not found' });

        return res.status(200).json(data);
      } catch (error) {
        return res.status(500).json({ error: 'Error updating car' });
      }

    case 'DELETE':
      try {
        const { error } = await supabase
          .from('cars')
          .delete()
          .eq('id', id);

        if (error) throw error;

        return res.status(200).json({ message: 'Car deleted successfully' });
      } catch (error) {
        return res.status(500).json({ error: 'Error deleting car' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;