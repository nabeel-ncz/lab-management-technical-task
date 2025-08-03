import React, { useState } from 'react';
import { Modal, Form, Select, Upload, Button, Input, Space, Tag, Avatar, Typography, Divider } from 'antd';
import { UploadOutlined, UserOutlined, TeamOutlined, CalendarOutlined, FileTextOutlined } from '@ant-design/icons';
import { Investigation } from '../../types';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Text, Title } = Typography;

interface InvestigationModalProps {
  visible: boolean;
  investigation: Investigation | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Investigation>) => void;
}

export const InvestigationModal: React.FC<InvestigationModalProps> = ({
  visible,
  investigation,
  onClose,
  onUpdate
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  if (!investigation) return null;

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await onUpdate(investigation.id, {
        status: values.status,
        notes: values.notes,
        reportFile: values.reportFile?.[0]?.name
      });
      onClose();
    } catch (error) {
      console.error('Error updating investigation:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { label: 'New Requests', value: 'New Requests' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Under Review', value: 'Under Review' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Revision required', value: 'Revision required' },
  ];

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Emergency': return 'red';
      case 'High': return 'orange';
      default: return 'blue';
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-3">
          <FileTextOutlined className="text-blue-600" />
          <div>
            <Title level={4} className="m-0">Investigation Details</Title>
            <Text className="text-gray-500">ID: {investigation.id}</Text>
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="investigation-modal"
    >
      <div className="space-y-6">
        {/* Status and Priority */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <div>
              <Text className="text-sm text-gray-500">Current Status</Text>
              <div className="mt-1">
                <Tag color={getStatusColor(investigation.status)} className="px-3 py-1">
                  {investigation.status}
                </Tag>
              </div>
            </div>
            <div>
              <Text className="text-sm text-gray-500">Priority</Text>
              <div className="mt-1">
                <Tag color={getPriorityColor(investigation.priority)} className="px-3 py-1">
                  {investigation.priority}
                </Tag>
              </div>
            </div>
          </div>
          <div className="text-right">
            <Text className="text-sm text-gray-500">Total Amount</Text>
            <div className="mt-1">
              <Text className="text-lg font-bold text-green-600">
                ₹{investigation.totalAmount.toLocaleString()}
              </Text>
            </div>
          </div>
        </div>

        <Divider />

        {/* Patient Information */}
        <div>
          <Title level={5} className="flex items-center space-x-2 mb-3">
            <UserOutlined className="text-blue-600" />
            <span>Patient Information</span>
          </Title>
          <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
            <div>
              <Text className="text-sm text-gray-500">Name</Text>
              <div className="font-medium">{investigation.patient?.name}</div>
            </div>
            <div>
              <Text className="text-sm text-gray-500">Age & Gender</Text>
              <div className="font-medium">{investigation.patient?.age}Y, {investigation.patient?.gender}</div>
            </div>
            <div>
              <Text className="text-sm text-gray-500">Phone</Text>
              <div className="font-medium">{investigation.patient?.phone}</div>
            </div>
            <div>
              <Text className="text-sm text-gray-500">Email</Text>
              <div className="font-medium">{investigation.patient?.email}</div>
            </div>
          </div>
        </div>

        {/* Doctor Information */}
        <div>
          <Title level={5} className="flex items-center space-x-2 mb-3">
            <TeamOutlined className="text-green-600" />
            <span>Doctor Information</span>
          </Title>
          <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg">
            <div>
              <Text className="text-sm text-gray-500">Name</Text>
              <div className="font-medium">{investigation.doctor?.name}</div>
            </div>
            <div>
              <Text className="text-sm text-gray-500">Specialization</Text>
              <div className="font-medium">{investigation.doctor?.specialization}</div>
            </div>
            <div>
              <Text className="text-sm text-gray-500">Hospital</Text>
              <div className="font-medium">{investigation.doctor?.hospital}</div>
            </div>
            <div>
              <Text className="text-sm text-gray-500">Phone</Text>
              <div className="font-medium">{investigation.doctor?.phone}</div>
            </div>
          </div>
        </div>

        {/* Tests Information */}
        <div>
          <Title level={5} className="mb-3">Selected Tests</Title>
          <div className="space-y-3">
            {investigation.tests?.map((test) => (
              <div key={test.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <Text className="font-medium text-lg">{test.name}</Text>
                    <div className="mt-1">
                      <Tag color="blue">{test.category}</Tag>
                    </div>
                    <Text className="text-sm text-gray-500 mt-2">{test.description}</Text>
                  </div>
                  <Text className="font-bold text-green-600">₹{test.price}</Text>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* Update Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: investigation.status,
            notes: investigation.notes
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Please select a status' }]}
            >
              <Select options={statusOptions} placeholder="Select status" />
            </Form.Item>

            <Form.Item label="Upload Report" name="reportFile">
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                accept=".pdf,.doc,.docx,.txt"
              >
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
            </Form.Item>
          </div>

          <Form.Item label="Notes" name="notes">
            <TextArea rows={3} placeholder="Add notes or comments..." />
          </Form.Item>

          <div className="flex justify-between items-center pt-4">
            <div className="text-sm text-gray-500">
              <CalendarOutlined className="mr-1" />
              Created: {dayjs(investigation.createdAt).format('DD MMM YYYY, HH:mm')}
              {investigation.updatedAt !== investigation.createdAt && (
                <span className="ml-4">
                  Updated: {dayjs(investigation.updatedAt).format('DD MMM YYYY, HH:mm')}
                </span>
              )}
            </div>
            <Space>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Investigation
              </Button>
            </Space>
          </div>
        </Form>
      </div>
    </Modal>
  );
};