'use client'

import userService from '@/services/userService';
import { Button, Form, Input } from 'antd'
import React from 'react'
import { toast } from 'react-toastify';

const AddGarage = () => {
    const [form] = Form.useForm();

    const onFinish = async (value: {
        username: string;
        email: string;
        phoneNumber: string;
        owner: string;
    }) => {
        try {
            await userService.addOperator(value);
            toast.success('Thêm nhà xe thành công');
            form.resetFields();
        } catch (error) {
            console.error(error);
            toast.error('Email chưa được đăng ký');
        }
    }

    return (
        <div className='flex items-center justify-center h-full'>
            <Form
                form={form}
                onFinish={onFinish}
                layout='vertical'
                className='w-[40%] shadow-md rounded-md !p-5'
            >
                <p className='text-2xl text-center text-[#1677ff] font-bold pb-5'>Đăng ký nhà xe</p>
                <Form.Item
                    label="Tên người đăng ký:"
                    name="username"
                    rules={[{ required: true, message: '' }]}>
                    <Input placeholder='Nhập tên người đăng ký' />
                </Form.Item>
                <Form.Item
                    label="Email:"
                    name="email"
                    rules={[{ required: true, message: '' }]}>
                    <Input placeholder='Nhập email' />
                </Form.Item>
                <Form.Item
                    label="Số điện thoại:"
                    name="phoneNumber"
                    rules={[{ required: true, message: '' }]}>
                    <Input placeholder='Nhập số điện thoại' />
                </Form.Item>
                <Form.Item
                    label="Tên nhà xe:"
                    name="owner"
                    rules={[{ required: true, message: '' }]}>
                    <Input placeholder='Nhập tên nhà xe' />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className='w-full py-4'>
                        Đăng ký
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default AddGarage