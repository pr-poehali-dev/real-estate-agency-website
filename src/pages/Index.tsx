import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Properties } from "@/lib/api";
import type { Property as ApiProperty } from "@/lib/api";
import SEO from "@/components/SEO";
import Header from "@/components/home/Header";
import SearchSection from "@/components/home/SearchSection";
import RecentlyAdded from "@/components/home/RecentlyAdded";
import AboutSection from "@/components/home/AboutSection";
import MapPreview from "@/components/home/MapPreview";
import ContactSection from "@/components/home/ContactSection";
import Footer from "@/components/home/Footer";
import FloatingContactButtons from "@/components/FloatingContactButtons";

interface Property extends ApiProperty {
  id: number;
  created_at: string;
  updated_at: string;
}

export default function Index() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionType, setTransactionType] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [currency, setCurrency] = useState('AMD');
  const [district, setDistrict] = useState<string>('all');

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);

    try {
      const response = await Properties.list();
      const props = (response.properties || []) as Property[];
      const sortedProps = props.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        if (dateB !== dateA) return dateB - dateA;
        return b.id - a.id;
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
      selectedTransaction: transactionType === 'all' ? '' : transactionType,
      selectedType: propertyType === 'all' ? '' : propertyType,
      selectedDistrict: district === 'all' ? [] : [district],
      minPrice: minPrice,
      maxPrice: '',
      currency: currency,
      rooms: '',
      amenities: '',
      petsAllowed: '',
      childrenAllowed: '',
      streetSearch: ''
    };
    localStorage.setItem('map_filters', JSON.stringify(filters));
    navigate('/map');
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO />
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
        currency={currency}
        setCurrency={setCurrency}
        onSearch={handleSearch}
      />

      <RecentlyAdded properties={properties} loading={loading} />
      
      <AboutSection />
      
      <MapPreview />
      
      <ContactSection />
      
      <Footer />
      
      <FloatingContactButtons />
    </div>
  );
}