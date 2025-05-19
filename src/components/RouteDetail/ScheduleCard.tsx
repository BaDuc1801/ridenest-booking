import { Button, Carousel, Modal, Timeline } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { FaCircleDot, FaLocationDot } from 'react-icons/fa6'
import { PiArmchairFill } from 'react-icons/pi'
import { TbArmchair2, TbArmchair2Off } from 'react-icons/tb'
import { ISchedule, ISeat } from '@/services/scheduleService'
import SeatMap from './SeatMap'
import { useDispatch, useSelector } from 'react-redux'
import { resetTrip, ISearch, setDeparture, setDestination, setOrigin, setReturn, setTicketDeparturePrice, setTicketReturnPrice } from '@/redux/searchStore'
import { useRouter } from 'next/navigation'
import userService from '@/services/userService'
import Link from 'next/link'
import ReviewCard from './ReviewCard'

const ScheduleCard = ({ item }: { item: ISchedule }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [visible, setVisiblee] = useState(false)
    const [more, setMore] = useState(false)
    const [rv, setRv] = useState(false)
    const [login, setLogin] = useState<boolean>(false)
    const [warning, setWarning] = useState(false)
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const dispatch = useDispatch()
    const router = useRouter()

    const search = useSelector((state: { search: ISearch }) => state.search);

    const toggleModal = () => {
        setVisiblee(prevVisible => !prevVisible)
    }

    const onClickButton = () => {
        setMore(pre => !pre)
    }

    const onClickReview = () => {
        setRv(pre => !pre)
    }

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index)
    }

    const handleSeatClick = (seatNumber: string) => {
        setSelectedSeats(prevSelectedSeats => {
            const updatedSeats = prevSelectedSeats.includes(seatNumber)
                ? prevSelectedSeats.filter(seat => seat !== seatNumber)
                : [...prevSelectedSeats, seatNumber];

            return updatedSeats.sort((a, b) => {
                const numA = parseInt(a.slice(1), 10);
                const numB = parseInt(b.slice(1), 10);
                return numA - numB;
            });
        });
    };

    const calculateTotalPrice = () => {
        return selectedSeats.reduce((total, seatNumber) => {
            const seat = item?.seats.find((seat: ISeat) => seat.seatNumber === seatNumber);
            return seat ? total + seat.price : total;
        }, 0);
    };

    const totalPrice = calculateTotalPrice();

    const onLogin = () => {
        setLogin(pre => !pre);
    }

    const previousTripType = useRef<number | null>(null);

    useEffect(() => {
        if (previousTripType.current !== null && previousTripType.current !== search.tripType) {
            dispatch(resetTrip());
        }
        previousTripType.current = search.tripType;
    }, [search.tripType]);

    const onClickNext = () => {
        const auth = userService.getAccessToken();
        if (!auth) {
            setLogin(true);
            return
        }
        if (selectedSeats.length === 0) {
            setWarning(pre => !pre);
            return;
        }
        if (search.tripType === 0) {
            dispatch(setDeparture({
                scheduleId: item._id,
                startTime: item.startTime,
                endTime: item.endTime,
                busId: item.busId._id,
                licensePlate: item.busId.licensePlate,
                totalSeats: item.busId.totalSeats,
                seatNumber: selectedSeats
            }))
            dispatch(setTicketDeparturePrice(totalPrice))
            router.push("/payment")
        }
        else if (search.tripType === 1 && !search.departure) {
            dispatch(setDeparture({
                scheduleId: item._id,
                startTime: item.startTime,
                endTime: item.endTime,
                busId: item.busId._id,
                licensePlate: item.busId.licensePlate,
                totalSeats: item.busId.totalSeats,
                seatNumber: selectedSeats
            }))
            const temp_origin: string = search.origin
            const temp_destination: string = search.destination
            dispatch(setDestination(temp_origin))
            dispatch(setOrigin(temp_destination))
            dispatch(setTicketDeparturePrice(totalPrice))
            router.push("/route-details")
        } else {
            dispatch(setReturn({
                scheduleId: item._id,
                startTime: item.startTime,
                endTime: item.endTime,
                busId: item.busId._id,
                licensePlate: item.busId.licensePlate,
                totalSeats: item.busId.totalSeats,
                seatNumber: selectedSeats
            }))
            dispatch(setTicketReturnPrice(totalPrice))
            router.push("/payment")
        }
    };

    return (
        <div className='bg-white rounded-md shadow-md px-3 max-sm:w-[90%]'>
            <div className='flex max-sm:flex-col gap-5 pt-3'>
                <div className='flex gap-5'>
                    <img
                        src={item?.busId?.img[3]}
                        className='w-44 h-44 sm:w-40 sm:h-40 max-sm:m-auto'
                        onClick={toggleModal}
                    ></img>
                    <div className='font-semibold max-sm:m-auto'>
                        <p className='text-lg'>{item?.busId?.owner}</p>
                        <p className='text-gray-600'>
                            Limousine {item?.busId?.totalSeats} chỗ{' '}
                        </p>
                        <p className='text-gray-600 mb-2 mt-1'>{new Date(item?.startTime).toLocaleDateString('vi-VN')}</p>
                        <Timeline
                            className='h-[90px]'
                            items={[
                                {
                                    children: (
                                        <p className='text-lg'>{new Date(item?.startTime).toLocaleTimeString('UTC', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</p>
                                    ),
                                    dot: <FaCircleDot className='text-md mt-1' />
                                },
                                {
                                    children: (
                                        <p className='text-lg'>{new Date(item?.endTime).toLocaleTimeString('UTC', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</p>
                                    ),
                                    dot: <FaLocationDot className='text-lg mt-1' />
                                }
                            ]}
                        />
                    </div>
                </div>
                <div className='flex justify-between sm:flex-col mb-5 sm:items-end items-center max-sm:px-5'>
                    <p className='text-[#1677ff] font-bold text-xl'>
                        Từ {item?.seats[0]?.price.toLocaleString()}đ
                    </p>
                    <div className='flex flex-col items-end gap-2'>
                        <p className='font-semibold text-gray-600'>
                            Còn {item?.availableSeats} chỗ trống
                        </p>
                        <div className='flex gap-4 items-center'>
                            <p className='text-[#1677ff] cursor-pointer underline' onClick={onClickReview}>
                                Xem đánh giá
                            </p>
                            <button
                                className={`font-semibold p-2 rounded-md text-md w-[125px] ${!more
                                    ? 'bg-yellow-400 hover:bg-yellow-300'
                                    : 'bg-gray-400 hover:bg-gray-300'
                                    }`}
                                onClick={onClickButton}
                            >
                                {!more ? 'Chọn chuyến' : 'Hủy'}
                            </button>
                        </div>
                    </div>
                </div>
                <Modal open={visible} onCancel={toggleModal} footer={null}>
                    <div className='h-[320px]'>
                        <img
                            src={item?.busId?.img[selectedImageIndex]}
                            className='w-full h-full'
                        />
                    </div>
                    <Carousel
                        dots={false}
                        arrows
                        infinite={false}
                        slidesToShow={3}
                        slidesToScroll={1}
                    >
                        {item?.busId?.img.map((image: string, index: number) => (
                            <div
                                className='h-36 p-2 mt-2'
                                onClick={() => handleImageClick(index)}
                                key={index}
                            >
                                <img
                                    className={`w-full h-full ${selectedImageIndex === index
                                        ? 'border-4 border-blue-500'
                                        : ''
                                        }`}
                                    key={index}
                                    src={image}
                                />
                            </div>
                        ))}
                    </Carousel>
                </Modal>
            </div>
            {more && (
                <>
                    <div className='border-t-2 flex items-center justify-between'>
                        <div className='flex flex-col gap-3 pb-5 px-5 pt-2'>
                            <p>Chú thích</p>
                            <div className='flex items-center gap-3'>
                                <TbArmchair2Off className='text-3xl text-gray-600' /> Ghế không bán
                            </div>
                            <div className='flex items-center gap-3'>
                                <PiArmchairFill className='text-3xl text-green-500' /> Đang chọn
                            </div>
                            <div className='flex items-center gap-3'>
                                <TbArmchair2 className='text-3xl text-green-400' />
                                <div>
                                    <p>Ghế đầu</p>{' '}
                                    <p className='font-semibold'>{item?.seats[0]?.price}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <TbArmchair2 className='text-3xl text-orange-400' />
                                <div>
                                    <p>Ghế giữa</p>{' '}
                                    <p className='font-semibold'>{item?.seats[4]?.price}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <TbArmchair2 className='text-3xl text-purple-400' />
                                <div>
                                    <p>Ghế cuối</p>{' '}
                                    <p className='font-semibold'>
                                        {item?.seats[item?.seats.length - 1]?.price}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <SeatMap seats={item?.seats} handleSeatClick={handleSeatClick} />
                        </div>
                    </div>
                    <div className='border-t-2 flex items-center justify-between py-5'>
                        <p>Ghế: <span className='text-[#1677ff] font-bold'>{selectedSeats.join(', ')}</span></p>
                        <div className='flex items-center gap-3'>
                            <p>Tổng cộng: <span className='text-[#1677ff] font-bold'>{totalPrice.toLocaleString()}đ</span></p>
                            <button className='bg-[#1677ff] text-white py-2 px-3 rounded-md hover:bg-blue-500'
                                onClick={onClickNext}
                            >Tiếp tục</button>
                        </div>
                        {warning && <Modal
                            open={warning}
                            centered
                            footer={
                                <Button
                                    onClick={() => setWarning(pre => !pre)}
                                    type="primary" className='w-full font-semibold bg-yellow-400 text-black hover:!bg-yellow-300 hover:!text-black'>
                                    Đã hiểu
                                </Button>
                            }>
                            <p className='font-bold text-lg text-center'>Vui lòng chọn ít nhất 1 chỗ ngồi</p>
                        </Modal>
                        }
                        <Modal
                            open={login}
                            onCancel={onLogin}
                            centered
                            footer={
                                <>
                                    <Button
                                        onClick={onLogin}
                                    >
                                        Hủy
                                    </Button>
                                    <Button type="primary" className='font-semibold bg-yellow-400 text-black hover:!bg-yellow-300 hover:!text-black'>
                                        <Link href="/login">
                                            Đăng nhập
                                        </Link>
                                    </Button>
                                </>
                            }>
                            <p className='font-bold text-lg text-center'>Bạn cần đăng nhập để có thể đặt vé</p>
                        </Modal>
                    </div>
                </>
            )}
            {
                rv && <ReviewCard busId={item?.busId?._id} />
            }
        </div>
    )
}

export default ScheduleCard