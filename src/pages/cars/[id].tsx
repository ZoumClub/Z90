import { GetStaticPaths, GetStaticProps } from 'next';
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { CarOverview } from '@/components/car/CarOverview';
import { CarSummary } from '@/components/car/CarSummary';
import { CarFeatures } from '@/components/car/CarFeatures';
import { CarActions } from '@/components/car/CarActions';
import { supabase } from '@/lib/supabase';
import type { Car } from '@/lib/supabase';

interface CarDetailsPageProps {
  car: Car;
}

export default function CarDetailsPage({ car }: CarDetailsPageProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const allImages = [car.image, ...(car.images?.map(img => img.image_url) || [])];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Car Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              {car.year} {car.make} {car.model}
            </h1>
            <div className="mt-2 flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                car.condition === 'new' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {car.condition.charAt(0).toUpperCase() + car.condition.slice(1)}
              </span>
              {car.is_sold && (
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
                  Sold
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Images Section */}
            <div className="space-y-4">
              {allImages.map((imageUrl, index) => (
                <div 
                  key={index}
                  className="relative bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="relative h-[400px]">
                    <img
                      src={imageUrl}
                      alt={`${car.make} ${car.model} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {index === 0 && car.is_sold && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="bg-red-600 text-white px-16 py-6 rounded-full transform -rotate-45 font-bold text-5xl shadow-2xl border-4 border-white">
                          SOLD
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Video Section */}
              {car.video_url && (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Watch Video Tour
                  </h3>
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    {isVideoPlaying ? (
                      <video
                        src={car.video_url}
                        controls
                        autoPlay
                        className="w-full h-full"
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div 
                        className="absolute inset-0 bg-cover bg-center cursor-pointer group"
                        style={{ backgroundImage: `url(${car.image})` }}
                        onClick={() => setIsVideoPlaying(true)}
                      >
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 text-blue-600 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Price and Action */}
            <div className="lg:sticky lg:top-4">
              <CarActions
                price={car.price}
                savings={car.savings}
                isSold={car.is_sold}
                dealer={car.dealer!}
              />
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-8">
            <CarOverview
              mileage={car.mileage || 'N/A'}
              fuelType={car.fuel_type || 'N/A'}
              transmission={car.transmission || 'N/A'}
              autonomy={car.autonomy || 'N/A'}
              seats={car.seats || 5}
            />

            <CarSummary
              bodyType={car.body_type || 'N/A'}
              exteriorColor={car.exterior_color || 'N/A'}
              numberOfOwners={car.number_of_owners || 1}
              numberOfKeys={car.number_of_keys || 'N/A'}
              interiorColor={car.interior_color || 'N/A'}
              condition={car.condition.toUpperCase()}
            />

            <CarFeatures features={car.features} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: cars } = await supabase
    .from('cars')
    .select('id');

  const paths = cars?.map((car) => ({
    params: { id: car.id },
  })) || [];

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<CarDetailsPageProps> = async ({ params }) => {
  if (!params?.id) {
    return { notFound: true };
  }

  const { data: car, error } = await supabase
    .from('cars')
    .select(`
      *,
      brand:brands (
        id,
        name,
        logo_url
      ),
      dealer:dealers (
        id,
        name,
        shop_image,
        address,
        city,
        phone,
        whatsapp,
        id_number
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
    .eq('id', params.id)
    .single();

  if (error || !car) {
    return { notFound: true };
  }

  return {
    props: {
      car,
    },
    revalidate: 60,
  };
};