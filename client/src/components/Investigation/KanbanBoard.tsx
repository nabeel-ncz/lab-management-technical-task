import React, { useEffect, useState } from 'react';
import { Card, Typography, Spin } from 'antd';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Investigation, KanbanColumn } from '../../types';
import { InvestigationCard } from './InvestigationCard';
import { DroppableStatusContainer } from './DroppableStatusContainer';
import { DraggableInvestigationCard } from './DraggableInvestigationCard';
import { DropIndicator } from './DropIndicator';

const { Title, Text } = Typography;

interface KanbanBoardProps {
  columns: KanbanColumn[];
  loading: boolean;
  onCardClick: (investigation: Investigation) => void;
  onInvestigationMove?: (investigationId: string, newStatus: string, newIndex: number) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  columns, 
  loading, 
  onCardClick,
  onInvestigationMove
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [localColumns, setLocalColumns] = useState<KanbanColumn[]>(columns);
  const [dropIndicator, setDropIndicator] = useState<{columnId: string, index: number} | null>(null);

  // Update local state when props change
  useEffect(() => {
    setLocalColumns(columns);
  }, [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum distance to start dragging
      },
    })
  );

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const calculatePriorityStats = (investigations: Investigation[]) => {
    const stats = {
      Emergency: 0,
      High: 0,
      Normal: 0,
      total: investigations.length
    };

    investigations.forEach(inv => {
      if (inv.priority === 'Emergency') stats.Emergency++;
      else if (inv.priority === 'High') stats.High++;
      else if (inv.priority === 'Normal') stats.Normal++;
    });

    return stats;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Emergency': return '#ff4d4f';
      case 'High': return '#fa8c16'; 
      case 'Normal': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const findInvestigation = (id: string) => {
    for (const column of localColumns) {
      const investigation = column.investigations.find(inv => inv.id === id);
      if (investigation) {
        return { investigation, columnId: column.id };
      }
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setDropIndicator(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) {
      setDropIndicator(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active investigation and its current column
    const activeData = findInvestigation(activeId);
    if (!activeData) return;

    // Determine if we're dropping over a container or another item
    const isOverContainer = localColumns.some(column => column.id === overId);
    const overData = isOverContainer ? null : findInvestigation(overId);
    
    const targetColumnId = isOverContainer ? overId : overData?.columnId;
    if (!targetColumnId) {
      setDropIndicator(null);
      return;
    }

    const targetColumn = localColumns.find(col => col.id === targetColumnId);
    if (!targetColumn) {
      setDropIndicator(null);
      return;
    }

    // For empty columns, always show drop indicator at index 0
    let indicatorIndex = 0;
    
    if (targetColumn.investigations.length === 0) {
      // Empty column - always position at index 0
      indicatorIndex = 0;
    } else if (isOverContainer) {
      // Dropped on container with cards - position at end
      indicatorIndex = targetColumn.investigations.length;
    } else if (overData) {
      // Dropped on/near another card
      indicatorIndex = targetColumn.investigations.findIndex(inv => inv.id === overId);
      
      // If same column, adjust for the removed item
      if (activeData.columnId === targetColumnId) {
        const activeIndex = targetColumn.investigations.findIndex(inv => inv.id === activeId);
        if (activeIndex < indicatorIndex) {
          indicatorIndex -= 1;
        }
      }
    }

    // Always show drop indicator for valid drops
    setDropIndicator({ columnId: targetColumnId, index: indicatorIndex });

    // Only update columns if moving between different columns
    if (activeData.columnId !== targetColumnId) {
      setLocalColumns(prevColumns => {
        const newColumns = [...prevColumns];
        
        // Remove from source column
        const sourceColumnIndex = newColumns.findIndex(col => col.id === activeData.columnId);
        const sourceColumn = { ...newColumns[sourceColumnIndex] };
        sourceColumn.investigations = sourceColumn.investigations.filter(inv => inv.id !== activeId);
        sourceColumn.count = sourceColumn.investigations.length;
        sourceColumn.totalAmount = sourceColumn.investigations.reduce((sum, inv) => sum + inv.totalAmount, 0);
        newColumns[sourceColumnIndex] = sourceColumn;

        // Add to target column at the end (will be repositioned in handleDragEnd)
        const targetColumnIndex = newColumns.findIndex(col => col.id === targetColumnId);
        const targetColumn = { ...newColumns[targetColumnIndex] };
        const updatedInvestigation = {
          ...activeData.investigation,
          status: targetColumn.title as Investigation['status']
        };
        targetColumn.investigations = [...targetColumn.investigations, updatedInvestigation];
        targetColumn.count = targetColumn.investigations.length;
        targetColumn.totalAmount = targetColumn.investigations.reduce((sum, inv) => sum + inv.totalAmount, 0);
        newColumns[targetColumnIndex] = targetColumn;

        return newColumns;
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDropIndicator(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeData = findInvestigation(activeId);
    if (!activeData) return;

    // Determine target column and position
    const isOverContainer = localColumns.some(column => column.id === overId);
    const overData = isOverContainer ? null : findInvestigation(overId);
    const targetColumnId = isOverContainer ? overId : overData?.columnId;
    
    if (!targetColumnId) return;

    const targetColumn = localColumns.find(col => col.id === targetColumnId);
    if (!targetColumn) return;

    let newIndex = 0;

    if (isOverContainer) {
      // Dropped on empty container or at the end
      newIndex = targetColumn.investigations.length;
    } else if (overData) {
      // Dropped on/near another card
      newIndex = targetColumn.investigations.findIndex(inv => inv.id === overId);
      
      // If same column, adjust for the removed item
      if (activeData.columnId === targetColumnId) {
        const activeIndex = targetColumn.investigations.findIndex(inv => inv.id === activeId);
        if (activeIndex < newIndex) {
          newIndex -= 1;
        }
      }
    }

    // Ensure newIndex is valid
    newIndex = Math.max(0, Math.min(newIndex, targetColumn.investigations.length));

    // Update local state immediately for better UX
    if (activeData.columnId !== targetColumnId || activeId !== overId) {
      setLocalColumns(prevColumns => {
        const newColumns = [...prevColumns];
        
        // Remove from source column
        const sourceColumnIndex = newColumns.findIndex(col => col.id === activeData.columnId);
        const sourceColumn = { ...newColumns[sourceColumnIndex] };
        const removedInvestigation = sourceColumn.investigations.find(inv => inv.id === activeId);
        sourceColumn.investigations = sourceColumn.investigations.filter(inv => inv.id !== activeId);
        sourceColumn.count = sourceColumn.investigations.length;
        sourceColumn.totalAmount = sourceColumn.investigations.reduce((sum, inv) => sum + inv.totalAmount, 0);
        newColumns[sourceColumnIndex] = sourceColumn;

        // Add to target column at specific position
        const targetColumnIndex = newColumns.findIndex(col => col.id === targetColumnId);
        const targetColumn = { ...newColumns[targetColumnIndex] };
        
        if (removedInvestigation) {
          const updatedInvestigation = {
            ...removedInvestigation,
            status: targetColumn.title as Investigation['status']
          };
          
          // Insert at the correct position
          targetColumn.investigations.splice(newIndex, 0, updatedInvestigation);
          targetColumn.count = targetColumn.investigations.length;
          targetColumn.totalAmount = targetColumn.investigations.reduce((sum, inv) => sum + inv.totalAmount, 0);
          newColumns[targetColumnIndex] = targetColumn;
        }

        return newColumns;
      });
    }

    // Call the parent callback for API update
    if (onInvestigationMove) {
      onInvestigationMove(activeId, targetColumnId, newIndex);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  const activeInvestigation = activeId ? findInvestigation(activeId)?.investigation : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {localColumns.map((column) => (
          <DroppableStatusContainer key={column.id} column={column}>
            <Card 
              className="w-full border border-gray-200 rounded-xl shadow-sm"
              style={{ backgroundColor: 'white' }}
              bodyStyle={{ padding: 0 }}
            >
              {/* Row Header with Status Color */}
              <div 
                className="p-6 rounded-t-xl"
                style={{ backgroundColor: column.bgColor }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Title level={4} className="!text-white font-bold mt-2">
                      {column.title}
                    </Title>
                    <div className="w-8 h-8 bg-white/25 rounded-full flex items-center justify-center">
                      <Text className="text-white text-sm font-bold">{column.count}</Text>
                    </div>
                  </div>
                  <Text className="text-white text-base font-medium">
                    Amount to be billed: {formatCurrency(column.totalAmount)}
                  </Text>
                </div>
              </div>

              <div className="p-6 bg-gray-50 min-h-[200px]">
                <SortableContext 
                  items={column.investigations.map(inv => inv.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {column.investigations.length === 0 ? (
                    <div className="relative h-full min-h-[150px] w-full">
                      {dropIndicator?.columnId === column.id ? (
                        <div className="flex justify-center items-center h-full min-h-[150px]">
                          <DropIndicator isVisible={true} />
                        </div>
                      ) : (
                        <div 
                          className="text-center h-full min-h-[150px] flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
                          style={{
                            // Ensure proper boundaries for each empty column
                            margin: '0 8px',
                            padding: '24px 16px',
                          }}
                        >
                          <Text className="text-gray-400 text-base">No investigations in this status</Text>
                          <Text className="text-gray-300 text-sm mt-2">Drop cards here to move them to this status</Text>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex gap-3 sm:gap-6 overflow-x-auto pb-4 items-start min-h-[150px]">
                      {column.investigations.map((investigation, index) => (
                        <React.Fragment key={investigation.id}>
                          {dropIndicator?.columnId === column.id && dropIndicator.index === index && (
                            <DropIndicator isVisible={true} />
                          )}
                          <div className="flex-shrink-0">
                            <DraggableInvestigationCard
                              investigation={investigation}
                              onClick={onCardClick}
                            />
                          </div>
                        </React.Fragment>
                      ))}
                      {dropIndicator?.columnId === column.id && dropIndicator.index === column.investigations.length && (
                        <DropIndicator isVisible={true} />
                      )}
                    </div>
                  )}
                </SortableContext>
              </div>

              {/* Footer with priority breakdown */}
              <div className="px-6 py-4 bg-white border-t border-gray-200 rounded-b-xl">
                {(() => {
                  const priorityStats = calculatePriorityStats(column.investigations);
                  return (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                          {(['Emergency', 'High', 'Normal'] as const).map(priority => (
                            <div key={priority} className="flex items-center space-x-1">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getPriorityColor(priority) }}
                              />
                              <Text className="text-gray-700 text-sm">
                                {priority}: {priorityStats[priority]}
                              </Text>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Text className="text-gray-600 text-sm">Total:</Text>
                        <div className="px-3 py-1 bg-blue-100 rounded-full">
                          <Text className="text-blue-800 text-sm font-semibold">
                            {priorityStats.total} {priorityStats.total === 1 ? 'Request' : 'Requests'}
                          </Text>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </Card>
          </DroppableStatusContainer>
        ))}
      </div>

      <DragOverlay>
        {activeInvestigation ? (
          <div className="rotate-3 opacity-95 scale-105">
            <InvestigationCard
              investigation={activeInvestigation}
              onClick={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};