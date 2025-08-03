import React from 'react';
import { Space, DatePicker, Select, Button, Input } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface FilterBarProps {
  onDateRangeChange: (dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => void;
  onStatusFilter: (statuses: string[]) => void;
  onPriorityFilter: (priorities: string[]) => void;
  onSearch: (searchTerm: string) => void;
  onRefresh: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onDateRangeChange,
  onStatusFilter,
  onPriorityFilter,
  onSearch,
  onRefresh
}) => {
  const statusOptions = [
    { label: 'Advised', value: 'Advised' },
    { label: 'Billing', value: 'Billing' },
    { label: 'New Investigations', value: 'New Investigations' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Under Review', value: 'Under Review' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Revision Required', value: 'Revision Required' },
  ];

  const priorityOptions = [
    { label: 'Emergency', value: 'Emergency' },
    { label: 'High', value: 'High' },
    { label: 'Normal', value: 'Normal' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Date Range:</span>
          <RangePicker
            onChange={onDateRangeChange}
            format="DD/MM/YYYY"
            placeholder={['Start Date', 'End Date']}
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Status Filter:</span>
          <Select
            mode="multiple"
            placeholder="All statuses"
            style={{ minWidth: 200 }}
            onChange={onStatusFilter}
            options={statusOptions}
            maxTagCount="responsive"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Priority:</span>
          <Select
            mode="multiple"
            placeholder="All priorities"
            style={{ minWidth: 150 }}
            onChange={onPriorityFilter}
            options={priorityOptions}
            maxTagCount="responsive"
          />
        </div>

        <Input
          placeholder="Search investigations..."
          prefix={<SearchOutlined />}
          style={{ width: 250 }}
          onChange={(e) => onSearch(e.target.value)}
          allowClear
        />

        <Button 
          icon={<ReloadOutlined />} 
          onClick={onRefresh}
          type="text"
          className="text-gray-600 hover:text-gray-900"
        >
          Refresh
        </Button>
      </div>
    </div>
  );
};