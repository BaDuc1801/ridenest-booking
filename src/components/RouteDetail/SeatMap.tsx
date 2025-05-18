import { ISeat } from '@/services/scheduleService';
import React, { useState } from 'react'
import { PiArmchairFill, PiSteeringWheelFill } from 'react-icons/pi'
import { TbArmchair2, TbArmchair2Off } from 'react-icons/tb'

const Seat = ({ seat, handleSeatClick }: { seat: ISeat, handleSeatClick: (seatNumber: string) => void; }) => {
    const [isChoose, setIsChoose] = useState(false);

    const handleClick = () => {
        setIsChoose(pre => !pre);
    }

    let color = ''
    if (seat.location === 'front') color = 'text-purple-400'
    else if (seat.location === 'middle') color = 'text-orange-400'
    else if (seat.location === 'back') color = 'text-green-400'

    return (
        <div className={`text-3xl ${color} cursor-pointer`} onClick={() => {
            if (seat.isBooked) {
                handleSeatClick(seat.seatNumber);
                handleClick();
            } handleSeatClick(seat.seatNumber); handleClick()
        }}>
            {seat.isBooked ? <TbArmchair2Off className='text-gray-600' /> : (isChoose ? <PiArmchairFill className='text-green-500' /> : <TbArmchair2 />)}
        </div>
    )
}

const SeatMap = ({ seats, handleSeatClick }: { seats: ISeat[], handleSeatClick: (seatNumber: string) => void; }) => {
    const frontSeats = seats.filter(seat => seat.location === 'front')
    const middleSeats = seats.filter(seat => seat.location === 'middle')
    const backSeats = seats.filter(seat => seat.location === 'back')

    return (
        <div className='flex flex-col items-center bg-gray-100 p-5 rounded-lg'>

            <div className='grid grid-cols-3 gap-4 mb-4'>
                <p><PiSteeringWheelFill className='text-3xl' /></p>
                {frontSeats.map(seat => (
                    <Seat key={seat._id} seat={seat} handleSeatClick={handleSeatClick} />
                ))}
            </div>

            <div className='grid grid-cols-2 gap-x-[62px] gap-y-4 mb-4'>
                {middleSeats.map(seat => (
                    <Seat key={seat._id} seat={seat} handleSeatClick={handleSeatClick} />
                ))}
            </div>

            <div
                className={`grid ${backSeats.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                    } gap-4`}
            >
                {backSeats.map(seat => (
                    <Seat key={seat._id} seat={seat} handleSeatClick={handleSeatClick} />
                ))}
            </div>
        </div>
    )
}

export default SeatMap