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
  const { setNodeRef, isOver, active } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      columnId: column.id,
      isEmpty: column.investigations.length === 0,
    }
  });

  const isDragging = active !== null;
  const isEmpty = column.investigations.length === 0;

  return (
    <div
      ref={setNodeRef}
      className={`w-full transition-all duration-200 relative ${
        isOver 
          ? 'ring-2 ring-blue-400 ring-opacity-75 rounded-xl shadow-lg z-10' 
          : isDragging && isEmpty 
            ? 'ring-1 ring-gray-300 ring-opacity-50 rounded-xl' 
            : ''
      }`}
      style={{
        // Ensure each column has proper boundaries
        minHeight: '200px',
        position: 'relative',
        zIndex: isOver ? 10 : 1,
      }}
    >
      {children}
    </div>
  );
}; 