import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { differenceInCalendarDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { User, Fuel, Baby } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import api from '@/services/api';

// Car Interface
interface Car {
  _id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  specifications: string[];
  image?: string;
}

// Prices for options and insurance
const optionPrices = {
  driver: 50,
  fuel: 30,
  infantSeat: 15,
};

const insurancePrices = {
  full: 40,
  basic: 25,
  none: 0,
};

const BookingPage: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for the date range picker
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // State for selected options
  const [options, setOptions] = useState({
    driver: false,
    fuel: false,
    infantSeat: false,
  });

  // State for selected insurance
  const [insurance, setInsurance] = useState<'full' | 'basic' | 'none'>('basic');
  
  // State for form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    country: '',
  });

  useEffect(() => {
    if (!carId) return;
    const fetchCarDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<Car>(`/cars/${carId}`);
        let car = response.data;
        if(!car.price) car = { ...car, price: 30 } //fallback temporary
        setCar(car);
      } catch (err) {
        setError('Failed to load car details. The car may not exist.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCarDetails();
  }, [carId]);

  // Calculate the number of rental days
  const numberOfDays = useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      // Add 1 to make the range inclusive
      return differenceInCalendarDays(dateRange.to, dateRange.from) + 1;
    }
    return 0;
  }, [dateRange]);

  // Calculate total price based on days and options
  const totalPrice = useMemo(() => {
    if (!car || numberOfDays <= 0) return 0;

    const pricePerDay = car.price;
    let optionsPricePerDay = 0;
    if (options.driver) optionsPricePerDay += optionPrices.driver;
    if (options.fuel) optionsPricePerDay += optionPrices.fuel;
    if (options.infantSeat) optionsPricePerDay += optionPrices.infantSeat;
    
    const insurancePricePerDay = insurancePrices[insurance];
    
    const totalDailyCost = pricePerDay + optionsPricePerDay + insurancePricePerDay;
    
    return totalDailyCost * numberOfDays;
  }, [car, options, insurance, numberOfDays]);

  const handleOptionChange = (option: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  if (isLoading) {
    return <div className="container mx-auto text-center py-20">Loading car details...</div>;
  }

  if (error) {
    return <div className="container mx-auto text-center py-20 text-red-500">{error}</div>;
  }

  if (!car) {
    return <div className="container mx-auto text-center py-20">No car details found.</div>;
  }

  return (
    <div className="container mx-auto max-w-7xl py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* Left Column (70%) */}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>Select your options and enter your information to complete the booking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Date Range Picker */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Rental Dates</h3>
                <DateRangePicker date={dateRange} onDateChange={setDateRange} />
              </div>

              <Separator />

              {/* Rental Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Rental Options (per day)</h3>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <User className="h-6 w-6 text-muted-foreground" />
                    <Label htmlFor="driver">Hire a Driver</Label>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">${optionPrices.driver}</span>
                    <Checkbox id="driver" checked={options.driver} onCheckedChange={() => handleOptionChange('driver')} />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Fuel className="h-6 w-6 text-muted-foreground" />
                    <Label htmlFor="fuel">Full Tank of Fuel</Label>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">${optionPrices.fuel}</span>
                    <Checkbox id="fuel" checked={options.fuel} onCheckedChange={() => handleOptionChange('fuel')} />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Baby className="h-6 w-6 text-muted-foreground" />
                    <Label htmlFor="infantSeat">Infant Seat</Label>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">${optionPrices.infantSeat}</span>
                    <Checkbox id="infantSeat" checked={options.infantSeat} onCheckedChange={() => handleOptionChange('infantSeat')} />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Insurance Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Insurance (per day)</h3>
                <RadioGroup value={insurance} onValueChange={(value) => setInsurance(value as any)}>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <Label htmlFor="full-insurance" className="flex-grow">Full Insurance</Label>
                    <span className="font-semibold mr-4">${insurancePrices.full}</span>
                    <RadioGroupItem value="full" id="full-insurance" />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <Label htmlFor="basic-insurance" className="flex-grow">Basic Insurance</Label>
                    <span className="font-semibold mr-4">${insurancePrices.basic}</span>
                    <RadioGroupItem value="basic" id="basic-insurance" />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <Label htmlFor="no-insurance" className="flex-grow">No Insurance</Label>
                    <span className="font-semibold mr-4">${insurancePrices.none}</span>
                    <RadioGroupItem value="none" id="no-insurance" />
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Personal Information Form */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" value={formData.firstName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" value={formData.lastName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" value={formData.phone} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john.doe@example.com" value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" placeholder="e.g. United States" value={formData.country} onChange={handleInputChange} />
                  </div>
                </div>
              </div>
              
              <Button size="lg" className="w-full" disabled={numberOfDays <= 0}>
                {numberOfDays > 0 ? `Book for ${numberOfDays} Days` : 'Please select a date range'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (30%) */}
        <div className="lg:col-span-3 space-y-8">
          {/* Car Info Card */}
          <Card className="overflow-hidden">
            <img src={car.image || 'https://via.placeholder.com/400x250.png/E0E0E0/000000?text=No+Image'} alt={`${car.brand} ${car.model}`} className="w-full h-48 object-cover" />
            <CardHeader>
              <CardTitle>{car.brand} {car.model}</CardTitle>
              <CardDescription>{car.year}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {car.specifications.map(spec => <li key={spec}>{spec}</li>)}
              </ul>
            </CardContent>
          </Card>

          {/* Price Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Price Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Base Price per Day</span>
                <span>${car.price.toFixed(2)}</span>
              </div>
              
              <Separator />

              <div className="flex justify-between">
                <span>Selected Days</span>
                <span>{numberOfDays}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total Price</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

