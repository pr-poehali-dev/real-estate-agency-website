import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Properties } from "@/lib/api";
import type { Property as ApiProperty } from "@/lib/api";
import SEO from "@/components/SEO";
import PropertyHeader from "@/components/property/PropertyHeader";
import PropertyFilters from "@/components/property/PropertyFilters";
import PropertyDetails from "@/components/property/PropertyDetails";
import PropertyList from "@/components/property/PropertyList";
import PropertyMap from "@/components/property/PropertyMap";
import FloatingContactButtons from "@/components/FloatingContactButtons";

interface Property extends ApiProperty {
  id: number;
  created_at: string;
  updated_at: string;
}

export default function PropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const loadFiltersFromStorage = () => {
    try {
      const saved = localStorage.getItem('property_filters');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          showFilters: parsed.showFilters || false,
          transactionType: parsed.transactionType || 'all',
          propertyType: parsed.propertyType || 'all',
          district: parsed.district || '',
          rooms: parsed.rooms || 'any',
          amenities: parsed.amenities || '',
          petsAllowed: parsed.petsAllowed || '',
          childrenAllowed: parsed.childrenAllowed || '',
          minPrice: parsed.minPrice || '',
          maxPrice: parsed.maxPrice || '',
          currency: parsed.currency || 'AMD'
        };
      }
    } catch (e) {
      console.error('Failed to load filters:', e);
    }
    return {
      showFilters: false,
      transactionType: 'all',
      propertyType: 'all',
      district: '',
      rooms: 'any',
      amenities: '',
      petsAllowed: '',
      childrenAllowed: '',
      minPrice: '',
      maxPrice: '',
      currency: 'AMD'
    };
  };

  const savedFilters = loadFiltersFromStorage();
  const [showFilters, setShowFilters] = useState(savedFilters.showFilters);
  const [transactionType, setTransactionType] = useState(savedFilters.transactionType);
  const [propertyType, setPropertyType] = useState(savedFilters.propertyType);
  const [district, setDistrict] = useState<string>(savedFilters.district);
  const [rooms, setRooms] = useState(savedFilters.rooms);
  const [amenities, setAmenities] = useState<string>(savedFilters.amenities);
  const [petsAllowed, setPetsAllowed] = useState<string>(savedFilters.petsAllowed);
  const [childrenAllowed, setChildrenAllowed] = useState<string>(savedFilters.childrenAllowed);
  const [minPrice, setMinPrice] = useState(savedFilters.minPrice);
  const [maxPrice, setMaxPrice] = useState(savedFilters.maxPrice);
  const [currency, setCurrency] = useState(savedFilters.currency);

  useEffect(() => {
    loadProperty();
  }, [id]);

  useEffect(() => {
    const filters = {
      showFilters,
      transactionType,
      propertyType,
      district,
      rooms,
      amenities,
      petsAllowed,
      childrenAllowed,
      minPrice,
      maxPrice,
      currency
    };
    localStorage.setItem('property_filters', JSON.stringify(filters));
  }, [showFilters, transactionType, propertyType, district, rooms, amenities, petsAllowed, childrenAllowed, minPrice, maxPrice, currency]);

  const loadProperty = async () => {
    setLoading(true);
    
    const token = localStorage.getItem('admin_token');
    if (token && token.startsWith('demo-token-')) {
      const demoData = localStorage.getItem('demo_properties');
      const demoProps = demoData ? JSON.parse(demoData) : [];
      const propsWithDates = demoProps.map((p: any) => ({
        ...p,
        created_at: p.created_at || new Date().toISOString()
      }));
      const found = propsWithDates.find((p: Property) => p.id === Number(id));
      setProperty(found || null);
      setAllProperties(propsWithDates.filter((p: Property) => p.id !== Number(id)));
      setLoading(false);
      return;
    }

    try {
      const response = await Properties.list();
      const props = (response.properties || []) as Property[];
      const propsWithDates = props.map(p => ({
        ...p,
        created_at: p.created_at || new Date().toISOString()
      }));
      const found = propsWithDates.find(p => p.id === Number(id));
      setProperty(found || null);
      setAllProperties(propsWithDates.filter(p => p.id !== Number(id)));
    } catch (err) {
      console.error('Error loading property:', err);
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = allProperties.filter(prop => {
    if (transactionType !== 'all' && prop.transaction_type !== transactionType) return false;
    if (propertyType !== 'all' && prop.property_type !== propertyType) return false;
    if (district && district !== 'all' && prop.district !== district) return false;
    if (rooms !== 'any' && prop.rooms !== Number(rooms)) return false;
    
    if (childrenAllowed && childrenAllowed !== 'any') {
      if (prop.children_allowed !== childrenAllowed) return false;
    }
    
    if (petsAllowed && petsAllowed !== 'any') {
      if (prop.pets_allowed !== petsAllowed) return false;
    }
    if (currency !== 'all' && prop.currency !== currency) return false;
    if (minPrice && prop.price < Number(minPrice)) return false;
    if (maxPrice && prop.price > Number(maxPrice)) return false;
    if (amenities && amenities !== 'any') {
      const propAmenities = prop.amenities || [];
      if (!propAmenities.includes(amenities)) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Загрузка...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Объект не найден</h1>
          <Link to="/">
            <Button className="bg-[#FF7A00] hover:bg-[#E66D00] text-white">
              Вернуться на главную
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getTransactionText = (type: string) => {
    if (type === 'rent') return 'Аренда';
    if (type === 'daily') return 'Посуточная аренда';
    if (type === 'sale') return 'Продажа';
    return '';
  };

  const getPropertyImage = () => {
    if (property?.images && property.images.length > 0) {
      return property.images[0];
    }
    return 'https://cdn.poehali.dev/projects/73745f0c-4271-4bf6-a60b-4537cc7c5835/files/b583506d-b90c-4a00-9b99-500627769850.jpg';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title={`${property?.title || 'Объект'} - ${getTransactionText(property?.transaction_type || '')} в ${property?.district || 'Ереване'} - WSE.AM`}
        description={`${property?.description || ''} ${property?.rooms ? property.rooms + ' комн.' : ''} ${property?.area ? property.area + ' м²' : ''} в районе ${property?.district || 'Ереван'}.`}
        keywords={`${property?.transaction_type === 'rent' ? 'аренда' : property?.transaction_type === 'sale' ? 'продажа' : 'посуточная аренда'} ${property?.property_type || 'квартира'} ${property?.district || 'Ереван'}, ${property?.rooms || ''} комнатная квартира`}
        ogImage={getPropertyImage()}
        ogType="article"
      />
      <PropertyHeader 
        onBack={() => navigate(-1)}
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
      />

      {showFilters && (
        <PropertyFilters
          transactionType={transactionType}
          setTransactionType={setTransactionType}
          propertyType={propertyType}
          setPropertyType={setPropertyType}
          district={district}
          setDistrict={setDistrict}
          rooms={rooms}
          setRooms={setRooms}
          amenities={amenities}
          setAmenities={setAmenities}
          childrenAllowed={childrenAllowed}
          setChildrenAllowed={setChildrenAllowed}
          petsAllowed={petsAllowed}
          setPetsAllowed={setPetsAllowed}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          currency={currency}
          setCurrency={setCurrency}
        />
      )}

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <PropertyDetails property={property} />
        <PropertyList properties={filteredProperties} />
      </div>

      <PropertyMap
        currentProperty={property}
        filteredProperties={filteredProperties}
        onPropertySelect={(selected) => {
          if (selected.id !== property.id) {
            navigate(`/property/${selected.id}`);
          }
        }}
      />
      
      <FloatingContactButtons 
        phoneNumber={property.phone}
        whatsappNumber={property.phone}
      />
    </div>
  );
}