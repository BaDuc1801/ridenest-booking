'use client'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import routeService, { IRoute } from '@/services/routeService';
import SearchSection from '@/components/SearchSection/SearchSection';
import { Spin } from 'antd';
import ScheduleCard from '@/components/RouteDetail/ScheduleCard';
import { ISearch } from '@/redux/searchStore';

const RouteDetail = () => {
  const [route, setRoute] = useState<IRoute[]>([]);
  const [loading, setLoading] = useState(false);
  const search = useSelector((state: { search: ISearch }) => state.search);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let params = {};
      try {
        if (search.tripType === 1 && search.departure) {
          params = {
            origin: search?.origin,
            destination: search?.destination,
            startTime: Array.isArray(search?.booking_date) && search?.booking_date[1]
            // Array.isArray(search?.booking_date)
            //   ? search.booking_date[1] ?? null
            //   : (search?.booking_date ?? null)
          };
        } else {
          params = {
            origin: search?.origin,
            destination: search?.destination,
            startTime: Array.isArray(search?.booking_date)
              ? search.booking_date[0] ?? null
              : (search?.booking_date ?? null)
          };
        }
        const data = await routeService.findSchedule(params);
        setRoute(data);
      } catch (err) {
        console.error("Error fetching route:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search]);

  return (
    <div>
      <SearchSection />
      <div className="max-md:mb-[60px] pb-12 pt-5 flex items-center justify-center flex-col gap-5 bg-[#F2F4F7]">
        {loading ? (
          <Spin size="large" className='mt-5' />
        ) : (
          <>
            {Array.isArray(search.booking_date) ? ( search.departure ? <p>Chiều về</p> : <p>Chiều đi</p> ) : ""}
            <p className='text-xl'>
              Có <span className='font-bold'>{route[0]?.schedules?.length || 0}</span> chuyến xe đi từ{' '}
              <span className='font-bold'>{search.origin}</span> đến{' '}
              <span className='font-bold'>{search.destination}</span>
            </p>
            {
              route[0]?.schedules?.map((item, index) => (
                <ScheduleCard item={item} key={index} />
              ))
            }
          </>
        )}
      </div>
    </div>
  )
}

export default RouteDetail;
