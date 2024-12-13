import { Shield, ThumbsUp, PiggyBank } from 'lucide-react';

export function WhyChooseUs() {
  const benefits = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: 'Trusted Dealers',
      description: 'All our dealers are vetted and reviewed for quality service',
    },
    {
      icon: <ThumbsUp className="h-8 w-8 text-blue-600" />,
      title: 'Best Prices',
      description: 'Compare prices from multiple dealers to get the best deal',
    },
    {
      icon: <PiggyBank className="h-8 w-8 text-blue-600" />,
      title: 'Save Money',
      description: 'Average savings of £3,600 on new cars through our platform',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose CarCompare?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full">
                {benefit.icon}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                {benefit.title}
              </h3>
              <p className="mt-2 text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}