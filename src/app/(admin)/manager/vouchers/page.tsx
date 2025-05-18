'use client'

import { setListVoucher } from '@/redux/voucherStore';
import voucherService, { IVoucher } from '@/services/voucherService';
import { Button, DatePicker, Form, Input, InputNumber, Modal, Row, Select, Table, Tabs } from 'antd';
const { Option } = Select;
import TextArea from 'antd/es/input/TextArea';
import Item from 'antd/es/list/Item';
import React, { useState } from 'react'
import { FaTrash } from 'react-icons/fa';
import { RiEditFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const VoucherManage = () => {
    const listVouchers = useSelector((state: { voucher: { list: IVoucher[] } }) => state.voucher.list)
    const dispatch = useDispatch();

    const formattedDate = (date: string) => {
        const getDate = new Date(date)
        return getDate.toLocaleDateString('vi-VN')
    }

    const [selectedvoucher, setSelectedvoucher] = useState<IVoucher>();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [voucherIdToDelete, setvoucherIdToDelete] = useState<string>("");
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const [voucherForm, setvoucherForm] = useState({
        code: '',
        name: '',
        description: '',
        expiryDate: ''
    });

    const handleEdit = (voucher: IVoucher) => {
        setSelectedvoucher(voucher);
        setvoucherForm({
            code: voucher.code || '',
            name: voucher.name || '',
            description: voucher.description || '',
            expiryDate: voucher.expiryDate || ''
        });
        setIsEditModalVisible(true);
    };

    const handleDelete = (voucher: string) => {
        setvoucherIdToDelete(voucher);
        setConfirmDelete(true);
    };

    const confirmDeletevoucher = async () => {
        try {
            await voucherService.deleteVoucher(voucherIdToDelete);
            const rs = await voucherService.getAllVouchers();
            dispatch(setListVoucher(rs));
            setConfirmDelete(false);
            toast.success('Xóa voucher thành công');
        } catch (error) {
            toast.error('Lỗi khi xóa voucher');
        }
    };

    const cancelDeletevoucher = () => {
        setConfirmDelete(false);
        setvoucherIdToDelete("");
    };

    const handleSaveChanges = async () => {
        try {
            if (selectedvoucher && selectedvoucher._id)
                await voucherService.updateVoucher(selectedvoucher._id, voucherForm);
            const rs = await voucherService.getAllVouchers();
            dispatch(setListVoucher(rs));   
            setIsEditModalVisible(false);
            toast.success('Cập nhật voucher thành công');
        } catch (error) {
            toast.error('Lỗi cập nhật voucher');
        }
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setvoucherForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const columns = [
        {
            title: 'Mã Voucher',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Giảm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Nội dung',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Số lượng',
            dataIndex: 'count',
            key: 'count'
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'expiryDate',
            key: 'expiryDate',
            render: (text: string) => {
                return <p>{formattedDate(text)}</p>
            }
        },
        {
            title: 'Người tạo',
            dataIndex: 'createdBy',
            key: 'createdBy',
            render: (text: any) => {
                return <p>{text.username}</p>
            }
        },
        {
            title: 'Chỉnh sửa',
            render: (_text: any, record: any) => (
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
            const formattedExpiryDate = formattedDatePicker(values.expiryDate);
            await voucherService.createVoucher({
                ...values,
                expiryDate: formattedExpiryDate,
            });
            toast.success('Tạo khuyến mãi thành công');
            form.resetFields();
            const rs = await voucherService.getAllVouchers();
            dispatch(setListVoucher(rs));
        } catch (error) {
            toast.error('Error creating voucher');
        }
    };


    const formattedDatePicker = (date: string) => {
        const getDate = new Date(date);
        const year = getDate.getFullYear();
        const month = String(getDate.getMonth() + 1).padStart(2, '0');
        const day = String(getDate.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };


    const [searchQuery, setSearchQuery] = useState<string>('');

    const filteredVoucher = (voucher: IVoucher[]) => {
        return voucher.filter(user => {
            const { code } = user;
            return (
                code?.toLowerCase().includes(searchQuery.toLowerCase())
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
                        label: <p className="w-1/3 font-semibold text-lg">Danh sách khuyến mãi</p>,
                        children: (
                            <>
                                <Input
                                    placeholder="Tìm kiếm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="!p-3 !mb-3"
                                />
                                {listVouchers && (
                                    <Table
                                        dataSource={filteredVoucher(listVouchers)}
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
                        label: <p className="w-1/3 font-semibold text-lg">Thêm khuyến mãi</p>,
                        children: (
                            <Form
                                form={form}
                                onFinish={onFinish}
                                layout="vertical"
                                className="w-1/2 !m-auto shadow-md rounded-md !p-5"
                            >
                                <Form.Item
                                    label="Mã Code:"
                                    name="code"
                                    rules={[{ required: true, message: 'Vui lòng nhập mã code!' }]}
                                >
                                    <Input placeholder="Nhập mã code" className="p-2" />
                                </Form.Item>

                                <Form.Item
                                    label="Tiêu đề:"
                                    name="name"
                                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                                >
                                    <Input placeholder="Nhập tiêu đề" className="p-2" />
                                </Form.Item>

                                <Row gutter={[16, 0]} className='flex justify-between items-center !mx-5'>
                                    <Form.Item
                                        label="Giảm:"
                                        name="discount"
                                        rules={[{ required: true, message: 'Vui lòng nhập số giảm giá!' }]}
                                    >
                                        <InputNumber size="large" className="w-full" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Đơn vị:"
                                        name="discountType"
                                        rules={[{ required: true, message: 'Vui lòng chọn đơn vị!' }]}
                                    >
                                        <Select size="large" className="w-full">
                                            <Option value="percent">%</Option>
                                            <Option value="fixed">k</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="Số lượng:"
                                        name="count"
                                        rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                                    >
                                        <InputNumber size="large" className="w-full" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Ngày hết hạn:"
                                        name="expiryDate"
                                        rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn!' }]}
                                    >
                                        <DatePicker size="large" className="w-full" />
                                    </Form.Item>
                                </Row>

                                <Form.Item
                                    label="Nội dung:"
                                    name="description"
                                    rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                                >
                                    <TextArea rows={4} />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="w-full">
                                        Tạo mới
                                    </Button>
                                </Form.Item>
                            </Form>
                        ),
                    },
                ]}
            />
            <Modal
                title="Chỉnh sửa voucher"
                open={isEditModalVisible}
                onOk={handleSaveChanges}
                onCancel={() => setIsEditModalVisible(false)}
                okText="Lưu thay đổi"
                cancelText="Hủy"
            >
                <div>
                    <div className="mb-3">
                        <label htmlFor="code">Code:</label>
                        <Input
                            id="code"
                            name="code"
                            value={voucherForm.code}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor='name'>Giảm:</label>
                        <Input
                            id="name"
                            name="name"
                            value={voucherForm.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description">Nội dung:</label>
                        <Input
                            id="description"
                            name="description"
                            value={voucherForm.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="expiryDate">Ngày hết hạn:</label>
                        <Input
                            id="expiryDate"
                            name="expiryDate"
                            value={formattedDate(voucherForm.expiryDate)}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </Modal>
            <Modal
                title="Xác nhận xóa voucher"
                open={confirmDelete}
                onOk={confirmDeletevoucher}
                onCancel={cancelDeletevoucher}
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xóa mã khuyến mãi này không?</p>
            </Modal>
        </div>
    )
}

export default VoucherManage