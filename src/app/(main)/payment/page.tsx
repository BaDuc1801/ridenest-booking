'use client'

import { Button, Radio, Input, Form, Modal } from 'antd';
import React, { useEffect, useState } from 'react'
import { BsShieldFillCheck } from 'react-icons/bs';
import { RiDiscountPercentFill } from 'react-icons/ri';
import { FaCircleCheck } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { ISearch } from '@/redux/searchStore';
import { IVoucher } from '@/services/voucherService';
import userService, { IUser } from '@/services/userService';
import scheduleService from '@/services/scheduleService';
import ticketService from '@/services/ticketService';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Payment = () => {
    const listVoucher = useSelector((state: { voucher: { list: IVoucher[] } }) => state.voucher.list)
    const search = useSelector((state: { search: ISearch }) => state.search)
    const user = useSelector((state: { user: IUser }) => state.user)
    const [selectedVoucher, setSelectedVoucher] = useState<IVoucher | null>(null);
    const [modal, setModal] = useState(false);
    const [qr, setqr] = useState(false);
    const [loading, isLoading] = useState<boolean>(false)

    const totalPrice = (isNaN(search.ticketPrice.departurePrice) ? 0 : search.ticketPrice.departurePrice) + (isNaN(search.ticketPrice.returnPrice) ? 0 : search.ticketPrice.returnPrice);
    const [total, setTotalPrice] = useState(totalPrice);

    const router = useRouter()

    const [form] = Form.useForm();

    useEffect(() => {
        if (!userService.getAccessToken()) {
            router.push("/")
        }
        form.setFieldsValue({
            username: user?.username || '',
            email: user?.email || '',
            phoneNumber: user?.phoneNumber || ''
        })
    }, [user])

    const onFinish = async (value: { email: string, username: string, phoneNumber: string, paymentMethod: string }) => {
        isLoading(true);
        if (search.departure) {
            await scheduleService.bookSeat({ scheduleId: search.departure.scheduleId, seatNumber: search.departure.seatNumber });
        }
        if (value.paymentMethod === "direct") {
            if (search.return && search.departure) {
                await scheduleService.bookSeat({ scheduleId: search.return.scheduleId, seatNumber: search.return.seatNumber });
                await ticketService.postTicket({ email: value.email, username: value.username, status: "waiting", phoneNumber: value.phoneNumber, price: search.ticketPrice.departurePrice, userId: user._id, paymentMethod: "direct", voucher: selectedVoucher?._id, scheduleId: search.departure.scheduleId, seatNumbers: search.departure.seatNumber });
                await ticketService.postTicket({ email: value.email, username: value.username, status: "waiting", phoneNumber: value.phoneNumber, price: search.ticketPrice.departurePrice, userId: user._id, paymentMethod: "direct", voucher: selectedVoucher?._id, scheduleId: search.return.scheduleId, seatNumbers: search.return.seatNumber, });
            } else {
                if (search.departure) {
                    await ticketService.postTicket({ email: value.email, username: value.username, status: "waiting", phoneNumber: value.phoneNumber, price: total, userId: user._id, paymentMethod: "direct", voucher: selectedVoucher?._id, scheduleId: search.departure.scheduleId, seatNumbers: search.departure.seatNumber, });
                }
            }
            setModal(pre => !pre);
        } else {
            if (search.return && search.departure) {
                await scheduleService.bookSeat({ scheduleId: search.return.scheduleId, seatNumber: search.return.seatNumber });
                await ticketService.postTicket({ email: value.email, username: value.username, status: "booked", phoneNumber: value.phoneNumber, price: search.ticketPrice.departurePrice, userId: user._id, paymentMethod: "bank", voucher: selectedVoucher?._id, scheduleId: search.departure.scheduleId, seatNumbers: search.departure.seatNumber });
                await ticketService.postTicket({ email: value.email, username: value.username, status: "booked", phoneNumber: value.phoneNumber, price: search.ticketPrice.departurePrice, userId: user._id, paymentMethod: "bank", voucher: selectedVoucher?._id, scheduleId: search.return.scheduleId, seatNumbers: search.return.seatNumber, });
            } else {
                if (search.departure) {
                    await ticketService.postTicket({ email: value.email, username: value.username, status: "booked", phoneNumber: value.phoneNumber, price: total, userId: user._id, paymentMethod: "bank", voucher: selectedVoucher?._id, scheduleId: search.departure.scheduleId, seatNumbers: search.departure.seatNumber, })
                }
            }
            setqr(pre => !pre);
        }
        isLoading(false);
    }

    const applyVoucher = (voucher: IVoucher) => {
        if (!voucher) return;

        let newTotal = totalPrice;

        if (voucher.discountType === 'percent') {
            newTotal -= (newTotal * (voucher.discount / 100));
        }

        if (voucher.discountType === 'fixed') {
            newTotal -= voucher.discount;
        }

        if (newTotal < 0) newTotal = 0;

        setSelectedVoucher(voucher);
        setTotalPrice(newTotal);
    };


    const onClickModal = () => {
        setModal(pre => !pre);
        router.push("/")
    }


    const onClickqr = () => {
        setqr(pre => !pre);
        setsuccess(pre => !pre);
    }

    const [success, setsuccess] = useState(false);
    const onClicksuccess = () => {
        setsuccess(pre => !pre);
        router.push("/")
    }

    return (
        <div className='bg-[#F2F4F7] flex justify-center gap-10 pt-10 max-md:flex-col-reverse max-md:pb-[100px] max-md:gap-3 max-md:pt-3 max-md:px-3 md:pb-[50px]'>
            <div className='flex-flex-col'>
                <div className='bg-white pt-5 px-5 rounded-md shadow-md'>
                    <p className='text-xl font-semibold text-center'>Thông tin liên hệ</p>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        layout='vertical'
                        className='bg-white md:w-[500px] !p-5 rounded-lg'
                    >
                        <Form.Item
                            label="Họ và tên"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập họ tên của bạn!',
                                }
                            ]}
                        >
                            <Input placeholder='Nhập họ tên của bạn' defaultValue="a" />
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email của bạn!',
                                },
                                {
                                    type: 'email',
                                    message: 'Vui lòng nhập một địa chỉ email hợp lệ!',
                                }
                            ]}
                        >
                            <Input placeholder="Nhập email" />
                        </Form.Item>
                        <Form.Item
                            label="Số điện thoại"
                            name="phoneNumber"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng số điện thoại của bạn!',
                                },
                            ]}
                        >
                            <Input placeholder="Nhập số điện thoại của bạn" />
                        </Form.Item>
                        <div className='flex items-center gap-3 border-2 border-green-500 rounded-md px-3 py-2 mb-4 bg-green-50'>
                            <BsShieldFillCheck className='text-green-500 text-2xl' />
                            <p className='font-semi'>Số điện thoại và email được sử dụng để gửi thông tin đơn hàng và liên hệ khi cần thiết.</p>
                        </div>
                        <Form.Item
                            label="Lựa chọn phương thức thanh toán"
                            name="paymentMethod"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn phương thức thanh toán!',
                                }
                            ]}
                        >
                            <Radio.Group className='flex flex-col gap-3 mt-2'>
                                <Radio value="direct">Thanh toán trực tiếp</Radio>
                                <Radio value="bank">Chuyển khoản ngân hàng</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className='w-full !py-4' loading={loading}>
                                Thanh toán
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

            </div>
            <div className='bg-white pt-5 px-5 rounded-md shadow-md flex flex-col gap-2 md:w-[550px]'>
                <p className='text-xl font-semibold'>Thông tin chi tiết chuyến đi {search.return ? `${search.destination} - ${search.origin}` : `${search.origin} - ${search.destination}`}</p>
                <div className='md:flex md:items-center md:gap-7 md:pb-2'>
                    <div>
                        <p className='text-lg'>Chiều đi: </p>
                        <div className=''>
                            <p>Thời gian đi: {search?.departure?.startTime ? (new Date(search.departure.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + " - " + new Date(search.departure.startTime).toLocaleDateString()) : ''}</p>
                            <p>Thời gian đến: {search?.departure?.endTime ? (new Date(search.departure.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + " - " + new Date(search.departure.endTime).toLocaleDateString()) : ''}</p>
                            <p>Xe: {search.departure?.licensePlate}</p>
                            <p>Loại xe: {search.departure?.totalSeats} chỗ</p>
                            <p>Số ghế: {search.departure?.seatNumber.join(', ')}</p>
                            <p className='font-semibold '>Tổng:<span className='text-blue-500 ml-2'>{search.ticketPrice.departurePrice?.toLocaleString()}đ</span> </p>
                        </div>
                    </div>
                    {
                        search.return && (
                            <div className='flex flex-col'>
                                <p className='text-lg'>Chiều về: </p>
                                <div className=''>
                                    <p>Thời gian đi: {search?.return?.startTime ? (new Date(search.return.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + " - " + new Date(search.return.startTime).toLocaleDateString()) : ''}</p>
                                    <p>Thời gian đến: {search?.return?.endTime ? (new Date(search.return.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + " - " + new Date(search.return.endTime).toLocaleDateString()) : ''}</p>
                                    <p>Xe: {search.return?.licensePlate}</p>
                                    <p>Loại xe: {search.return?.totalSeats} chỗ</p>
                                    <p>Số ghế: {search.return?.seatNumber.join(', ')}</p>
                                    <p className='font-semibold '>Tổng:<span className='text-blue-500 ml-2'>{search.ticketPrice.returnPrice?.toLocaleString()}đ</span> </p>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div>
                    <div className='border-t-2 py-2 flex items-center justify-between'>
                        <p className='font-semibold'>Tổng tiền:</p>
                        <p className='text-blue-500 font-semibold text-lg'>{totalPrice.toLocaleString()}đ</p>
                    </div>
                    <div className='border-t-2 py-2 flex items-center justify-between'>
                        <p className='font-semibold'>Mã áp dụng:</p>
                        <p className='font-semibold'>{selectedVoucher?.code}</p>
                    </div>
                    <div className='border-t-2 py-2 flex items-center justify-between'>
                        <p className='font-semibold'>Tổng thanh toán:</p>
                        <p className='text-blue-500 font-semibold text-xl'>{total.toLocaleString()}đ</p>
                    </div>
                </div>
                <div>
                    <p className='text-xl font-semibold border-t-2 pt-2'>Danh sách khuyến mãi</p>
                    <div className="flex overflow-x-auto whitespace-nowrap gap-4 p-4 snap-x snap-mandatory">
                        {listVoucher && listVoucher.map((item, index) => {
                            return (
                                <div key={index} className={`border-2 rounded-md shadow-md p-1 cursor-pointer ${selectedVoucher === item
                                    ? 'border-4 border-blue-500'
                                    : ''
                                    }`}
                                    onClick={() => applyVoucher(item)}>
                                    <div className="flex items-center justify-center h-full">
                                        <div className='bg-[#fef32a] w-[70px] h-full rounded-md flex items-center justify-center'>
                                            <RiDiscountPercentFill className='text-4xl' />
                                        </div>
                                        <div className='text-sm pl-2 pr-1'>
                                            <p className='text-blue-600 font-semibold'>Thanh toán</p>
                                            <p className='font-bold text-md'>{item.name}</p>
                                            <p>HSD: <span className='font-semibold'>{item?.expiryDate ? new Date(item.expiryDate).toLocaleDateString('vi-VN') : 'N/A'}</span> </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <Modal
                open={modal} centered onCancel={onClickModal}
                footer={
                    <Button type="primary" onClick={onClickModal} className='w-full font-semibold bg-yellow-400 text-black hover:!bg-yellow-300 hover:!text-black'>
                        Xác nhận
                    </Button>
                }>
                <p className='font-bold text-lg text-center flex items-center justify-center gap-3'><FaCircleCheck className='text-xl text-green-600' />
                    Bạn đã đặt vé thành công!</p>
            </Modal>
            <Modal
                open={qr}
                closable={false}
                centered
                footer={
                    <Button className='w-full' onClick={onClickqr}>Thanh toán</Button>
                }>
                <div className="relative h-[500px]">
                    <Image alt='bg' src="/qr.jpg" className='h-full' fill={true} priority></Image>
                </div>
            </Modal>
            <Modal
                open={success} centered onCancel={onClicksuccess}
                footer={
                    <Button type="primary" onClick={onClicksuccess} className='w-full font-semibold bg-yellow-400 text-black hover:!bg-yellow-300 hover:!text-black'>
                        Xác nhận
                    </Button>
                }>
                <p className='font-bold text-lg text-center flex items-center justify-center gap-3'><FaCircleCheck className='text-xl text-green-600' />
                    Bạn đã thanh toán thành công!</p>
            </Modal>
        </div>
    )
}

export default Payment