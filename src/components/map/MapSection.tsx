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
    <div className={`bg-gray-100 flex-shrink-0 border-b relative transition-all duration-300 ${isExpanded ? 'h-[50vh]' : 'h-[180px]'}`}>
      <YerevanMapLeaflet
        properties={properties}
        onPropertySelect={onPropertySelect}
        keepPopupsOpen={true}
        zoomPosition="topleft"
        openOnClick={true}
      />
      <button
        onClick={onToggleExpand}
        className="absolute top-4 right-4 z-[1000] bg-white hover:bg-gray-50 text-gray-700 p-2.5 rounded-lg shadow-lg transition-all hover:shadow-xl"
        title={isExpanded ? 'Свернуть карту' : 'Развернуть карту'}
      >
        <Icon name={isExpanded ? 'Minimize2' : 'Maximize2'} size={20} />
      </button>
    </div>
  );
};

export default MapSection;