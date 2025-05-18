'use client'

import CommentsSection from '@/components/featured/CommentsSection/CommentsSection'
import OverviewSection from '@/components/featured/OverviewSection/OverviewSection'
import RouteList from '@/components/RouteDetail/RouteList'
import SearchSection from '@/components/SearchSection/SearchSection'
import VoucherList from '@/components/VoucherList/VoucherList'
import { setListRoute } from '@/redux/routeStore'
import { resetTrip } from '@/redux/searchStore'
import { setListVoucher } from '@/redux/voucherStore'
import routeService, { IRoute } from '@/services/routeService'
import voucherService, { IVoucher } from '@/services/voucherService'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const Main = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const route: IRoute[] = await routeService.getAllRoutes()
        dispatch(setListRoute(route))
        const voucher: IVoucher[] = await voucherService.getAllVouchers();
        dispatch(setListVoucher(voucher));
        dispatch(resetTrip())
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <SearchSection />
      <div className='lg:w-[1000px] md:w-[700px] md:mx-auto mx-[20px] flex flex-col gap-[50px] my-[50px]'>
        <RouteList />
        <VoucherList />
        <CommentsSection />
        <OverviewSection />
      </div>
    </div>
  )
}

export default Main