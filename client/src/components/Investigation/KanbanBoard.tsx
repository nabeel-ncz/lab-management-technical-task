import React from 'react';
import { Card, Typography, Spin } from 'antd';
import { Investigation, KanbanColumn } from '../../types';
import { InvestigationCard } from './InvestigationCard';

const { Title, Text } = Typography;

interface KanbanBoardProps {
  columns: KanbanColumn[];
  loading: boolean;
  onCardClick: (investigation: Investigation) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ columns, loading, onCardClick }) => {
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-6">
      {columns.map((column) => (
        <div key={column.id} className="flex-shrink-0 w-80">
          <Card 
            className="h-full"
            style={{ backgroundColor: column.bgColor }}
            bodyStyle={{ padding: 0 }}
          >
            {/* Column Header */}
            <div className="p-4 border-b border-white/20">
              <div className="flex items-center justify-between mb-2">
                <Title level={5} className="text-white m-0 font-semibold">
                  {column.title}
                </Title>
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Text className="text-white text-xs font-bold">{column.count}</Text>
                </div>
              </div>
              <Text className="text-white/80 text-sm">
                Amount to be billed: {formatCurrency(column.totalAmount)}
              </Text>
            </div>

            {/* Column Body */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {column.investigations.length === 0 ? (
                <div className="text-center py-8">
                  <Text className="text-white/60">No investigations</Text>
                </div>
              ) : (
                column.investigations.map((investigation) => (
                  <InvestigationCard
                    key={investigation.id}
                    investigation={investigation}
                    onClick={onCardClick}
                  />
                ))
              )}
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};