'use client'

import busService, { IBus } from '@/services/busService';
import { IRoute } from '@/services/routeService';
import scheduleService, { ISchedule } from '@/services/scheduleService';
import userService, { IUser } from '@/services/userService';
import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, Table, Tabs } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { FaTrash } from 'react-icons/fa';
import { RiEditFill } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Schedule = () => {
    const [listSchedule, setListSchedule] = useState<ISchedule[]>([]);
    const [listBus, setListBus] = useState<IBus[]>([]);
    const listRoute = useSelector((state: { route: { list: IRoute[] } }) => state.route.list)
    const [user, setUser] = useState<IUser>()
    const [loading, setLoading] = useState<boolean>(false)

    const disabledDate = (current: dayjs.Dayjs) => {
        return current && current < dayjs().endOf('day');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                let listSchedule = await scheduleService.getAllSchedules();
                let allBus = await busService.getAllBus()
                const user = await userService.getUserInformation()
                setUser(user)
                if (user?.role === "Operator") {
                    allBus = allBus.filter((bus: IBus) => bus.owner === user.owner);
                    const busIds = allBus.map((bus: IBus) => bus._id);
                    listSchedule = listSchedule.filter((listSchedule: ISchedule) => busIds.includes(listSchedule.busId._id));
                    setListSchedule(listSchedule);
                    setListBus(allBus);

                    return
                }
                setListBus(allBus);
                setListSchedule(listSchedule);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    const [selectedSchedule, setSelectedSchedule] = useState<ISchedule>();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [scheduleIdToDelete, setScheduleIdToDelete] = useState<string>("");
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const [scheduleForm, setScheduleForm] = useState({
        startTime: '',
        endTime: '',
    });

    const handleEdit = (schedule: ISchedule) => {
        setSelectedSchedule(schedule);
        setScheduleForm({
            startTime: schedule.startTime,
            endTime: schedule.endTime
        });
        setIsEditModalVisible(true);
    };

    const handleDelete = (schedule: string) => {
        setScheduleIdToDelete(schedule);
        setConfirmDelete(true);
    };

    const confirmDeleteSchedule = async () => {
        try {
            setLoading(true)
            await scheduleService.deleteSchedule(scheduleIdToDelete);
            setListSchedule(listSchedule.filter((schedule: ISchedule) => schedule._id !== scheduleIdToDelete));
            setConfirmDelete(false);
            setLoading(false)
            toast.success('Xóa lịch trình thành công');
        } catch (error) {
            console.log(error)
            setLoading(false)
            toast.error('Lỗi khi xóa lịch trình');
        }
    };

    const cancelDeleteSchedule = () => {
        setConfirmDelete(false);
        setScheduleIdToDelete("");
    };

    const handleSaveChanges = async () => {
        try {
            setLoading(true)
            if (selectedSchedule)
                await scheduleService.updateSchedule(selectedSchedule?._id, scheduleForm)
            const rs = await scheduleService.getAllSchedules()
            setListSchedule(user?.role === "Operator"
                ? rs.filter((schedule: ISchedule) => schedule.busId.owner === user.owner)
                : rs
            );
            setIsEditModalVisible(false);
            setLoading(false)
            toast.success('Cập nhật lịch trình thành công');
        } catch (error) {
            console.log(error)
            setLoading(false)
            toast.error('Lỗi cập nhật lịch trình');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setScheduleForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const columns = [
        {
            title: 'Điểm đi',
            dataIndex: 'routeId',
            key: 'origin',
            render: (text: IRoute) => {
                return (text.origin && <p>{text?.origin}</p>);
            },
        },
        {
            title: 'Điểm đi',
            dataIndex: 'routeId',
            key: 'destination',
            render: (text: IRoute) => {
                return <p>{text?.destination}</p>;
            },
        },
        {
            title: 'Xe',
            dataIndex: 'busId',
            key: 'licensePlate',
            render: (text: IBus) => {
                return <p>{text.licensePlate}</p>
            }
        },
        {
            title: 'Thời gian đi',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (text: string) => {
                return <p>{new Date(text).toLocaleDateString('UTC')} - {new Date(text).toLocaleTimeString('UTC', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</p>
            }
        },
        {
            title: 'Thời gian đến',
            dataIndex: 'endTime',
            key: 'endTime',
            render: (text: string) => {
                return <p>{new Date(text).toLocaleDateString('UTC')} - {new Date(text).toLocaleTimeString('UTC', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</p>
            }
        },
        {
            title: 'Tổng số ghế',
            dataIndex: 'busId',
            key: 'busId',
            render: (text: IBus) => {
                return <p>{text.totalSeats}</p>
            }
        },
        {
            title: 'Số ghế còn lại',
            dataIndex: 'availableSeats',
            key: 'availableSeats',
        },
        {
            title: 'Chỉnh sửa',
            render: (_text: unknown, record: ISchedule) => (
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

    const onFinish = async (values: {
        startTime : string,
        endTime : string,
        routeId : string,
        busId : string,
        front : number,
        middle : number,
        back : number
    }) => {
        try {
            setLoading(true)
            const formattedStartTime = dayjs(values.startTime).format('YYYY-MM-DDTHH:mm:ss');
            const formattedEndTime = dayjs(values.endTime).format('YYYY-MM-DDTHH:mm:ss');
            await scheduleService.createSchedule({
                routeId: values.routeId,
                busId: values.busId,
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                price: {
                    front: values.front,
                    middle: values.middle,
                    back: values.back
                }
            })
            setLoading(false)
            const rs = await scheduleService.getAllSchedules()
            setListSchedule(user?.role === "Operator"
                ? rs.filter((schedule: ISchedule) => schedule.busId.owner === user.owner)
                : rs
            );
            toast.success('Tạo lịch trình thành công');
        } catch (error) {
            console.log(error)
            setLoading(false)
            toast.error('Lỗi khi thêm lịch trình');
        }
    };

    const [searchQuery, setSearchQuery] = useState('');

    const filteredRoute = (schedule: ISchedule[]) => {
        return schedule.filter(schedule => {
            const { routeId, busId, endTime, startTime } = schedule;
            return (
                routeId?.origin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                routeId?.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                busId?.licensePlate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                endTime?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                startTime?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    };

    const { Option } = Select;

    return (
        <div>
            <Tabs
                defaultActiveKey="1"
                className="bg-white rounded-md px-4 w-full pb-4"
                items={[
                    {
                        label: <p className='w-1/3 font-semibold text-lg'>Danh sách lịch trình</p>,
                        key: '1',
                        children: (
                            <>
                                <Input
                                    placeholder="Tìm kiếm "
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="!p-3 !mb-3"
                                />
                                {listSchedule && (
                                    <Table
                                        dataSource={filteredRoute(listSchedule)}
                                        columns={columns}
                                        pagination={{ pageSize: 6 }}
                                        rowKey="_id"
                                    />
                                )}
                            </>
                        )
                    },
                    {
                        label: <p className='w-1/3 font-semibold text-lg'>Thêm lịch trình</p>,
                        key: '2',
                        children: (
                            <Form
                                form={form}
                                onFinish={onFinish}
                                layout='vertical'
                                className='w-1/2 !m-auto shadow-md rounded-md !px-5 !py-4'
                            >
                                <Form.Item
                                    label="Tuyến đường:"
                                    name="routeId"
                                    rules={[{ required: true, message: 'Vui lòng nhập điểm đi!' }]}
                                >
                                    <Select
                                        size='large'
                                        showSearch
                                        filterOption={(input, option) => {
                                            const children = option?.children
                                                ? React.Children.toArray(option.children as React.ReactNode).join('')
                                                : '';
                                            return children.toLowerCase().includes(input.toLowerCase());
                                        }}
                                    >
                                        {listRoute && listRoute.map((item, index) => (
                                            <Option key={index} value={item?._id}>
                                                {item?.origin} - {item?.destination}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Xe:"
                                    name="busId"
                                    rules={[{ required: true, message: 'Vui lòng chọn xe!' }]}
                                >
                                    <Select
                                        size='large'
                                        showSearch
                                        filterOption={(input, option) => {
                                            const children = option?.children
                                                ? React.Children.toArray(option.children as React.ReactNode).join('')
                                                : '';
                                            return children.toLowerCase().includes(input.toLowerCase());
                                        }}
                                    >
                                        {listBus && listBus.map((item, index) => (
                                            <Option key={index} value={item?._id}>
                                                {item?.licensePlate}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Thời gian xuất phát:"
                                    name="startTime"
                                    rules={[{ required: true, message: 'Vui lòng chọn thời gian xuất phát!' }]}
                                >
                                    <DatePicker
                                        format="YYYY-MM-DD HH:mm"
                                        showTime={{ defaultValue: dayjs('00:00', 'HH:mm') }}
                                        size='large'
                                        className='w-full'
                                        disabledDate={disabledDate}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Thời gian đến:"
                                    name="endTime"
                                    rules={[{ required: true, message: 'Vui lòng chọn thời gian đến!' }]}
                                >
                                    <DatePicker
                                        format="YYYY-MM-DD HH:mm"
                                        showTime={{ defaultValue: dayjs('00:00', 'HH:mm') }}
                                        size='large'
                                        className='w-full'
                                    />
                                </Form.Item>

                                <Row gutter={[16, 8]}>
                                    <Col span={8}>
                                        <Form.Item
                                            label="Giá ghế trước:"
                                            name="front"
                                            rules={[{ required: true, message: 'Vui lòng nhập giá cho tuyến Front!' }]}
                                        >
                                            <InputNumber min={0} size='large' className='w-full' />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            label="Giá ghế giữa:"
                                            name="middle"
                                            rules={[{ required: true, message: 'Vui lòng nhập giá cho tuyến Middle!' }]}
                                        >
                                            <InputNumber min={0} size='large' className='w-full' />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            label="Giá ghế sau:"
                                            name="back"
                                            rules={[{ required: true, message: 'Vui lòng nhập giá cho tuyến Back!' }]}
                                        >
                                            <InputNumber min={0} size='large' className='w-full' />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className='w-full' loading={loading}>
                                        Tạo mới
                                    </Button>
                                </Form.Item>
                            </Form>
                        )
                    }
                ]}
            />
            <Modal
                title="Chỉnh sửa lịch trình"
                open={isEditModalVisible}
                onOk={handleSaveChanges}
                onCancel={() => setIsEditModalVisible(false)}
                okText="Lưu thay đổi"
                cancelText="Hủy"
                loading={loading}
                closable={false}
            >
                <div>
                    <div className="mb-3">
                        <label htmlFor="code">Thời gian đi:</label>
                        <Input
                            id="startTime"
                            name="startTime"
                            value={scheduleForm.startTime}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor='name'>THời gian đến:</label>
                        <Input
                            id="endTime"
                            name="endTime"
                            value={scheduleForm.endTime}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </Modal>
            <Modal
                title="Xác nhận xóa voucher"
                open={confirmDelete}
                onOk={confirmDeleteSchedule}
                onCancel={cancelDeleteSchedule}
                okText="Xóa"
                cancelText="Hủy"
                closable={false}
                loading={loading}
            >
                <p>Bạn có chắc chắn muốn xóa mã khuyến mãi này không?</p>
            </Modal>
        </div>
    )
}

export default Schedule