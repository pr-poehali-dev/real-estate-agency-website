import React from 'react';
import YerevanMapLeaflet from '@/components/YerevanMapLeaflet';
import Icon from '@/components/ui/icon';
import type { Property as ApiProperty } from '@/lib/api';

interface Property extends ApiProperty {
  id: number;
  created_at: string;
  updated_at: string;
}

interface MapSectionProps {
  properties: Property[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onPropertySelect: (property: Property) => void;
}

const MapSection: React.FC<MapSectionProps> = ({ properties, isExpanded, onToggleExpand, onPropertySelect }) => {
  return (
    <div className={`bg-gray-100 flex-shrink-0 border-b relative transition-all duration-300 z-0 ${isExpanded ? 'h-[60vh] md:h-[50vh]' : 'h-[200px] sm:h-[250px] md:h-[180px]'}`}>
      <YerevanMapLeaflet
        properties={properties}
        onPropertySelect={onPropertySelect}
        keepPopupsOpen={true}
        zoomPosition="topleft"
        openOnClick={true}
      />
      <button
        onClick={onToggleExpand}
        className="absolute top-3 right-3 md:top-4 md:right-4 z-[500] bg-white hover:bg-gray-50 text-gray-700 p-2 md:p-2.5 rounded-lg shadow-lg transition-all hover:shadow-xl"
        title={isExpanded ? 'Свернуть карту' : 'Развернуть карту'}
      >
        <Icon name={isExpanded ? 'Minimize2' : 'Maximize2'} size={18} className="md:w-5 md:h-5" />
      </button>
    </div>
  );
};

export default MapSection;