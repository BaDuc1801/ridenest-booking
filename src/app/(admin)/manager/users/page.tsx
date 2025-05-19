'use client'

import React, { useEffect, useState } from 'react';
import { Table, Modal, Input } from 'antd';
import { RiEditFill } from 'react-icons/ri';
import { FaTrash } from 'react-icons/fa';
import userService, { IUser } from '@/services/userService';
import { toast } from 'react-toastify';

const ListUser = () => {
    const [listUser, setListUser] = useState<IUser[]>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const [selectedUser, setSelectedUser] = useState<IUser>();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState<string>("");
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const [userForm, setRouteForm] = useState({
        username: '',
        email: '',
        phoneNumber: '',
    });

    const columns = [
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text: string) => {
                return <img src={text} alt="avatar" className="w-12 h-12 rounded-full" />;
            },
        },
        {
            title: 'Tên',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Chức vụ',
            dataIndex: '',
            key: 'role',
            render: (text: IUser) => {
                return (
                    text.owner ? <p>{text.role} - {text.owner}</p> : <p>{text.role}</p>
                )
            }
        },
        {
            title: 'Chỉnh sửa',
            dataIndex: '',
            key: '',
            render: (_text: unknown, record: IUser) => (
                <div className="flex cursor-pointer text-lg gap-5">
                    <p onClick={() => handleEdit(record)}>
                        <RiEditFill />
                    </p>
                    <p
                        className="text-red-500"
                        onClick={() => handleDelete(record._id)}
                    >
                        <FaTrash />
                    </p>
                </div>
            ),
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await userService.getAllUser();
                setListUser(response);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchData();
    }, []);

    const handleEdit = (user: IUser) => {
        setSelectedUser(user);
        setRouteForm({
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
        });
        setIsEditModalVisible(true);
    };

    const handleDelete = (userId: string) => {
        setUserIdToDelete(userId);
        setConfirmDelete(true);
    };

    const confirmDeleteUser = async () => {
        try {
            setLoading(true)
            await userService.deleteUser(userIdToDelete);
            setListUser(listUser.filter((user) => user._id !== userIdToDelete));
            setLoading(false)
            setConfirmDelete(false);
            toast.success('Xóa người dùng thành công');
        } catch (error) {
            console.log(error)
            setLoading(false)
            toast.error('Lỗi khi xóa người dùng');
        }
    };

    const cancelDeleteUser = () => {
        setConfirmDelete(false);
        setUserIdToDelete("");
    };

    const handleSaveChanges = async () => {
        try {
            if (selectedUser) {
                setLoading(true)
                await userService.updateUserById(selectedUser._id, userForm)
                const response = await userService.getAllUser();
                setListUser(response);
                setLoading(false)
                setIsEditModalVisible(false);
                toast.success('Cập nhật người dùng thành công');
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
            toast.error('Lỗi cập nhật người dùng');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRouteForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const [searchQuery, setSearchQuery] = useState('');

    const filteredUser = (users: IUser[]) => {
        return users.filter((user: IUser) => {
            const { email, phoneNumber, username, role, owner } = user;
            return (
                email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                owner?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                role?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    };

    return (
        <div className="">
            <Input
                placeholder="Tìm kiếm "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="!p-3"
            />

            <Table
                dataSource={filteredUser(listUser)}
                columns={columns}
                className="w-full"
                pagination={{ pageSize: 5 }}
                rowKey="_id"
            />

            <Modal
                title="Chỉnh sửa người dùng"
                open={isEditModalVisible}
                onOk={handleSaveChanges}
                onCancel={() => setIsEditModalVisible(false)}
                okText="Lưu thay đổi"
                cancelText="Hủy"
                loading={loading}
            >
                <div>
                    <div className="mb-3">
                        <label htmlFor="username">Tên:</label>
                        <Input
                            id="username"
                            name="username"
                            value={userForm.username}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">Email:</label>
                        <Input
                            id="email"
                            name="email"
                            value={userForm.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phoneNumber">Số điện thoại:</label>
                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            value={userForm.phoneNumber}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </Modal>

            <Modal
                title="Xác nhận xóa người dùng"
                open={confirmDelete}
                onOk={confirmDeleteUser}
                onCancel={cancelDeleteUser}
                okText="Xóa"
                cancelText="Hủy"
                loading={loading}
            >
                <p>Bạn có chắc chắn muốn xóa người dùng này không?</p>
            </Modal>
        </div>
    );
};

export default ListUser;