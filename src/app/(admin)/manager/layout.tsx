'use client'

import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import {
    FaBusSimple, FaTicket, FaUser,
} from 'react-icons/fa6';
import { PiSealPercentFill } from 'react-icons/pi';
import { CiRoute } from 'react-icons/ci';
import { RiCalendarScheduleFill } from 'react-icons/ri';
import { BiSolidCarGarage } from 'react-icons/bi';
import userService, { IUser } from '@/services/userService';
import { MdHome } from 'react-icons/md';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<IUser>();

    useEffect(() => {
        const fetchData = async () => {
            const user = await userService.getUserInformation();
            setUser(user);

            if (user.role === "Customer") {
                router.push("/");
            } else if (user.role === "Admin" && pathname === "/manager") {
                router.push("/manager/users");
            } else if (user.role === "Operator" && pathname === "/manager") {
                router.push("/manager/bus");
            }
        };
        fetchData();
    }, [pathname]);

    const items = [
        { key: 'users', label: 'Danh sách người dùng', icon: <FaUser /> },
        { key: 'bus', label: 'Quản lý xe', icon: <FaBusSimple /> },
        { key: 'schedules', label: 'Quản lý lịch trình', icon: <RiCalendarScheduleFill /> },
        { key: 'tickets', label: 'Quản lý vé', icon: <FaTicket /> },
        { key: 'routes', label: 'Quản lý tuyến đường', icon: <CiRoute /> },
        { key: 'vouchers', label: 'Quản lý voucher', icon: <PiSealPercentFill /> },
        { key: 'garage', label: 'Thêm nhà xe', icon: <BiSolidCarGarage /> },
    ];

    const keysToRemoveForOperator = ['users', 'garage', 'vouchers'];
    const filteredItems = items.filter(item =>
        user?.role !== 'Operator' || !keysToRemoveForOperator.includes(item.key)
    );

    const onClick = (e: { key: string }) => {
        router.push(`/manager/${e.key}`);
    };

    const selectedKey = pathname.split('/')[2];

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <div className='w-screen text-white bg-blue-400 h-12 flex justify-start items-center'>
                <MdHome className='text-3xl ml-5 cursor-pointer' onClick={() => router.push("/")} />
            </div>
            <div className='flex h-[calc(100vh-48px)]'>
                <Menu
                    onClick={onClick}
                    style={{ width: 256, height: "100%" }}
                    selectedKeys={[selectedKey]}
                    mode="inline"
                    items={filteredItems}
                />
                <div className="flex-grow p-4 overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
