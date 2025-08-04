import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Upload, Button, Input, Space, Tag, Typography, Divider, message, Progress, Dropdown } from 'antd';
import { UploadOutlined, UserOutlined, TeamOutlined, CalendarOutlined, FileTextOutlined, DownloadOutlined, EyeOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { Investigation } from '../../types';
import { apiService } from '../../services/apiService';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Text, Title } = Typography;

interface InvestigationModalProps {
  visible: boolean;
  investigation: Investigation | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Investigation>) => void;
}

interface FormValues {
  status: 'Advised' | 'Billing' | 'New Investigations' | 'In Progress' | 'Under Review' | 'Approved' | 'Revision Required';
  priority: 'Emergency' | 'Normal' | 'High';
  notes: string;
}

export const InvestigationModal: React.FC<InvestigationModalProps> = ({
  visible,
  investigation,
  onClose,
  onUpdate
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentReportFile, setCurrentReportFile] = useState<string | null>(null);

  useEffect(() => {
    if (investigation) {
      form.setFieldsValue({
        status: investigation.status,
        priority: investigation.priority,
        notes: investigation.notes
      });
      setCurrentReportFile(investigation.reportFile || null);
    }
  }, [investigation, form]);

  const handleSubmit = async (values: FormValues) => {
    if (!investigation) {
      return;
    }
    setLoading(true);
    try {
      await onUpdate(investigation.id, {
        status: values.status,
        priority: values.priority,
        notes: values.notes
      });
      message.success('Investigation updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating investigation:', error);
      message.error('Failed to update investigation');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!investigation) {
      message.error('No investigation selected');
      return false;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const updatedInvestigation = await apiService.uploadInvestigationReport(investigation.id, file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Update the current investigation data
      setCurrentReportFile(updatedInvestigation.reportFile || null);

      // Update parent component with new data
      await onUpdate(investigation.id, { reportFile: updatedInvestigation.reportFile });

      message.success('Report uploaded successfully');

      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Upload error:', error);
      message.error('Failed to upload report');
    } finally {
      setUploading(false);
    }

    return false; // Prevent default upload behavior
  };

  const handleOpenDocument = () => {
    if (currentReportFile) {
      window.open(currentReportFile, '_blank');
    }
  };

  const handleDownloadDocument = () => {
    if (currentReportFile && investigation) {
      const link = document.createElement('a');
      link.href = currentReportFile;
      link.download = `investigation-${investigation.id}-report`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getFileMenuItems = () => [
    {
      key: 'reupload',
      label: 'Re-upload',
      icon: <CloudUploadOutlined />,
      onClick: () => {
        // Trigger file input click
        const fileInput = document.querySelector('.report-upload input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.click();
        }
      }
    },
    {
      key: 'open',
      label: 'Open Document',
      icon: <EyeOutlined />,
      onClick: handleOpenDocument
    },
    {
      key: 'download',
      label: 'Download',
      icon: <DownloadOutlined />,
      onClick: handleDownloadDocument
    }
  ];

  const getFileNameFromUrl = (url: string) => {
    try {
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      // Remove timestamp prefix if present (format: timestamp-filename)
      const cleanName = fileName.replace(/^\d+-/, '');
      return cleanName || 'report-file';
    } catch {
      return 'report-file';
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Advised': return 'orange';
      case 'Billing': return 'gold';
      case 'New Investigations': return 'blue';
      case 'In Progress': return 'purple';
      case 'Under Review': return 'cyan';
      case 'Approved': return 'green';
      case 'Revision Required': return 'red';
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
            <Text className="text-gray-500">ID: {investigation?.id}</Text>
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="investigation-modal"
    >
      {!investigation && (
        <div className="flex justify-center items-center h-full">
          <Text className="text-gray-500">No investigation found</Text>
        </div>
      )}
      {investigation && (
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
              priority: investigation.priority,
              notes: investigation.notes
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: 'Please select a status' }]}
              >
                <Select options={statusOptions} placeholder="Select status" />
              </Form.Item>

              <Form.Item
                label="Priority"
                name="priority"
                rules={[{ required: true, message: 'Please select a priority' }]}
              >
                <Select options={priorityOptions} placeholder="Select priority" />
              </Form.Item>

              <Form.Item label="Upload Report" className='col-span-3'>
                <div className="space-y-3">
                  {/* File Upload */}
                  <Upload
                    className="report-upload"
                    beforeUpload={handleFileUpload}
                    maxCount={1}
                    accept=".pdf,.doc,.docx,.txt"
                    showUploadList={false}
                    disabled={uploading}
                  >
                    <Button
                      icon={<UploadOutlined />}
                      loading={uploading}
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : currentReportFile ? 'Replace Report' : 'Upload Report'}
                    </Button>
                  </Upload>

                  {/* Upload Progress */}
                  {uploading && uploadProgress > 0 && (
                    <div className="w-full">
                      <Progress percent={uploadProgress} size="small" />
                    </div>
                  )}

                  {/* Current Report File */}
                  {currentReportFile && !uploading && (
                    <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center space-x-2">
                        <FileTextOutlined className="text-green-600" />
                        <div>
                          <Text className="text-sm text-green-800 font-medium">Report uploaded</Text>
                          <div className="text-xs text-green-600">{getFileNameFromUrl(currentReportFile)}</div>
                        </div>
                      </div>
                      <Dropdown
                        menu={{ items: getFileMenuItems() }}
                        trigger={['click']}
                        placement="bottomRight"
                      >
                        <Button size="small" type="link">
                          Manage File
                        </Button>
                      </Dropdown>
                    </div>
                  )}
                </div>
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
      )}
    </Modal>
  );
};