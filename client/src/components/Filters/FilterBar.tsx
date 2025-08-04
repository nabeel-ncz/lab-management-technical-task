import React from 'react';
import { DatePicker, Select, Button, Input } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
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
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 w-full sm:w-auto">
          <span className="text-sm font-medium text-gray-700 mb-1 sm:mb-0">Date Range:</span>
          <RangePicker
            onChange={onDateRangeChange}
            format="DD/MM/YYYY"
            placeholder={['Start Date', 'End Date']}
            className="w-full sm:w-auto"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 w-full sm:w-auto">
          <span className="text-sm font-medium text-gray-700 mb-1 sm:mb-0">Status Filter:</span>
          <Select
            mode="multiple"
            placeholder="All statuses"
            style={{ minWidth: 200 }}
            className="w-full sm:w-auto"
            onChange={onStatusFilter}
            options={statusOptions}
            maxTagCount="responsive"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 w-full sm:w-auto">
          <span className="text-sm font-medium text-gray-700 mb-1 sm:mb-0">Priority:</span>
          <Select
            mode="multiple"
            placeholder="All priorities"
            style={{ minWidth: 150 }}
            className="w-full sm:w-auto"
            onChange={onPriorityFilter}
            options={priorityOptions}
            maxTagCount="responsive"
          />
        </div>

        <Input
          placeholder="Search investigations..."
          prefix={<SearchOutlined />}
          className="w-full sm:w-auto sm:min-w-[200px] sm:max-w-[250px]"
          onChange={(e) => onSearch(e.target.value)}
          allowClear
        />

        <Button 
          icon={<ReloadOutlined />} 
          onClick={onRefresh}
          type="text"
          className="text-gray-600 hover:text-gray-900 w-full sm:w-auto"
        >
          Refresh
        </Button>
      </div>
    </div>
  );
};