'use client'

import { Button, DatePicker, Form, Select } from 'antd'
import React, { useEffect } from 'react'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FaCircleDot, FaLocationDot } from 'react-icons/fa6';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { IRoute } from '@/services/routeService';
import { ISearch, setBookingDate, setDestination, setOrigin, setTripType } from '@/redux/searchStore';
import { useRouter } from 'next/navigation';

dayjs.extend(customParseFormat);

const FormSearch = (props: { check: number; search: ISearch }) => {
    const { RangePicker } = DatePicker;
    const { check, search } = props
    const router = useRouter()
    const dispatch = useDispatch()

    const listRoute = useSelector((state: { route: { list: IRoute[] } }) => state.route.list)

    const [form] = Form.useForm()

    const disabledDate = (current: dayjs.Dayjs) => {
        return current && current < dayjs().endOf('day');
    };

    const onFinish = (values: ISearch) => {
        let formattedBookingDate;
        if (Array.isArray(values.booking_date)) {
            formattedBookingDate = check
                ? values.booking_date.map(date => dayjs(date).format('YYYY-MM-DD'))
                : dayjs(values.booking_date[0]).format('YYYY-MM-DD');
        } else {
            formattedBookingDate = dayjs(values.booking_date).format('YYYY-MM-DD');
        }
        dispatch(setOrigin(values.origin))
        dispatch(setDestination(values.destination))
        dispatch(setBookingDate(formattedBookingDate))
        dispatch(setTripType(check))

        router.push("/route-details");
    };

    useEffect(() => {
        const bookingDate = search.booking_date;

        let temp: dayjs.Dayjs | [dayjs.Dayjs, dayjs.Dayjs | null] | null = null;

        if (bookingDate) {
            if (Array.isArray(bookingDate)) {
                temp = check
                    ? [dayjs(bookingDate[0]), dayjs(bookingDate[1])]
                    : dayjs(bookingDate[0]);
            } else {
                temp = check
                    ? [dayjs(bookingDate), null]
                    : dayjs(bookingDate);
            }
        } else {
            temp = null;
        }

        form.setFieldsValue({
            origin: search.origin || null,
            destination: search.destination || null,
            booking_date: temp
        });
    }, [search.origin, search.destination, search.booking_date, check]);

    return (
        <Form
            form={form}
            onFinish={onFinish}
        >
            <div className='grid grid-cols-1 md:grid-cols-[2fr_2fr_3fr_1fr] px-4 md:gap-4 lg:w-[1000px] md:w-[700px] w-[calc(100vw-50px)] m-auto'>
                <div className='flex flex-col gap-2'>
                    <p className='flex items-center gap-2 font-semibold'><FaCircleDot className='text-blue-500' />Nơi xuất phát</p>
                    <Form.Item
                        name="origin"
                        rules={[{ required: true, message: 'Vui lòng chọn nơi xuất phát!' }]}
                    >
                        <Select
                            className='w-full'
                            size='large'
                            showSearch
                            placeholder="Chọn nơi xuất phát"
                            optionFilterProp="label"
                            filterOption={(input, option) =>
                                (typeof option?.label === 'string' ? option.label.toLowerCase() : '').includes(input.toLowerCase())
                            }
                        >
                            {listRoute && Array.from(new Set(listRoute.map(route => route.origin)))
                                .map((uniqueOrigin, index) => (
                                    <Select.Option key={index} value={uniqueOrigin} label={uniqueOrigin}>
                                        {uniqueOrigin}
                                    </Select.Option>
                                ))}
                        </Select>
                    </Form.Item>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='flex items-center gap-2 font-semibold'><FaLocationDot className='text-red-500' />Nơi đến</p>
                    <Form.Item
                        name="destination"
                        rules={[{ required: true, message: 'Vui lòng chọn nơi đến!' }]}
                    >
                        <Select
                            className='w-full'
                            showSearch
                            size='large'
                            placeholder="Chọn nơi đến"
                            optionFilterProp="label"
                            filterOption={(input, option) =>
                                (typeof option?.label === 'string' ? option.label.toLowerCase() : '').includes(input.toLowerCase())
                            }
                        >
                            {listRoute && Array.from(new Set(listRoute.map(route => route.destination)))
                                .map((uniqueDestination, index) => (
                                    <Select.Option key={index} value={uniqueDestination} label={uniqueDestination}>
                                        {uniqueDestination}
                                    </Select.Option>
                                ))}
                        </Select>
                    </Form.Item>
                </div>
                {
                    !check ?
                        <div className='flex flex-col gap-2'>
                            <p className='flex items-center gap-2 font-semibold'><FaRegCalendarAlt className='text-blue-600' />Ngày đi</p>
                            <Form.Item
                                name="booking_date"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày đi!' }]}
                            >
                                <DatePicker size='large'
                                    className='w-full'
                                    placeholder='Ngày đi'
                                    disabledDate={disabledDate}
                                />
                            </Form.Item>
                        </div>
                        :
                        <div className='flex flex-col gap-2'>
                            <p className='flex items-center gap-2 font-semibold'><FaRegCalendarAlt className='text-blue-600' />Ngày đi và về</p>
                            <Form.Item
                                name="booking_date"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn ngày đi và ngày về!'
                                    },
                                    {
                                        validator: (_, value) => {
                                            if (!value || value.length !== 2 || !value[0] || !value[1]) {
                                                return Promise.reject(new Error('Vui lòng chọn cả ngày đi và ngày về!'));
                                            }
                                            return Promise.resolve();
                                        },
                                    }
                                ]}
                            >
                                <RangePicker size='large'
                                    className='w-full'
                                    placeholder={["Ngày đi", "Ngày về"]}
                                    disabledDate={disabledDate}
                                />
                            </Form.Item>

                        </div>
                }
                <div className='h-full flex items-end w-full'>
                    <Form.Item
                        className='w-full'>
                        <Button htmlType='submit' className='!bg-yellow-400 hover:!bg-yellow-300 hover:!text-black !w-full !h-[39.6px] rounded-md text-md font-semibold'
                        >
                            Tìm kiếm
                        </Button>
                    </Form.Item>
                </div>
            </div >
        </Form >

    )
}

export default FormSearch