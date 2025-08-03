import React, { useState, useEffect } from 'react';
import { Layout, notification } from 'antd';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { KanbanBoard } from './components/Investigation/KanbanBoard';
import { InvestigationModal } from './components/Investigation/InvestigationModal';
import { InvestigationForm } from './components/Forms/InvestigationForm';
import { PatientForm } from './components/Forms/PatientForm';
import { DoctorForm } from './components/Forms/DoctorForm';
import { TestForm } from './components/Forms/TestForm';
import { FilterBar } from './components/Filters/FilterBar';
import { Investigation, KanbanColumn } from './types';
import { InvestigationFormData, PatientFormData, DoctorFormData, TestFormData } from './schemas';
import { api } from './api/mockApi';
import dayjs from 'dayjs';

const { Content, Sider } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(true);
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [filteredInvestigations, setFilteredInvestigations] = useState<Investigation[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [investigationModalVisible, setInvestigationModalVisible] = useState(false);
  const [selectedInvestigation, setSelectedInvestigation] = useState<Investigation | null>(null);
  const [investigationFormVisible, setInvestigationFormVisible] = useState(false);
  const [patientFormVisible, setPatientFormVisible] = useState(false);
  const [doctorFormVisible, setDoctorFormVisible] = useState(false);
  const [testFormVisible, setTestFormVisible] = useState(false);

  // Load investigations on component mount
  useEffect(() => {
    loadInvestigations();
  }, []);

  // Update filtered investigations when investigations change
  useEffect(() => {
    setFilteredInvestigations(investigations);
  }, [investigations]);

  const loadInvestigations = async () => {
    setLoading(true);
    try {
      const data = await api.getInvestigations();
      setInvestigations(data);
    } catch {
      notification.error({
        message: 'Error',
        description: 'Failed to load investigations'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (investigation: Investigation) => {
    setSelectedInvestigation(investigation);
    setInvestigationModalVisible(true);
  };

  const handleInvestigationUpdate = async (id: string, updates: Partial<Investigation>) => {
    try {
      const updatedInvestigation = await api.updateInvestigation(id, updates);
      setInvestigations(prev =>
        prev.map(inv => inv.id === id ? updatedInvestigation : inv)
      );
      setInvestigationModalVisible(false);
      notification.success({
        message: 'Success',
        description: 'Investigation updated successfully'
      });
    } catch {
      notification.error({
        message: 'Error',
        description: 'Failed to update investigation'
      });
    }
  };

  const handleInvestigationMove = async (investigationId: string, newStatus: string, newIndex: number) => {
    try {
      const updatedInvestigation = await api.moveInvestigation(investigationId, newStatus, newIndex);
      setInvestigations(prev =>
        prev.map(inv => inv.id === investigationId ? updatedInvestigation : inv)
      );
      notification.success({
        message: 'Investigation Moved',
        description: 'Investigation status updated successfully',
        duration: 2
      });
    } catch {
      notification.error({
        message: 'Move Failed',
        description: 'Failed to update investigation status'
      });
      // Reload investigations to reset state on error
      loadInvestigations();
    }
  };

  const handleCreateInvestigation = async (data: InvestigationFormData) => {
    try {
      const newInvestigation = await api.createInvestigation({
        ...data,
        status: 'New Investigations',
        notes: data.notes || ''
      });
      setInvestigations(prev => [...prev, newInvestigation]);
      setInvestigationFormVisible(false);
      notification.success({
        message: 'Success',
        description: 'Investigation created successfully'
      });
    } catch {
      notification.error({
        message: 'Error',
        description: 'Failed to create investigation'
      });
    }
  };

  const handleCreatePatient = async (data: PatientFormData) => {
    try {
      await api.createPatient(data);
      setPatientFormVisible(false);
      notification.success({
        message: 'Success',
        description: 'Patient added successfully'
      });
    } catch {
      notification.error({
        message: 'Error',
        description: 'Failed to add patient'
      });
    }
  };

  const handleCreateDoctor = async (data: DoctorFormData) => {
    try {
      await api.createDoctor(data);
      setDoctorFormVisible(false);
      notification.success({
        message: 'Success',
        description: 'Doctor added successfully'
      });
    } catch {
      notification.error({
        message: 'Error',
        description: 'Failed to add doctor'
      });
    }
  };

  const handleCreateTest = async (data: TestFormData) => {
    try {
      await api.createTest(data);
      setTestFormVisible(false);
      notification.success({
        message: 'Success',
        description: 'Test added successfully'
      });
    } catch {
      notification.error({
        message: 'Error',
        description: 'Failed to add test'
      });
    }
  };

  // Filter functions
  const handleDateRangeChange = (dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
    if (!dates) {
      setFilteredInvestigations(investigations);
      return;
    }

    const [start, end] = dates;
    const filtered = investigations.filter(inv => {
      const createdDate = dayjs(inv.createdAt);
      return createdDate.isAfter(start.startOf('day')) && createdDate.isBefore(end.endOf('day'));
    });
    setFilteredInvestigations(filtered);
  };

  const handleStatusFilter = (statuses: string[]) => {
    if (statuses.length === 0) {
      setFilteredInvestigations(investigations);
      return;
    }

    const filtered = investigations.filter(inv => statuses.includes(inv.status));
    setFilteredInvestigations(filtered);
  };

  const handlePriorityFilter = (priorities: string[]) => {
    if (priorities.length === 0) {
      setFilteredInvestigations(investigations);
      return;
    }

    const filtered = investigations.filter(inv => priorities.includes(inv.priority));
    setFilteredInvestigations(filtered);
  };

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredInvestigations(investigations);
      return;
    }

    const filtered = investigations.filter(inv =>
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.doctor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.tests?.some(test => test.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredInvestigations(filtered);
  };

  // Create Kanban columns
  const createKanbanColumns = (): KanbanColumn[] => {
    const statusConfig = [
      { id: 'advised', title: 'Advised', color: '#faad14', bgColor: '#FFA500' },
      { id: 'billing', title: 'Billing', color: '#fa8c16', bgColor: '#FF8C42' },
      { id: 'new-investigations', title: 'New Investigations', color: '#1890ff', bgColor: '#6495ED' },
      { id: 'in-progress', title: 'In Progress', color: '#722ed1', bgColor: '#9370DB' },
      { id: 'under-review', title: 'Under Review', color: '#13c2c2', bgColor: '#20B2AA' },
      { id: 'approved', title: 'Approved', color: '#52c41a', bgColor: '#32CD32' },
      { id: 'revision-required', title: 'Revision Required', color: '#f5222d', bgColor: '#FF6B6B' }
    ];

    return statusConfig.map(config => {
      const statusInvestigations = filteredInvestigations
        .filter(inv => inv.status === config.title)
        .sort((a, b) => a.order - b.order); // Sort by order field
      
      return {
        ...config,
        investigations: statusInvestigations,
        count: statusInvestigations.length,
        totalAmount: statusInvestigations.reduce((sum, inv) => sum + inv.totalAmount, 0)
      };
    });
  };

  const kanbanColumns = createKanbanColumns();

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="!bg-white shadow-lg z-10"
      >
        <Sidebar collapsed={collapsed} />
      </Sider>

      <Layout>
        <Header
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(true)}
          onNewInvestigation={() => setInvestigationFormVisible(true)}
        />

        <Content className="p-6">
          <FilterBar
            onDateRangeChange={handleDateRangeChange}
            onStatusFilter={handleStatusFilter}
            onPriorityFilter={handlePriorityFilter}
            onSearch={handleSearch}
            onRefresh={loadInvestigations}
          />

          <KanbanBoard
            columns={kanbanColumns}
            loading={loading}
            onCardClick={handleCardClick}
            onInvestigationMove={handleInvestigationMove}
          />
        </Content>
      </Layout>

      {/* Modals */}
      <InvestigationModal
        visible={investigationModalVisible}
        investigation={selectedInvestigation}
        onClose={() => {
          setInvestigationModalVisible(false);
          setSelectedInvestigation(null);
        }}
        onUpdate={handleInvestigationUpdate}
      />

      <InvestigationForm
        visible={investigationFormVisible}
        onClose={() => setInvestigationFormVisible(false)}
        onSubmit={handleCreateInvestigation}
      />

      <PatientForm
        visible={patientFormVisible}
        onClose={() => setPatientFormVisible(false)}
        onSubmit={handleCreatePatient}
      />

      <DoctorForm
        visible={doctorFormVisible}
        onClose={() => setDoctorFormVisible(false)}
        onSubmit={handleCreateDoctor}
      />

      <TestForm
        visible={testFormVisible}
        onClose={() => setTestFormVisible(false)}
        onSubmit={handleCreateTest}
      />
    </Layout>
  );
}

export default App;