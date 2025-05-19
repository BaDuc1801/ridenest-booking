'use client'

import userService from '@/services/userService';
import { Button, Checkbox, Form, Input } from 'antd'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { IoBus } from 'react-icons/io5';

const Login = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false)

  const onFinish = async (values: { email: string, password: string }) => {
    try {
      setLoading(true);
      const user = await userService.login(values.email, values.password);
      localStorage.setItem('access_token', JSON.stringify(user.accessToken));
      setLoading(false);
      router.push("/")
    } catch (error) {
      setLoading(false);
      console.log(error)
      form.setFields([
        {
          name: 'password',
          errors: ['Email or Password is incorrect'],
        },
      ]);
      setTimeout(() => { form.setFieldValue('password', '') }, 2000)
    }
  };

  return (
    <div className='bg-blue-100 h-screen flex items-center justify-center'>
      <Form
        form={form}
        onFinish={onFinish}
        layout='vertical'
        className='bg-white w-[400px] rounded-lg !p-5'
      >
        <p className='text-center font-bold text-3xl mb-4 text-[#1677ff] flex justify-center items-center gap-2'> <IoBus className="text-yellow-300 text-3xl" />RideNest</p>
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
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu của bạn!',
            },
            {
              min: 6,
              message: 'Mật khẩu phải có ít nhất 6 ký tự!',
            },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu của bạn" className='p-2' />
        </Form.Item>
        <Form.Item valuePropName="checked" label={null}>
          <div className='flex w-full items-center justify-between'>
            <Checkbox>Remember me</Checkbox>
            <Link href="/forgot-password">Quên mật khẩu?</Link>
          </div>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className='w-full py-4' loading={loading}>
            Đăng nhập
          </Button>
        </Form.Item>
        <div className='flex items-center justify-center gap-2'>
          <p>Bạn chưa có tài khoản?</p><Link className='text-[#1677ff]' href="/register">Đăng ký</Link>
        </div>
      </Form>
    </div>
  )
}

export default Login