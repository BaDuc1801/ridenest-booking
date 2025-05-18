'use client'

import { resetUser } from '@/redux/userStore';
import notiService, { INoti } from '@/services/notiService';
import { IUser } from '@/services/userService';
import { Badge, Button, Drawer, Dropdown, Menu, Modal, Tooltip } from 'antd'
import type { MenuProps } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { BsTicketPerforatedFill } from 'react-icons/bs';
import { FaPhoneAlt } from 'react-icons/fa';
import { GoDotFill } from 'react-icons/go';
import { IoBus, IoNotifications, IoSearch } from 'react-icons/io5';
import { LuTicket } from 'react-icons/lu';
import { MdManageAccounts } from 'react-icons/md';
import { RiAccountCircleLine } from 'react-icons/ri';
import { TiThMenu } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';

type MenuItem = Required<MenuProps>['items'][number];

const Header = () => {
    const [menuVisible, setMenuVisible] = useState<boolean>(false);
    const user = useSelector((state: { user: IUser }) => state.user);
    const router = useRouter()
    const dispatch = useDispatch()

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const items: MenuItem[] = [
        {
            key: 'sub1',
            label: 'Navigation One',
            children: [
                {
                    key: 'g1',
                    label: 'Item 1',
                    type: 'group',
                    children: [
                        {
                            key: '1',
                            label: 'Option 1',
                        },
                        {
                            key: '2',
                            label: 'Option 2',
                        },
                    ],
                },
                {
                    key: 'g2',
                    label: 'Item 2',
                    type: 'group',
                    children: [
                        {
                            key: '3',
                            label: 'Option 3',
                        },
                        {
                            key: '4',
                            label: 'Option 4',
                        },
                    ],
                },
            ],
        },
        {
            key: 'sub2',
            label: 'Navigation Two',
            children: [
                {
                    key: '5',
                    label: 'Option 5',
                },
                {
                    key: '6',
                    label: 'Option 6',
                },
                {
                    key: 'sub3',
                    label: 'Submenu',
                    children: [
                        {
                            key: '7',
                            label: 'Option 7',
                        },
                        {
                            key: '8',
                            label: 'Option 8',
                        },
                    ],
                },
            ],
        },
        {
            type: 'divider',
        },
        {
            key: 'sub4',
            label: 'Navigation Three',
            children: [
                {
                    key: '9',
                    label: 'Option 9',
                },
                {
                    key: '10',
                    label: 'Option 10',
                },
                {
                    key: '11',
                    label: 'Option 11',
                },
                {
                    key: '12',
                    label: 'Option 12',
                },
            ],
        },
        {
            key: 'grp',
            label: 'Group',
            type: 'group',
            children: [
                {
                    key: '13',
                    label: 'Option 13',
                },
                {
                    key: '14',
                    label: 'Option 14',
                },
            ],
        },
    ];

    const logout = () => {
        dispatch(resetUser())
        localStorage.removeItem('access_token');
        router.push("/login")
    }

    const itemsDrop: MenuProps['items'] = [
        {
            label: <Link href='/profile'>Hồ sơ cá nhân</Link>,
            key: '0',
        },
        {
            label: <Link href='/change-password'>Đổi mật khẩu</Link>,
            key: '1',
        },
        {
            type: 'divider' as const,
        },
        {
            label: <div onClick={() => logout()}>Đăng xuất</div>,
            key: '3',
        },
    ];

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [selectedNoti, setSelectedNoti] = useState<INoti>();
    const [listNoti, setListNoti] = useState<INoti[]>([])
    const [notiCount, setNotiCount] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            const noti = await notiService.getNoti()
            setListNoti(noti);
            const count = noti.filter((item: INoti) => !item.read).length;
            setNotiCount(count);
        }
        fetchData()
    }, [])

    const showModal = (item: INoti) => {
        setSelectedNoti(item);
        setIsModalVisible(true);
    };

    const handleClose = async () => {
        if (selectedNoti) {
            if (selectedNoti.read === true) {
                setIsModalVisible(false);
            } else {
                await notiService.readNoti(selectedNoti._id);
                const updatedListNoti = listNoti.map(item =>
                    item._id === selectedNoti._id ? { ...item, read: true } : item
                );
                setListNoti(updatedListNoti);
                setIsModalVisible(false);
            }
        }
    };

    const itemsNoti = listNoti.flatMap((item, index) => [
        {
            label: <p onClick={() => {
                if (!item.read) {
                    setNotiCount(notiCount - 1);
                }
                showModal(item);
            }} className="flex items-center justify-between gap-2"><p>Có 1 yêu cầu mở nhà xe từ <span className="font-bold">{item?.email}</span></p> {!item?.read ? <GoDotFill className="text-red-500" /> : ""}</p>,
            key: index.toString(),
        },
        {
            type: 'divider' as const,
        },
    ]).slice(0, -1);

    return (
        <div>
            <div className="flex justify-between bg-[#1677ff] text-white text-[16px] p-4 font-semibold">
                <div className="flex items-center justify-center text-3xl cursor-pointer">
                    <TiThMenu onClick={toggleMenu} className="hidden max-sm:block max-lg:mr-4" />
                    <Link href="/" className='flex justify-center gap-1' >
                        <IoBus className="text-yellow-300" />
                        RideNest
                    </Link>
                </div>
                {menuVisible ?
                    <Drawer
                        placement="left"
                        closable={true}
                        onClose={toggleMenu}
                        open={menuVisible}
                        width={'100%'}
                        style={{ top: 80 }}
                    >
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            className="w-full !border-white"
                            items={items}
                        />
                    </Drawer>
                    : ""
                }
                <div className="flex items-center gap-5">
                    <Link href="/my-storage" className="flex items-center gap-2 cursor-pointer max-sm:hidden">
                        <BsTicketPerforatedFill className="text-xl" />
                        Đơn hàng của tôi
                    </Link>
                    {
                        user?.role === "Customer" ?
                            <Link href="register-sale" className="flex items-center gap-2 cursor-pointer max-sm:hidden">
                                Mở bán vé trên RideNest
                            </Link>
                            : <></>
                    }
                    {
                        (user?.role === "Admin" || user?.role === "Operator") ?
                            <>
                                <Link href="/manager" className="flex items-center gap-1 cursor-pointer max-sm:hidden">
                                    <MdManageAccounts className="text-xl" />
                                    Quản lý
                                </Link>
                            </>
                            : <></>
                    }
                    {user?.role === "Admin" &&
                        <Dropdown
                            menu={{ items: itemsNoti }}
                            trigger={['click']}
                            placement="bottomRight"
                            arrow={{
                                pointAtCenter: true,
                            }}
                        >
                            <Badge count={notiCount} >
                                <IoNotifications className="text-2xl text-white" />
                            </Badge>
                        </Dropdown>
                    }
                    <Tooltip placement="bottomRight"
                        title={<div className="text-black">
                            <p>
                                <span className="cursor-poiter text-blue-600">0981155865</span> - Để đặt vé qua điện thoại (24/7)</p>
                            <p>
                                <span className="cursor-poiter text-blue-600">0985511568</span> - Để phản hồi về dịch vụ và xử lý sự cố</p>
                        </div>}
                        color="white"
                        trigger={"click"}
                    >
                        <button className="flex items-center max-sm:hidden bg-white text-blue-900 py-2 px-3 rounded-md gap-2">
                            <FaPhoneAlt />
                            Hotline 24/7
                        </button>
                    </Tooltip>
                    {user?._id !== '' ?
                        <Dropdown
                            menu={{ items: itemsDrop }}
                            trigger={['click', 'hover']} >
                            <img src={user?.avatar} className="w-10 h-10 rounded-full"></img>
                        </Dropdown>
                        :
                        <button className="flex items-center bg-white text-blue-900 py-2 px-3 rounded-md">
                            <Link href="/login">Đăng nhập</Link>
                        </button>
                    }
                </div>
            </div>
            <div className="flex items-center justify-around fixed w-full z-40 py-2 border-grey border-t-2 bottom-0 bg-white font-semibold md:hidden">
                <button className="flex flex-col items-center">
                    <IoSearch className="text-2xl" />
                    Tìm kiếm
                </button>
                <Link href="/my-storage">
                    <button className="flex flex-col items-center">
                        <LuTicket className="text-2xl" />
                        Vé của tôi
                    </button>
                </Link>
                <button className="flex flex-col items-center">
                    <RiAccountCircleLine className="text-2xl" />
                    Tài khoản
                </button>
            </div>
            <Modal title="Thông tin" open={isModalVisible} footer={[
                <Button key="close" onClick={handleClose}>
                    Đóng
                </Button>
            ]}>
                <div className="flex flex-col gap-2">
                    <p>Tên: {selectedNoti ? <span className="font-semibold">{selectedNoti.username}</span> : ''}</p>
                    <p>Email: {selectedNoti ? <span className="font-semibold">{selectedNoti.email}</span> : ''}</p>
                    <p>Số điện thoại: {selectedNoti ? <span className="font-semibold">{selectedNoti.phoneNumber}</span> : ''}</p>
                    <p>Tên nhà xe đăng kí: {selectedNoti ? <span className="font-semibold">{selectedNoti.garage}</span> : ''}</p>
                </div>
            </Modal>
        </div>
    )
}

export default Header
