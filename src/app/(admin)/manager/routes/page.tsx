"use client"

import { setListRoute } from '@/redux/routeStore';
import routeService, { IRoute } from '@/services/routeService';
import { Button, Col, Form, Input, Modal, Row, Table, Tabs } from 'antd';
import React, { useEffect, useState } from 'react'
import { FaTrash } from 'react-icons/fa';
import { RiEditFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const RouteManage = () => {
    const listRoute = useSelector((state: { route: { list: IRoute[] } }) => state.route.list)
    const dispatch = useDispatch()

    const [selectedRoute, setSelectedRoute] = useState<IRoute>();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [routeIdToDelete, setRouteIdToDelete] = useState<string>("");
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const [routeForm, setRouteForm] = useState({
        origin: '',
        destination: '',
        basisPrice: '',
        afterDiscount: '',
    });

    const handleEdit = (route: any) => {
        setSelectedRoute(route);
        setRouteForm({
            origin: route.origin || '',
            destination: route.destination || '',
            basisPrice: route.basisPrice || '',
            afterDiscount: route.afterDiscount || '',
        });
        setIsEditModalVisible(true);
    };

    const handleDelete = (route: any) => {
        setRouteIdToDelete(route);
        setConfirmDelete(true);
    };

    const confirmDeleteRoute = async () => {
        try {
            await routeService.delSchedule(routeIdToDelete);
            const rs = await routeService.getAllRoutes();
            dispatch(setListRoute(rs));
            setConfirmDelete(false);
            toast.success('Xóa tuyến đường thành công');
        } catch (error) {
            toast.error('Lỗi khi xóa tuyến đường');
        }
    };

    const cancelDeleteRoute = () => {
        setConfirmDelete(false);
        setRouteIdToDelete("");
    };

    const handleSaveChanges = async () => {
        try {
            if (selectedRoute && selectedRoute._id) {
                await routeService.updateSchedule(selectedRoute._id, routeForm);
                const rs = await routeService.getAllRoutes();
                dispatch(setListRoute(rs));
                setIsEditModalVisible(false);
                toast.success('Cập nhật tuyến đường thành công');
            }
        } catch (error) {
            toast.error('Lỗi cập nhật tuyến đường');
        }
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setRouteForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const columns = [
        {
            title: 'Điểm đi',
            dataIndex: 'origin',
            key: 'origin',
        },
        {
            title: 'Điểm đến',
            dataIndex: 'destination',
            key: 'destination',
        },
        {
            title: 'Giá gốc',
            dataIndex: 'basisPrice',
            key: 'basisPrice',
        },
        {
            title: 'Giá sau giảm',
            dataIndex: 'afterDiscount',
            key: 'afterDiscount'
        },
        {
            title: 'Chỉnh sửa',
            render: (_text: any, record: IRoute) => (
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
            await routeService.createRoute({
                ...values, img: "https://f1e425bd6cd9ac6.cmccloud.com.vn/cms-tool/destination/images/25/img_hero.png"
            });
            toast.success('Tạo tuyến đường thành công');
            form.resetFields();
            const rs = await routeService.getAllRoutes();
            dispatch(setListRoute(rs));
        } catch (error) {
            toast.error('Lỗi khi tạo tuyến đường');
        }
    };

    const [searchQuery, setSearchQuery] = useState<string>("");

    const filteredRoute = (route: IRoute[]) => {
        return route.filter(route => {
            const { origin, destination } = route;
            return (
                origin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                destination?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    };

    return (
        <div>
            <Tabs
                className='bg-white rounded-md px-4 w-full pb-4'
                defaultActiveKey='1'
                items={[
                    {
                        key: '1',
                        label: <p className='w-1/3 font-semibold text-lg'>Danh sách tuyến đường</p>,
                        children: (
                            <>
                                <Input
                                    placeholder="Tìm kiếm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="!p-3 !mb-3"
                                />
                                {listRoute && (
                                    <Table
                                        dataSource={filteredRoute(listRoute)}
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
                        label: <p className='w-1/3 font-semibold text-lg'>Thêm tuyến đường</p>,
                        children: (
                            <Form
                                form={form}
                                onFinish={onFinish}
                                layout='vertical'
                                className='w-1/2 !m-auto shadow-md rounded-md !px-5 !py-3'
                            >
                                <Row gutter={[16, 8]}>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Điểm đi:"
                                            name="origin"
                                            rules={[{ required: true, message: 'Vui lòng nhập điểm đi!' }]}
                                        >
                                            <Input placeholder='Nhập điểm đi' className='p-2' />
                                        </Form.Item>
                                        <Form.Item
                                            label="Giá gốc:"
                                            name="basisPrice"
                                            rules={[{ required: true, message: 'Vui lòng nhập giá gốc!' }]}
                                        >
                                            <Input placeholder='Nhập giá gốc' className='p-2' />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Điểm đến:"
                                            name="destination"
                                            rules={[{ required: true, message: 'Vui lòng nhập điểm đến!' }]}
                                        >
                                            <Input placeholder='Nhập điểm đến' className='p-2' />
                                        </Form.Item>
                                        <Form.Item
                                            label="Giá sau giảm:"
                                            name="afterDiscount"
                                            rules={[{ required: true, message: 'Vui lòng nhập giá sau giảm!' }]}
                                        >
                                            <Input placeholder='Nhập giá sau giảm' className='p-2' />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className='w-full'>
                                        Tạo mới
                                    </Button>
                                </Form.Item>
                            </Form>
                        ),
                    },
                ]}
            />
            <Modal
                title="Chỉnh sửa tuyến đường"
                open={isEditModalVisible}
                onOk={handleSaveChanges}
                onCancel={() => setIsEditModalVisible(false)}
                okText="Lưu thay đổi"
                cancelText="Hủy"
            >
                <div>
                    <div className="mb-3">
                        <label htmlFor="code">Điểm đi:</label>
                        <Input
                            id="origin"
                            name="origin"
                            value={routeForm.origin}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor='name'>Điểm đến:</label>
                        <Input
                            id="destination"
                            name="destination"
                            value={routeForm.destination}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="basisPrice">Giá gốc:</label>
                        <Input
                            id="basisPrice"
                            name="basisPrice"
                            value={routeForm.basisPrice}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="expiryDate">Giá sau giảm:</label>
                        <Input
                            id="afterDiscount"
                            name="afterDiscount"
                            value={routeForm.afterDiscount}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </Modal>
            <Modal
                title="Xác nhận xóa tuyến đường"
                open={confirmDelete}
                onOk={confirmDeleteRoute}
                onCancel={cancelDeleteRoute}
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xóa tuyến đường này không?</p>
            </Modal>
        </div>
    )
}

export default RouteManage