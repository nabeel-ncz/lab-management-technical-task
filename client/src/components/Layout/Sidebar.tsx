import React from 'react';
import { Menu, Tooltip } from 'antd';
import { 
  DashboardOutlined, 
  UserOutlined, 
  TeamOutlined, 
  ExperimentOutlined,
  FileTextOutlined,
  SettingOutlined 
} from '@ant-design/icons';

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const menuItems = [
    {
      key: 'dashboard',
      icon: (
        <Tooltip title="Dashboard" placement="right">
          <DashboardOutlined />
        </Tooltip>
      ),
      label: 'Dashboard',
      disabled: true,
    },
    {
      key: 'investigations',
      icon: (
        <Tooltip title="Investigations" placement="right">
          <FileTextOutlined />
        </Tooltip>
      ),
      label: 'Investigations',
      disabled: false,
    },
    {
      key: 'patients',
      icon: (
        <Tooltip title="Patients" placement="right">
          <UserOutlined />
        </Tooltip>
      ),
      label: 'Patients',
      disabled: true,
    },
    {
      key: 'doctors',
      icon: (
        <Tooltip title="Doctors" placement="right">
          <TeamOutlined />
        </Tooltip>
      ),
      label: 'Doctors',
      disabled: true,
    },
    {
      key: 'tests',
      icon: (
        <Tooltip title="Lab Tests" placement="right">
          <ExperimentOutlined />
        </Tooltip>
      ),
      label: 'Lab Tests',
      disabled: true,
    },
    {
      key: 'settings',
      icon: (
        <Tooltip title="Settings" placement="right">
          <SettingOutlined />
        </Tooltip>
      ),
      label: 'Settings',
      disabled: true,
    },
  ];

  return (
    <div className="bg-white shadow-sm transition-all duration-300 w-20">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-center">
          <Tooltip title="Laboratory Management System" placement="right">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ExperimentOutlined className="text-white text-lg" />
            </div>
          </Tooltip>
        </div>
      </div>
      
      <Menu
        mode="inline"
        defaultSelectedKeys={['investigations']}
        items={menuItems}
        className="border-none h-full"
        inlineCollapsed={true}
      />
    </div>
  );
};