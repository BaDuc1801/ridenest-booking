'use client'

import { setUser, setUserAvatar } from '@/redux/userStore';
import userService, { IUser } from '@/services/userService';
import { Button, Col, Form, Input, Row } from 'antd'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Profile = () => {
    const [form] = Form.useForm();
    const [isChanged, setIsChanged] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const user = useSelector((state: { user: IUser }) => state.user)
    const router = useRouter()
    const [avatar, setAvatar] = useState<string>('')

    const dispatch = useDispatch();

    useEffect(() => {
        if (userService.getAccessToken()) {
            form.setFieldsValue({
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
            });
            setAvatar(user.avatar);
            setImagePreview(user.avatar);
        } else {
            router.push("/")
        }
    }, [user]);

    const onValuesChange = (changedValues: Partial<{
        username: string;
        email: string;
        phoneNumber: string;
        avatar?: string;
    }>) => {
        setIsChanged(
            changedValues.username !== user?.username ||
            changedValues.email !== user?.email ||
            changedValues.phoneNumber !== user?.phoneNumber ||
            changedValues.avatar !== user?.avatar
        );
    }

    const onFinish = async (value: {
        username: string;
        email: string;
        phoneNumber: string;
        avatar?: string;
    }) => {
        try {
            setLoading(true)
            const formData = new FormData();
            if (selectedImage) {
                formData.append('avatar', selectedImage);
                const updatedUser = await userService.updateAvatar(formData);
                setAvatar(selectedImage ? (imagePreview ?? '') : (user?.avatar ?? ''));
                dispatch(setUserAvatar(updatedUser.user))
            }
            if (value.username !== user?.username || value.email !== user?.email || value.phoneNumber !== user?.phoneNumber) {
                const updatedUser = await userService.updateUser(value)
                dispatch(setUser(updatedUser))
            }
            setLoading(false)
            toast.success('Cập nhật thông tin thành công');
            setIsChanged(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            toast.error("Cập nhật thông tin thất bại");
        }
    }

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState(user?.avatar);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            const file = files[0];
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
            setIsChanged(true);
        }
    };

    const handleFileSelectClick = () => {
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.click();
        }
    };

    return (
        <div className='flex items-center justify-center h-[calc(100vh-72px)] bg-[#f2f4f7]'>
            <Form
                form={form}
                onFinish={onFinish}
                layout='vertical'
                className='w-[40%] shadow-md rounded-md !p-5 bg-white'
                onValuesChange={onValuesChange}
            >
                <p className='text-2xl text-center text-[#1677ff] font-bold pb-5'>Hồ sơ cá nhân</p>
                <Row gutter={[16, 8]}>
                    <Col span={12} className='flex justify-center items-center'>
                        <div className='flex justify-center items-center mt-5 cursor-pointer'>
                            <div className="w-[150px] h-[150px]" onClick={handleFileSelectClick}>
                                <img src={imagePreview || avatar} style={{ width: '100%', height: '100%' }} />
                            </div>
                            <input
                                type="file"
                                style={{ display: 'none' }}
                                id="file-input"
                                accept="image/*"
                                onChange={(e) => {
                                    handleFileChange(e);
                                }}
                                name='avatar'
                            />
                        </div>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Họ tên:"
                            name="username"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Email:"
                            name="email"
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            label="Số điện thoại:"
                            name="phoneNumber"
                        >
                            <Input placeholder='Nhập số điện thoại' />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className='w-full py-4' disabled={!isChanged} loading={loading}>
                        Lưu thông tin
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Profile