'use client'

import { Tabs } from 'antd'
import React from 'react'
import { HiCheckBadge, HiReceiptPercent } from 'react-icons/hi2'
import { TfiHeadphoneAlt } from 'react-icons/tfi'
import { RiMoneyDollarCircleFill } from 'react-icons/ri'
import FormSearch from './FormSearch'
import Image from 'next/image';
import { shallowEqual, useSelector } from 'react-redux';
import { ISearch } from '@/redux/searchStore'

const SearchSection = () => {
    const search = useSelector((state: { search: ISearch }) => state.search, shallowEqual)

    return (
        <div className='relative h-[350px] max-md:h-[450px] flex justify-center items-center'>
            <Image alt='bg' src="/image.jpg" fill={true} className='absolute -z-10' priority></Image>
            <div className='flex justify-center items-center md:mb-[52px] max-md:h-[400px]'>
                <Tabs
                    className='bg-white rounded-xl'
                    defaultActiveKey= {search.tripType === 0 ? "1" : "2"}
                    items={[
                        {
                            key: '1',
                            label: <p className='w-1/2 font-semibold text-lg'>Một chiều</p>,
                            children: <FormSearch check={0} search={search} />,
                        },
                        {
                            key: '2',
                            label: <p className='w-1/2 font-semibold text-lg'>Hai chiều</p>,
                            children: <FormSearch check={1} search={search} />,
                        },
                    ]}
                />
            </div>
            <div className='absolute bottom-0 bg-black/50 flex justify-around w-full text-yellow-400 font-semibold py-3 max-md:hidden'>
                <p className='flex items-center gap-2 text-lg'><HiCheckBadge />
                    Chắc chắn có chỗ</p>
                <p className='flex items-center gap-2 text-lg'><TfiHeadphoneAlt />
                    Hỗ trợ 24/7</p>
                <p className='flex items-center gap-2 text-lg'><HiReceiptPercent />
                    Nhiều ưu đãi</p>
                <p className='flex items-center gap-2 text-lg'><RiMoneyDollarCircleFill />
                    Thanh toán đa dạng</p>
            </div>
        </div >
    )
}

export default SearchSection