'use client'

import userService from '@/services/userService';
import { Button, Form, Input } from 'antd'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { IoBus } from 'react-icons/io5';
import { toast } from 'react-toastify';

const ForgotPass = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [form] = Form.useForm();
    const router = useRouter();

    const onFinish = async (value : {email : string}) => {
        try {
            setLoading(true)
            await userService.sendEmail(value.email);
            setLoading(false)
            toast.success("Gửi mật khẩu mới về email thành công")
            router.push("/login")
        } catch (error) {
            setLoading(false)
            toast.error(`${error}`)
        }
    }

    return (
        <div className='bg-blue-100 h-screen flex items-center justify-center'>
            <Form
                form={form}
                onFinish={onFinish}
                className='bg-white w-[400px] !p-5 rounded-lg'
            >
                <p className='text-center font-bold text-3xl mb-4 text-[#1677ff] flex justify-center items-center gap-2'> <IoBus className="text-yellow-300 text-3xl" />BusBooker</p>
                <p className='text-center mb-4 text-xl font-semibold text-[#1677ff]'>Quên mật khẩu</p>
                <p className='text-center mb-6'>Để khôi phục nhập khẩu, bạn vui lòng nhập Email đã dùng để đăng ký trên hệ thống.</p>
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
                        },
                    ]}
                >
                    <Input placeholder='Nhập email của bạn' className='p-2' />
                </Form.Item>
                <Button type="primary" htmlType="submit" className='w-full py-4' loading={loading}>
                    Gửi
                </Button>
            </Form>
        </div>
    )
}

export default ForgotPass