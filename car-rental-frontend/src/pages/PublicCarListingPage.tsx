import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Car as CarIcon, GaugeCircle, Users } from 'lucide-react';
import api from '@/services/api';

// Car Interface matching backend schema
interface Car {
  _id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  specifications: string[];
  totalKilometers: number;
  image?: string;
}

const PublicCarListingPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for the slider values
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    const fetchAvailableCars = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/cars');
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching available cars:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableCars();
  }, []);

  // Calculate the absolute min and max price from the car data
  const priceBounds = useMemo<[number, number]>(() => {
    if (cars.length === 0) {
      return [0, 1000]; // Default range if no cars are loaded
    }
    const prices = cars.map(car => car.price || 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return [min, max];
  }, [cars]);

  // When car data is loaded, update the slider's range and set the thumbs to the full range
  useEffect(() => {
    setPriceRange(priceBounds);
  }, [priceBounds]);

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const carPrice = car.price || 0;
      const [min, max] = priceRange;
      
      const matchesSearch = searchTerm
        ? car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.model.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      
      const matchesPrice = carPrice >= min && carPrice <= max;
      
      return matchesSearch && matchesPrice;
    });
  }, [cars, searchTerm, priceRange]);

  return (
    <div className="bg-background min-h-screen">
      <header className="text-center py-10 bg-card border-b">
        <h1 className="text-4xl font-bold">Available Cars</h1>
        <p className="text-muted-foreground mt-2">Browse our selection of cars currently available for rent.</p>
      </header>

      {/* Filter Section */}
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg bg-card border">
          <div className="space-y-2">
            <Label htmlFor="search">Search by Brand or Model</Label>
            <Input
              id="search"
              placeholder="e.g., Toyota Camry"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Price Range ($)</Label>
            <Slider
              min={priceBounds[0]}
              max={priceBounds[1]}
              step={1}
              value={priceRange}
              onValueChange={(newRange) => setPriceRange(newRange as [number, number])}
              className="mt-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto pb-10 px-4">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading cars...</p>
        ) : (
          <>
            {filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCars.map((car) => (
                  <Card key={car._id} className="group overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                    <div className="overflow-hidden">
                      <img
                        src={car.image || 'https://via.placeholder.com/400x250.png/E0E0E0/000000?text=No+Image'}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl tracking-tight">{car.brand} {car.model}</CardTitle>
                      <CardDescription>{car.year}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-grow">
                      <div className="text-3xl font-bold text-primary">${car.price}<span className="text-sm font-normal text-muted-foreground">/day</span></div>
                      <Separator />
                      <div className="flex justify-around text-muted-foreground text-sm">
                        <div className="flex items-center gap-2">
                          <GaugeCircle className="h-4 w-4" />
                          <span>{car.totalKilometers.toLocaleString()} km</span>
                        </div>
                        {car.specifications.find(s => s.toLowerCase().includes('seat')) && (
                           <div className="flex items-center gap-2">
                             <Users className="h-4 w-4" />
                             <span>{car.specifications.find(s => s.toLowerCase().includes('seat'))}</span>
                           </div>
                        )}
                        {car.specifications.find(s => !s.toLowerCase().includes('seat')) && (
                           <div className="flex items-center gap-2">
                            <CarIcon className="h-4 w-4" />
                            <span>{car.specifications.find(s => !s.toLowerCase().includes('seat'))}</span>
                           </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link to={`/book/${car._id}`}>Book Now</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-semibold">No Cars Found</h2>
                <p className="text-muted-foreground mt-2">
                  No cars matched your current search and filter criteria. Try adjusting your filters.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default PublicCarListingPage;
