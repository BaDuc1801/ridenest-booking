'use client'

import { Button, Form, Input, Modal, Select, Table, Tabs, Upload } from 'antd';
import React, { useEffect, useState } from 'react'
import { FaTrash } from 'react-icons/fa';
import { RiEditFill } from 'react-icons/ri';
import { MdOutlineFileUpload } from 'react-icons/md';
import userService, { IUser } from '@/services/userService';
import busService, { IBus } from '@/services/busService';
import { toast } from 'react-toastify';
const { Option } = Select;

const BusManager = () => {
    const [listBus, setListBus] = useState<IBus[]>([]);
    const [listUser, setListUser] = useState<IUser[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [user, setUser] = useState<IUser>()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await userService.getUserInformation();
                const response = await busService.getAllBus();
                const res = await userService.getAllUser();
                let busData = response;
                setListUser(res);
                if (userData?.role === "Operator") {
                    busData = busData.filter((bus: IBus) => bus.owner === userData.owner);
                    form.setFieldsValue({ owner: userData.owner });
                }
                setUser(userData);
                setListBus(busData);
            } catch (error) {
                console.error('Error fetching buss:', error);
            }
        };
        fetchData();
    }, []);

    const [selectedBus, setSelectedBus] = useState<IBus>();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [busIdToDelete, setBusIdToDelete] = useState<string>("");
    const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);

    const [busForm, setbusForm] = useState({
        status: '',
    });

    const handleEdit = (bus: IBus) => {
        setSelectedBus(bus);
        setbusForm({
            status: bus.status
        });
        setIsEditModalVisible(true);
    };

    const handleDelete = (bus: string) => {
        setBusIdToDelete(bus);
        setConfirmDelete(true);
    };

    const confirmDeletebus = async () => {
        try {
            setLoading(true)
            await busService.delBus(busIdToDelete)
            setListBus(listBus.filter((bus) => bus._id !== busIdToDelete));
            setConfirmDelete(false);
            setLoading(false)
            toast.success('Xóa bus thành công');
        } catch (error) {
            setLoading(false)
            toast.error('Lỗi khi xóa bus');
        }
    };

    const cancelDeletebus = () => {
        setConfirmDelete(false);
        setBusIdToDelete("");
    };

    const handleSaveChanges = async () => {
        try {
            setLoading(true)
            if (selectedBus)
                await busService.updateBus(selectedBus?._id, busForm)
            const rs = await busService.getAllBus()
            setListBus(user?.role === "Operator"
                ? rs.filter((bus: IBus) => bus.owner === user.owner)
                : rs
            ); setIsEditModalVisible(false);
            setLoading(false)
            toast.success('Cập nhật bus thành công');
        } catch (error) {
            setLoading(false)
            console.log(error)
            toast.error('Lỗi cập nhật bus');
        }
    };

    const handleInputChange = (value: any, name: string) => {
        setbusForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const columns = [
        {
            title: 'Biển số xe',
            dataIndex: 'licensePlate',
            key: 'licensePlate',
        },
        {
            title: 'Nhà xe',
            dataIndex: 'owner',
            key: 'owner',
        },
        {
            title: 'Số ghế',
            dataIndex: 'totalSeats',
            key: 'totalSeats',
        },
        {
            title: 'Tình trạng',
            dataIndex: 'status',
            key: 'status',
            render: (text: string) => {
                return (
                    text === "active" ? <p className='text-green-500'>{text}</p>
                        : <p className='text-red-500'>{text}</p>)
            }
        },
        {
            title: 'Chỉnh sửa',
            render: (_text: any, record: IBus) => (
                <div className="flex cursor-pointer text-lg gap-5">
                    <p onClick={() => handleEdit(record)}>
                        <RiEditFill />
                    </p>
                    <p
                        className="text-red-500"
                        onClick={() => handleDelete(record._id)}
                    >
                        <FaTrash />
                    </p>
                </div>
            ),
        }
    ]

    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        try {
            setLoading(true)
            const response = await busService.createBus({
                totalSeats: values.totalSeats,
                owner: values.owner,
                licensePlate: values.licensePlate
            });

            const busId = response._id;
            const files = form.getFieldValue('img');

            const formData = new FormData();
            files.forEach((file: any) => {
                formData.append('img', file.originFileObj);
            });
            await busService.updateImg(busId, formData);
            const rs = await busService.getAllBus()
            setListBus(user?.role === "Operator"
                ? rs.filter((bus: IBus) => bus.owner === user.owner)
                : rs
            );
            setLoading(false)
            toast.success('Tạo xe thành công');
        } catch (error) {
            setLoading(false)
            console.error('Lỗi khi tạo xe:', error);
        }
    };

    const [searchQuery, setSearchQuery] = useState('');

    const filteredBus = (bus: IBus[]) => {
        return bus.filter(bus => {
            const { licensePlate, owner } = bus;
            return (
                licensePlate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                owner?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    };

    return (
        <div>
            <Tabs
                defaultActiveKey="1"
                className="bg-white rounded-md px-4 w-full pb-4"
                items={[
                    {
                        key: '1',
                        label: <p className='font-semibold text-lg'>Danh sách xe</p>,
                        children: (
                            <>
                                <Input
                                    placeholder="Tìm kiếm "
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="p-3 mb-3"
                                />
                                {listBus && (
                                    <Table
                                        dataSource={filteredBus(listBus)}
                                        columns={columns}
                                        pagination={{ pageSize: 6 }}
                                        rowKey="_id"
                                    />
                                )}
                            </>
                        ),
                    },
                    {
                        key: '2',
                        label: <p className='font-semibold text-lg'>Tạo mới xe</p>,
                        children: (
                            <Form
                                form={form}
                                onFinish={onFinish}
                                layout='vertical'
                                className='w-1/2 !m-auto shadow-md rounded-md !px-5 !py-4'
                            >
                                <Form.Item
                                    label="Số lượng chỗ ngồi:"
                                    name="totalSeats"
                                    rules={[{ required: true, message: 'Chọn số ghế!' }]}
                                >
                                    <Select size='large'>
                                        <Option value="9">9</Option>
                                        <Option value="11">11</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Nhà xe:"
                                    name="owner"
                                    rules={[{ required: true, message: 'Chọn nhà xe!' }]}
                                >
                                    <Select size="large" disabled={user?.role === "Operator"}>
                                        {
                                            [...new Set(listUser.map(user => user.owner))]
                                                .filter(owner => !!owner)
                                                .map((owner, index) => (
                                                    <Option value={owner} key={index}>{owner}</Option>
                                                ))
                                        }
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Biển số xe:"
                                    name="licensePlate"
                                    rules={[{ required: true, message: 'Vui lòng nhập biển số xe!' }]}
                                >
                                    <Input placeholder='Nhập biển số xe' className='p-2' />
                                </Form.Item>

                                <Form.Item
                                    name="img"
                                    rules={[{ required: true, message: 'Vui lòng upload ảnh!' }]}
                                >
                                    <Upload
                                        listType="picture"
                                        beforeUpload={() => false}
                                        maxCount={4}
                                        multiple
                                        onChange={({ fileList }) => form.setFieldsValue({ img: fileList })}
                                    >
                                        <Button icon={<MdOutlineFileUpload />}>Upload (Tối đa 4)</Button>
                                    </Upload>
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className='w-full mt-6' loading={loading}>
                                        Thêm mới
                                    </Button>
                                </Form.Item>
                            </Form>
                        ),
                    }
                ]}
            />
            <Modal
                title="Cập nhật bus"
                open={isEditModalVisible}
                onOk={handleSaveChanges}
                onCancel={() => setIsEditModalVisible(false)}
                okText="Lưu thay đổi"
                cancelText="Hủy"
                loading={loading}
            >
                <div>
                    <div className="">
                        <label htmlFor="status" className='mr-2'>Tình trạng:</label>
                        <Select
                            size='large'
                            key='status'
                            className='w-40 ml-5'
                            value={busForm.status}
                            onChange={(value) => handleInputChange(value, 'status')}
                        >
                            <Option value="active">
                                Hoạt động
                            </Option>
                            <Option value="inactive">
                                Bảo trì
                            </Option>
                        </Select>
                    </div>
                </div>
            </Modal>
            <Modal
                title="Xác nhận xóa bus"
                open={confirmDelete}
                onOk={confirmDeletebus}
                onCancel={cancelDeletebus}
                okText="Xóa"
                cancelText="Hủy"
                loading={loading}
            >
                <p>Bạn có chắc chắn muốn xóa xe này không?</p>
            </Modal>
        </div>
    )
}

export default BusManager