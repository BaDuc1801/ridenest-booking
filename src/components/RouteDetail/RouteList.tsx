'use client'

import { setBookingDate, setDestination, setOrigin, setTripType } from '@/redux/searchStore'
import { IRoute } from '@/services/routeService'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const ListRoute = () => {
    const listRoutes = useSelector((state:  { route: { list: IRoute[] } }) => state.route.list)
    const dispatch = useDispatch()
    const router = useRouter()

    const handleClick = (item : IRoute) => {
        dispatch(setOrigin(item.origin))
        dispatch(setDestination(item.destination))
        dispatch(setTripType(0))
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const formattedDate = tomorrow.toISOString().split('T')[0];
        dispatch(setBookingDate(formattedDate));
        router.push("/route-details")
    }

    return (
        <div className=''>
            <p className='text-2xl font-semibold'>Tuyến đường phổ biến</p>
            <div className="flex overflow-x-auto whitespace-nowrap gap-4 p-4 snap-x snap-mandatory">
                {listRoutes && listRoutes?.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="h-68 max-md:h-48 max-md:w-[210px] w-[350px] flex-shrink-0 rounded-lg shadow-lg bg-white flex flex-col overflow-hidden snap-start cursor-pointer pb-1"
                            onClick={() => handleClick(item)}
                        >
                            <img
                                src={item?.img}
                                alt={`${item.origin} - ${item.destination}`}
                                className="w-full h-44 object-cover max-md:h-[100px]"
                            />
                            <div className="p-2 flex flex-col justify-between h-full">
                                <p className="font-semibold text-lg text-gray-800">
                                    {item?.origin} - {item?.destination}
                                </p>
                                <p className="text-gray-600 text-md">
                                    Từ{" "}
                                    {item?.afterDiscount ?
                                        (<>
                                            <span className="text-red-500 font-bold text-lg">
                                                {item?.afterDiscount?.toLocaleString("vi-VN")} đ
                                            </span>
                                            <span className="line-through text-gray-400 text-md ml-2">
                                                {item?.basisPrice?.toLocaleString("vi-VN")} đ
                                            </span></>)
                                        : <span className="text-red-500 font-bold text-lg">
                                            {item?.basisPrice?.toLocaleString("vi-VN")} đ
                                        </span>
                                    }
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default ListRoute
