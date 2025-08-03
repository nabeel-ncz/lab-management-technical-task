import React from 'react';
import { Card, Tag, Avatar, Space, Typography } from 'antd';
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
      case 'Emergency': return 'red';
      case 'High': return 'orange';
      default: return 'blue';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New Requests': return 'blue';
      case 'In Progress': return 'purple';
      case 'Under Review': return 'cyan';
      case 'Approved': return 'green';
      case 'Revision required': return 'red';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <Card 
      className="mb-4 cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-200 rounded-lg"
      onClick={() => onClick(investigation)}
      size="small"
    >
      <div className="space-y-3">
        {/* Header with ID and Priority */}
        <div className="flex items-center justify-between">
          <Text className="font-semibold text-gray-900">{investigation.id}</Text>
          <Tag color={getPriorityColor(investigation.priority)} className="px-2 py-1 text-xs">
            {investigation.priority}
          </Tag>
        </div>

        {/* Test Name */}
        <div>
          <Text className="font-medium text-gray-800 text-sm">
            {investigation.tests?.[0]?.name || 'Test Name'}
          </Text>
          {investigation.tests && investigation.tests.length > 1 && (
            <Text className="text-gray-500 text-xs ml-1">
              +{investigation.tests.length - 1} more
            </Text>
          )}
        </div>

        {/* Patient Info */}
        <div className="flex items-center space-x-2">
          <Avatar size="small" icon={<UserOutlined />} className="bg-blue-100 text-blue-600" />
          <div className="flex-1 min-w-0">
            <Text className="text-xs font-medium text-gray-700 block truncate">
              {investigation.patient?.name || 'Patient Name'}
            </Text>
            <Text className="text-xs text-gray-500">
              {investigation.patient?.age}Y, {investigation.patient?.gender}
            </Text>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="flex items-center space-x-2">
          <Avatar size="small" icon={<TeamOutlined />} className="bg-green-100 text-green-600" />
          <div className="flex-1 min-w-0">
            <Text className="text-xs font-medium text-gray-700 block truncate">
              {investigation.doctor?.name || 'Doctor Name'}
            </Text>
            <Text className="text-xs text-gray-500">
              {investigation.doctor?.specialization}
            </Text>
          </div>
        </div>

        {/* Date and Amount */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <CalendarOutlined className="text-gray-400 text-xs" />
            <Text className="text-xs text-gray-500">
              {dayjs(investigation.createdAt).format('DD MMM')}
            </Text>
          </div>
          <Text className="font-semibold text-gray-900 text-sm">
            {formatCurrency(investigation.totalAmount)}
          </Text>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <Tag 
            color={getStatusColor(investigation.status)} 
            className="px-3 py-1 text-xs font-medium rounded-full border-0"
          >
            {investigation.status}
          </Tag>
        </div>
      </div>
    </Card>
  );
};