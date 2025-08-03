import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { KanbanColumn } from '../../types';

interface DroppableStatusContainerProps {
  column: KanbanColumn;
  children: React.ReactNode;
}

export const DroppableStatusContainer: React.FC<DroppableStatusContainerProps> = ({
  column,
  children,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-full transition-all duration-200 ${
        isOver ? 'ring-2 ring-blue-400 ring-opacity-75 rounded-xl' : ''
      }`}
    >
      {children}
    </div>
  );
}; 