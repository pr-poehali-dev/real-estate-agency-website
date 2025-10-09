import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Properties } from "@/lib/api";
import type { Property as ApiProperty } from "@/lib/api";
import Header from "@/components/home/Header";
import SearchSection from "@/components/home/SearchSection";
import RecentlyAdded from "@/components/home/RecentlyAdded";
import MapPreview from "@/components/home/MapPreview";
import ContactSection from "@/components/home/ContactSection";
import Footer from "@/components/home/Footer";

interface Property extends ApiProperty {
  id: number;
  created_at: string;
  updated_at: string;
}

export default function Index() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionType, setTransactionType] = useState('rent');
  const [propertyType, setPropertyType] = useState('apartment');
  const [maxPrice, setMaxPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [currency, setCurrency] = useState('AMD');
  const [district, setDistrict] = useState('all');
  const [rooms, setRooms] = useState('any');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [petsAllowed, setPetsAllowed] = useState('any');
  const [childrenAllowed, setChildrenAllowed] = useState('any');
  const [streetSearch, setStreetSearch] = useState('');

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    
    const token = localStorage.getItem('admin_token');
    if (token && token.startsWith('demo-token-')) {
      const demoData = localStorage.getItem('demo_properties');
      const demoProps = demoData ? JSON.parse(demoData) : [];
      setProperties(demoProps.slice(0, 6));
      setLoading(false);
      return;
    }

    try {
      const response = await Properties.list();
      const props = (response.properties || []) as Property[];
      const sortedProps = props.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });
      setProperties(sortedProps.slice(0, 6));
    } catch (err) {
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const filters = {
      selectedTransaction: transactionType === 'rent' ? 'rent' : transactionType === 'sale' ? 'sale' : '',
      selectedType: propertyType === 'all' ? '' : propertyType,
      maxPrice: maxPrice,
      minPrice: minPrice,
      currency: currency,
      rooms: rooms === 'any' ? '' : rooms,
      amenities: amenities,
      petsAllowed: petsAllowed === 'any' ? '' : petsAllowed,
      childrenAllowed: childrenAllowed === 'any' ? '' : childrenAllowed,
      streetSearch: streetSearch
    };
    localStorage.setItem('map_filters', JSON.stringify(filters));
    navigate('/map');
  };

  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <Header />
      
      <SearchSection
        transactionType={transactionType}
        setTransactionType={setTransactionType}
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        district={district}
        setDistrict={setDistrict}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        currency={currency}
        setCurrency={setCurrency}
        rooms={rooms}
        amenities={amenities}
        petsAllowed={petsAllowed}
        childrenAllowed={childrenAllowed}
        streetSearch={streetSearch}
        onSearch={handleSearch}
      />

      <RecentlyAdded properties={properties} loading={loading} />
      
      <MapPreview />
      
      <ContactSection />
      
      <Footer />
    </div>
  );
}