import React from 'react';
import { Button, Space, Avatar, Dropdown } from 'antd';
import { PlusOutlined, BellOutlined, UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

interface HeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNewInvestigation: () => void;
}

export const Header: React.FC<HeaderProps> = ({ collapsed, onToggleCollapse, onNewInvestigation }) => {
  const userMenuItems = [
    { key: 'profile', label: 'Profile' },
    { key: 'settings', label: 'Settings' },
    { key: 'logout', label: 'Logout' },
  ];

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-3 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={onToggleCollapse}
            className="text-gray-600 hover:text-gray-900 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Laboratory Management System</h1>
            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Comprehensive test request tracking and workflow management</p>
          </div>
        </div>
        
        <Space size="small" className="flex-shrink-0">
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={onNewInvestigation}
            className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 hidden sm:inline-flex"
          >
            New Investigation
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={onNewInvestigation}
            className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 sm:hidden"
            size="small"
          />
          
          <Button 
            type="text" 
            icon={<BellOutlined />} 
            className="text-gray-600 hover:text-gray-900"
            size="small"
          />
          
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Avatar 
              icon={<UserOutlined />} 
              className="bg-blue-600 cursor-pointer"
              size="small"
            />
          </Dropdown>
        </Space>
      </div>
    </div>
  );
};