'use client'

import { Button, Form, Input, Modal, Rate, Table, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import { IoInformationCircle } from 'react-icons/io5'
import { FiXCircle } from 'react-icons/fi'
import { GoCodeReview } from 'react-icons/go'
import ticketService, { ITicket } from '@/services/ticketService'
import { IRoute } from '@/services/routeService'
import { ISchedule } from '@/services/scheduleService'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import userService, { IUser } from '@/services/userService'
import { useRouter } from 'next/navigation'

const UserStorage = () => {
    const [listTicket, setListTicket] = useState<ITicket[]>([]);
    const [loading, setLoading] = useState<boolean>(false)

    const [waitingTickets, setWaitingTickets] = useState<ITicket[]>([]);
    const [completedTickets, setCompletedTickets] = useState<ITicket[]>([]);
    const [cancelledTickets, setCancelledTickets] = useState<ITicket[]>([]);

    const user = useSelector((state: { user: IUser }) => state.user)
    const router = useRouter()

    const fetchData = async () => {
        const data = await ticketService.getTicketByUserId();
        setListTicket(data);
    }

    useEffect(() => {
        if (!userService.getAccessToken()) {
            router.push("/")
        } else {
            fetchData()
        }
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
    const [review, setReview] = useState(false);
    const [activeTab, setActiveTab] = useState('1');

    const columns = [
        {
            title: "Thời gian đặt",
            dataIndex: 'createdAt',
            render: (text: string) => {
                return <p>{new Date(text).toLocaleDateString('UTC')} - {new Date(text).toLocaleTimeString('UTC', { hour: '2-digit', minute: '2-digit' })}</p>
            }
        },
        {
            title: 'Điểm xuất phát',
            dataIndex: 'scheduleId',
            render: (text: { routeId: IRoute }) => {
                return <p>{text?.routeId?.origin}</p>
            }
        },
        {
            title: 'Điểm đến',
            dataIndex: 'scheduleId',
            render: (text: { routeId: IRoute }) => {
                return <p>{text?.routeId?.destination}</p>
            }
        },
        {
            title: 'Thời gian khởi hành',
            dataIndex: 'scheduleId',
            render: (text: ISchedule) => {
                return <p>{new Date(text.startTime).toLocaleDateString('UTC')} - {new Date(text.startTime).toLocaleTimeString('UTC', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</p>
            }
        },
        {
            title: 'Thời gian dự kiến đến nơi',
            dataIndex: 'scheduleId',
            key: '_id',
            render: (text: ISchedule) => {
                return <p>{new Date(text.endTime).toLocaleDateString('UTC')} - {new Date(text.endTime).toLocaleTimeString('UTC', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</p>
            }
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
            render: (_blank: unknown, record: ITicket) => {
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
        ...(activeTab === '1' ? [{
            title: 'Hủy vé',
            dataIndex: 'status',
            render: (text: string, record: ITicket) =>
                text === 'waiting' ? (
                    <p
                        className="cursor-pointer text-xl text-red-500"
                        onClick={() => {
                            setSelectedTicket(record);
                            setConfirm(true);
                        }}
                    >
                        <FiXCircle />
                    </p>
                ) : null,
        }] : []),
        ...(activeTab === '2' ? [{
            title: 'Đánh giá',
            dataIndex: 'hasReviewed',
            render: (text: string, record: ITicket) => {
                return (!text ? <p onClick={() => {
                    setSelectedTicket(record);
                    setReview(true);
                }}><GoCodeReview className='text-xl cursor-pointer' /></p> : "")
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


    const [rating, setRating] = useState(0);
    const [reviewContent, setReviewContent] = useState('');

    const handleReviewSubmit = async () => {
        setLoading(true)
        if (selectedTicket) {
            const newReview = {
                rating: rating,
                content: reviewContent,
                ticketId: selectedTicket._id,
                userId: user,
                busId: selectedTicket.scheduleId.busId._id
            };
            await ticketService.addReview(newReview)
        }
        toast.success("Đánh giá chuyến xe thành công")
        setLoading(false)
        setReview(false);
        fetchData();
    };

    return (
        <div className='flex justify-center items-center h-[calc(100vh-72px)] bg-[#F2F4F7] max-md:pb-[100px]'>
            <Tabs
                defaultActiveKey='1'
                onChange={setActiveTab}
                className='bg-white rounded-md px-4 w-[70%] pb-4'
                items={[
                    {
                        key: '1',
                        label: <p className='w-1/3 font-semibold text-lg'>Hiện tại</p>,
                        children: listTicket && <Table dataSource={waitingTickets} columns={columns} pagination={{ pageSize: 4 }} rowKey="_id" />,
                    },
                    {
                        key: '2',
                        label: <p className='w-1/3 font-semibold text-lg'>Đã đi</p>,
                        children: listTicket && <Table dataSource={completedTickets} columns={columns} pagination={{ pageSize: 4 }} rowKey="_id" />,
                    },
                    {
                        key: '3',
                        label: <p className='w-1/3 font-semibold text-lg'>Đã hủy</p>,
                        children: listTicket && <Table dataSource={cancelledTickets} columns={columns} pagination={{ pageSize: 4 }} rowKey="_id" />,
                    },
                ]}
            />

            <Modal
                title="Xác nhận hủy vé"
                open={confirm}
                onCancel={() => setConfirm(false)}
                footer={[
                    <Button key="cancel" onClick={() => setConfirm(false)}>
                        Hủy
                    </Button>,
                    <Button
                        key="confirm"
                        type="primary"
                        loading={loading}
                        onClick={handleCancelTicket}
                    >
                        Xác nhận
                    </Button>,
                ]}
            >
                <p>Bạn có chắc chắn muốn hủy vé này không?</p>
            </Modal>
            <Modal
                title="Đánh giá chuyến đi"
                open={review}
                onCancel={() => setReview(false)}
                footer={[
                    <Button key="cancel" onClick={() => setReview(false)}>
                        Hủy
                    </Button>,
                    <Button
                        key="confirm"
                        type="primary"
                        loading={loading}
                        onClick={handleReviewSubmit}
                    >
                        Đăng
                    </Button>,
                ]}
            >
                <Form
                    layout="vertical"
                >
                    <Form.Item label="Đánh giá sao" name="rating">
                        <Rate value={rating} onChange={setRating} />
                    </Form.Item>
                    <Form.Item label="Nhận xét" name="review">
                        <Input.TextArea
                            rows={4}
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                        />
                    </Form.Item>
                </Form>
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
        </div >
    )
}

export default UserStorage