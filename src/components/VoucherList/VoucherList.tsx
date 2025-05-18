'use client'

import { IVoucher } from '@/services/voucherService';
import React from 'react'
import { RiDiscountPercentFill } from 'react-icons/ri';
import { useSelector } from 'react-redux';

const ListVoucher = () => {
    const listVouchers = useSelector((state: { voucher: { list: IVoucher[] } }) => state.voucher.list)

    return (
        <div className=''>
            <p className='text-2xl font-semibold'>Khuyến mãi không thể bỏ lỡ</p>
            <div className="flex overflow-x-auto whitespace-nowrap gap-4 p-4 snap-x snap-mandatory">
                {listVouchers && listVouchers?.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="max-md:h-40 max-md:w-[220px] w-[300px] flex-shrink-0 rounded-lg shadow-lg bg-white flex flex-col overflow-hidden snap-start cursor-pointer pb-1"
                        >
                            <div className="w-full flex items-center justify-center text-4xl h-32 max-md:h-[160px] bg-[#fef32a]">
                                <RiDiscountPercentFill />
                            </div>
                            <div className='flex flex-col h-[80px] max-md:h-full md:justify-between'>
                                <p className='px-4 py-2 whitespace-normal'>{item?.description}</p>
                                <p className='px-4 font-semibold whitespace-normal pb-1'>{item?.name}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default ListVoucher
