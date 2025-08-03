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
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={onToggleCollapse}
            className="text-gray-600 hover:text-gray-900"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Laboratory Management System</h1>
            <p className="text-sm text-gray-500">Comprehensive test request tracking and workflow management</p>
          </div>
        </div>
        
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={onNewInvestigation}
            className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
          >
            New Investigation
          </Button>
          
          <Button 
            type="text" 
            icon={<BellOutlined />} 
            className="text-gray-600 hover:text-gray-900"
          />
          
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Avatar 
              icon={<UserOutlined />} 
              className="bg-blue-600 cursor-pointer"
            />
          </Dropdown>
        </Space>
      </div>
    </div>
  );
};