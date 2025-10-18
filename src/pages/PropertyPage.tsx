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
  const [showFilters, setShowFilters] = useState(true);
  
  const [transactionType, setTransactionType] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [district, setDistrict] = useState('all');
  const [rooms, setRooms] = useState('any');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [petsAllowed, setPetsAllowed] = useState('any');
  const [childrenAllowed, setChildrenAllowed] = useState('any');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currency, setCurrency] = useState('all');

  useEffect(() => {
    loadProperty();
  }, [id]);

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
    if (district !== 'all' && prop.district !== district) return false;
    if (rooms !== 'any' && prop.rooms !== Number(rooms)) return false;
    if (childrenAllowed !== 'any' && prop.children_allowed !== (childrenAllowed === 'yes')) return false;
    if (petsAllowed !== 'any' && prop.pets_allowed !== (petsAllowed === 'yes')) return false;
    if (currency !== 'all' && prop.currency !== currency) return false;
    if (minPrice && prop.price < Number(minPrice)) return false;
    if (maxPrice && prop.price > Number(maxPrice)) return false;
    if (amenities.length > 0) {
      const propAmenities = prop.amenities || [];
      if (!amenities.every(a => propAmenities.includes(a))) return false;
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
    </div>
  );
}