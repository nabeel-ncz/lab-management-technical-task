import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Investigation } from '../../types';
import { InvestigationCard } from './InvestigationCard';

interface DraggableInvestigationCardProps {
  investigation: Investigation;
  onClick: (investigation: Investigation) => void;
}

export const DraggableInvestigationCard: React.FC<DraggableInvestigationCardProps> = ({
  investigation,
  onClick,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: investigation.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex-shrink-0"
      {...attributes}
      {...listeners}
    >
      <InvestigationCard
        investigation={investigation}
        onClick={onClick}
      />
    </div>
  );
}; 