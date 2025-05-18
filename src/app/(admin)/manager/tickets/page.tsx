'use client'

import { Button, Input, Modal, Table, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import { IoInformationCircle } from 'react-icons/io5'
import { FiXCircle } from 'react-icons/fi'
import userService, { IUser } from '@/services/userService'
import ticketService, { ITicket } from '@/services/ticketService'
import { IRoute } from '@/services/routeService'
import { ISchedule } from '@/services/scheduleService'
import { toast } from 'react-toastify'

const ListTicket = () => {
    const [listTicket, setListTicket] = useState<ITicket[]>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const [user, setUser] = useState<IUser>()

    const [waitingTickets, setWaitingTickets] = useState<ITicket[]>([]);
    const [completedTickets, setCompletedTickets] = useState<ITicket[]>([]);
    const [cancelledTickets, setCancelledTickets] = useState<ITicket[]>([]);

    const fetchData = async () => {
        const data = await ticketService.getAllTicket()
        const userData = await userService.getUserInformation();
        setUser(userData)
        if (userData?.role === "Operator") {
            const filteredData = data.filter((ticket: ITicket) => {
                return ticket?.scheduleId?.busId?.owner === userData?.owner;
            });
            setListTicket(filteredData);
            return;
        } else {
            setListTicket(data)
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

    useEffect(() => {
        if (listTicket.length) {
            const waiting = listTicket.filter(ticket => ticket.status === 'waiting' || ticket.status === 'booked');
            const completed = listTicket.filter(ticket => ticket.status === 'completed');
            const cancelled = listTicket.filter(ticket => ticket.status === 'cancelled');
            setWaitingTickets(waiting);
            setCompletedTickets(completed);
            setCancelledTickets(cancelled);
        }
    }, [listTicket]);

    const [modal, setModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<ITicket>();
    const [confirm, setConfirm] = useState(false);
    const [activeTab, setActiveTab] = useState('1');

    const columns = [
        {
            title: "Thời gian đặt",
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => {
                return <p>{new Date(text).toLocaleDateString('UTC')} - {new Date(text).toLocaleTimeString('UTC', { hour: '2-digit', minute: '2-digit' })}</p>
            }
        },
        {
            title: 'Điểm xuất phát',
            dataIndex: 'scheduleId',
            key: '_id',
            render: (text: { routeId: IRoute }) => {
                return <p>{text?.routeId?.origin}</p>
            }
        },
        {
            title: 'Điểm đến',
            dataIndex: 'scheduleId',
            key: '_id',
            render: (text: { routeId: IRoute }) => {
                return <p>{text?.routeId?.destination}</p>
            }
        },
        {
            title: 'Thời gian khởi hành',
            dataIndex: 'scheduleId',
            key: '_id',
            render: (text: ISchedule) => {
                return <p>{new Date(text.startTime).toLocaleDateString('UTC')} - {new Date(text.startTime).toLocaleTimeString('UTC', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</p>
            }
        },
        {
            title: 'Thời gian dự kiến đến nơi',
            dataIndex: 'scheduleId',
            key: '_id',
            render: (text: ISchedule) => {
                return <p>{new Date(text.endTime).toLocaleDateString('UTC')} - {new Date(text?.endTime).toLocaleTimeString('UTC', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</p>
            }
        },
        {
            title: "Tên khách",
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: "Email",
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: "Số điện thoại",
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Tình trạng',
            dataIndex: 'status',
            key: 'status',
            render: (text: string) => {
                if (text === "waiting") {
                    return <p className='text-orange-400 font-semibold'>Thanh toán trực tiếp</p>
                } else if (text === "booked") {
                    return <p className='text-green-500 font-semibold'>Đã thanh toán</p>
                } else if (text === "completed") {
                    return <p className='text-green-500 font-semibold'>Đã hoàn thành</p>
                } else {
                    return <p className='text-red-400 font-semibold'>Đã hủy</p>
                }
            }
        },
        {
            title: 'Chi tiết',
            dataIndex: '_id',
            key: '_id',
            render: (_blank: any, record: ITicket) => {
                return (
                    <p
                        className="cursor-pointer text-xl text-blue-900"
                        onClick={() => {
                            setSelectedTicket(record);
                            setModal(true);
                        }}
                    >
                        <IoInformationCircle />
                    </p>
                );
            },
        },
        ...((user?.role !== "Operator" && activeTab === '1') ? [{
            title: 'Hủy vé',
            dataIndex: 'status',
            render: (_blank: any, record: ITicket) => {
                return <p
                    className="cursor-pointer text-xl text-red-500"
                    onClick={() => {
                        setSelectedTicket(record);
                        setConfirm(true);
                    }}
                >
                    <FiXCircle />
                </p>
            }
        }] : []),
    ];

    const handleClose = () => {
        setModal(false);
        setSelectedTicket(undefined);
    };

    const handleCancelTicket = async () => {
        setLoading(true)
        if (selectedTicket?._id) {
            await ticketService.cancelTicket(selectedTicket._id);
        }
        fetchData();
        setConfirm(false);
        setLoading(false)
        toast.success("Hủy vé thành công")
    };

    const [searchQuery, setSearchQuery] = useState('');

    const filteredTickets = (tickets: ITicket[]) => {
        return tickets.filter(ticket => {
            const { username, email, phoneNumber, createdAt, scheduleId } = ticket;
            const createdAtString = createdAt ? new Date(createdAt).toLocaleDateString() + " " + new Date(createdAt).toLocaleTimeString() : '';
            const scheduleStartTimeString = scheduleId?.startTime ? new Date(scheduleId.startTime).toLocaleDateString('UTC') + " - " + new Date(scheduleId?.startTime).toLocaleTimeString('UTC', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) : '';
            const scheduleEndTimeString = scheduleId?.endTime ? new Date(scheduleId.endTime).toLocaleDateString('UTC') + " - " + new Date(scheduleId?.endTime).toLocaleTimeString('UTC', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) : '';

            return (
                username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                createdAtString?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                scheduleStartTimeString?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                scheduleEndTimeString?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    };

    return (
        <div className=' bg-[#F2F4F7] max-md:pb-[100px]'>
            <Input
                placeholder="Tìm kiếm "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="!p-3"
            />
            <Tabs
                defaultActiveKey='1'
                onChange={setActiveTab}
                className='bg-white rounded-md px-4 pb-4'
                items={[
                    {
                        key: '1',
                        label: <p className='w-1/3 font-semibold text-lg'>Hiện tại</p>,
                        children: waitingTickets && <Table dataSource={filteredTickets(waitingTickets)} columns={columns} pagination={{ pageSize: 4 }} rowKey="_id" />,
                    },
                    {
                        key: '2',
                        label: <p className='w-1/3 font-semibold text-lg'>Đã đi</p>,
                        children: completedTickets && <Table dataSource={filteredTickets(completedTickets)} columns={columns} pagination={{ pageSize: 4 }} rowKey="_id" />,
                    },
                    {
                        key: '3',
                        label: <p className='w-1/3 font-semibold text-lg'>Đã hủy</p>,
                        children: cancelledTickets && <Table dataSource={filteredTickets(cancelledTickets)} columns={columns} pagination={{ pageSize: 4 }} rowKey="_id" />,
                    },
                ]}
            />
            <Modal
                title="Xác nhận hủy vé"
                open={confirm}
                onCancel={() => setConfirm(false)}
                closable={false}
                footer={[
                    <Button key="cancel" onClick={() => setConfirm(false)}>
                        Hủy
                    </Button>,
                    <Button
                        key="confirm"
                        type="primary"
                        onClick={handleCancelTicket}
                        loading={loading}
                    >
                        Xác nhận
                    </Button>,
                ]}
            >
                <p>Bạn có chắc chắn muốn hủy vé này không?</p>
            </Modal>
            <Modal
                title="Chi tiết Vé"
                open={modal}
                closable={false}
                footer={[
                    <Button key="ok" type="primary" onClick={handleClose}>
                        Xong
                    </Button>,
                ]}
            >
                {selectedTicket && (
                    <>
                        <div className='flex items-center justify-center gap-5'>
                            <div>
                                <div className='pl-4'>
                                    <p>Thời gian: {new Date(selectedTicket?.scheduleId.startTime).toLocaleTimeString()} - {new Date(selectedTicket?.scheduleId.startTime).toLocaleDateString()}</p>
                                    <p>Địa điểm: {selectedTicket?.scheduleId?.routeId?.origin} - {selectedTicket?.scheduleId?.routeId?.destination}</p>
                                    <p>Xe: {selectedTicket?.scheduleId?.busId?.licensePlate}</p>
                                    <p>Loại xe: {selectedTicket?.scheduleId?.busId?.totalSeats} chỗ</p>
                                    <p>Số ghế: {selectedTicket?.seatNumbers.join(', ')}</p>
                                </div>
                            </div>
                        </div>
                        <div className='text-end w-full mt-3 text-lg'>Tổng thanh toán: {selectedTicket?.price.toLocaleString()}đ</div>
                    </>
                )}
            </Modal>
        </div>
    )
}

export default ListTicket