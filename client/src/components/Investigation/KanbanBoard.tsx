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
    <div className="space-y-6">
      {columns.map((column) => (
        <div key={column.id} className="w-full">
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
                  <Title level={4} className="!text-white font-bold">
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

            <div className="p-6 bg-gray-50">
              {column.investigations.length === 0 ? (
                <div className="text-center py-12">
                  <Text className="text-gray-400 text-base">No investigations in this status</Text>
                </div>
              ) : (
                <div className="flex gap-6 overflow-x-auto pb-4">
                  {column.investigations.map((investigation) => (
                    <div key={investigation.id} className="flex-shrink-0">
                      <InvestigationCard
                        investigation={investigation}
                        onClick={onCardClick}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};