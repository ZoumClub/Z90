// Update the CarFormProps interface to include defaultDealerId
interface CarFormProps {
  brands: Brand[];
  dealers: Dealer[];
  initialData?: Car;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  defaultDealerId?: string;
}

// Update the useState call to use defaultDealerId if provided
const [formData, setFormData] = useState<Partial<Car>>(initialData || {
  brand_id: '',
  dealer_id: defaultDealerId || '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  price: undefined,
  image: '',
  condition: 'new',
  mileage: '',
  fuel_type: 'Petrol',
  transmission: 'Automatic',
  body_type: 'Sedan',
  exterior_color: 'Black',
  interior_color: 'Black',
  savings: 0,
  is_sold: false
});