import React from 'react';
import { Card, Tag, Avatar, Typography } from 'antd';
import { UserOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons';
import { Investigation } from '../../types';
import dayjs from 'dayjs';

const { Text } = Typography;

interface InvestigationCardProps {
  investigation: Investigation;
  onClick: (investigation: Investigation) => void;
}

export const InvestigationCard: React.FC<InvestigationCardProps> = ({ investigation, onClick }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Emergency': return '#dc2626'; // red-600
      case 'High': return '#ea580c'; // orange-600
      case 'Normal': return '#16a34a'; // green-600
      default: return '#2563eb'; // blue-600
    }
  };

  const getPriorityTagColor = (priority: string) => {
    switch (priority) {
      case 'Emergency': return 'red';
      case 'High': return 'orange';
      case 'Normal': return 'green';
      default: return 'blue';
    }
  };

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'New Requests': return 'blue';
  //     case 'In Progress': return 'purple';
  //     case 'Under Review': return 'cyan';
  //     case 'Approved': return 'green';
  //     case 'Revision required': return 'red';
  //     default: return 'default';
  //   }
  // };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 rounded-xl"
      onClick={() => onClick(investigation)}
      size="small"
      style={{
        width: '280px',
        height: '320px',
        borderLeft: `4px solid ${getPriorityColor(investigation.priority)}`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
      }}
      bodyStyle={{
        padding: '20px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="flex flex-col h-full space-y-4">
        {/* Header with ID and Priority */}
        <div className="flex items-center justify-between">
          <Text className="font-bold text-gray-900 text-sm">MRN{investigation.id?.slice(-6)?.toUpperCase()}</Text>
          <Tag 
            color={getPriorityTagColor(investigation.priority)} 
            className="px-3 py-1 text-xs font-medium rounded-lg"
          >
            {investigation.priority}
          </Tag>
        </div>

        {/* Test Name */}
        <div className="flex-shrink-0">
          <Text className="font-semibold text-gray-800 text-sm line-clamp-2">
            {investigation.tests?.[0]?.name || 'Test Name'}
          </Text>
          {investigation.tests && investigation.tests.length > 1 && (
            <Text className="text-gray-500 text-xs mt-1">
              +{investigation.tests.length - 1} more tests
            </Text>
          )}
        </div>

        {/* Patient Info */}
        <div className="flex items-center space-x-3">
          <Avatar 
            size={32} 
            icon={<UserOutlined />} 
            className="bg-blue-50 text-blue-600 border border-blue-200" 
          />
          <div className="flex-1 min-w-0">
            <Text className="text-sm font-medium text-gray-700 block truncate">
              {investigation.patient?.name || 'Patient Name'}
            </Text>
            <Text className="text-xs text-gray-500">
              {investigation.patient?.age}Y, {investigation.patient?.gender}
            </Text>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="flex items-center space-x-3">
          <Avatar 
            size={32} 
            icon={<TeamOutlined />} 
            className="bg-green-50 text-green-600 border border-green-200" 
          />
          <div className="flex-1 min-w-0">
            <Text className="text-sm font-medium text-gray-700 block truncate">
              {investigation.doctor?.name || 'Doctor Name'}
            </Text>
            <Text className="text-xs text-gray-500 truncate">
              {investigation.doctor?.specialization}
            </Text>
          </div>
        </div>

        {/* Spacer to push footer to bottom */}
        <div className="flex-grow"></div>

        {/* Date and Amount */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <CalendarOutlined className="text-gray-400 text-sm" />
            <Text className="text-xs text-gray-500">
              {dayjs(investigation.createdAt).format('DD MMM YYYY')}
            </Text>
          </div>
          <Text className="font-bold text-gray-900 text-sm">
            {formatCurrency(investigation.totalAmount)}
          </Text>
        </div>
      </div>
    </Card>
  );
};