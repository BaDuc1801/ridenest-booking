'use client'

import userService from '@/services/userService';
import { Button, Form, Input } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const ChangePassword = () => {
    const [form] = Form.useForm();
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (!userService.getAccessToken()) {
            router.push("/")
        }
    }, [])

    const onFinish = async (value: { oldP: string, newP: string }) => {
        try {
            setLoading(true)
            await userService.changePassword(
                value.oldP,
                value.newP
            )
            setLoading(false)
            toast.success('Đổi mật khẩu thành công');
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
                layout='vertical'
            >
                <p className='text-center mb-4 text-xl font-semibold text-[#1677ff]'>Đổi mật khẩu</p>
                <Form.Item
                    label="Mật khẩu cũ"
                    name="oldP"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input placeholder='Nhập email của bạn' className='p-2' />
                </Form.Item>
                <Form.Item
                    label="Mật khẩu mới"
                    name="newP"
                    rules={[
                        {
                            required: true,
                        },
                        {
                            min: 6,
                            message: 'Mật khẩu phải có ít nhất 6 ký tự!',
                        },
                    ]}
                >
                    <Input.Password placeholder='Nhập email của bạn' className='p-2' />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    label="Xác nhận mật khẩu mới"
                    dependencies={['newP']}
                    hasFeedback
                    className=' mb-10'
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newP') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password className='p-2' placeholder='Xác nhận mật khẩu' />
                </Form.Item>
                <Button type="primary" htmlType="submit" className='w-full py-4' loading={loading}>
                    Thay đổi
                </Button>
            </Form>
        </div>
    )
}

export default ChangePassword
