import YerevanMapLeaflet from "@/components/YerevanMapLeaflet";
import type { Property as ApiProperty } from "@/lib/api";

interface Property extends ApiProperty {
  id: number;
  created_at: string;
  updated_at: string;
}

interface PropertyMapProps {
  currentProperty: Property;
  filteredProperties: Property[];
  onPropertySelect: (property: Property) => void;
}

export default function PropertyMap({ currentProperty, filteredProperties, onPropertySelect }: PropertyMapProps) {
  if (filteredProperties.length === 0) {
    return null;
  }

  return (
    <div id="map-section" className="bg-white border-t border-gray-200">
      <div className="px-6 py-6">
        <h2 className="text-xl font-bold mb-4">Похожие объекты на карте</h2>
        <div className="h-[500px] rounded-xl overflow-hidden">
          <YerevanMapLeaflet
            properties={[currentProperty, ...filteredProperties.slice(0, 20)]}
            onPropertySelect={onPropertySelect}
            isPreview={false}
            openOnClick={true}
          />
        </div>
      </div>
    </div>
  );
}
