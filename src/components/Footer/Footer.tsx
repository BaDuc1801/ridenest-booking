import React from 'react'
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa6'

const Footer = () => {
  return (
    <div className='bg-black max-md:mt-16 py-8 hidden md:block'>
      <div className='mx-[50px] px-4 text-white'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center gap-8'>
          <div>
            <h3 className='font-semibold text-lg mb-4'>Thông tin liên hệ</h3>
            <ul className=''>
              <li className='mb-2'>Địa chỉ: 123 Đường ABC, Hà Nội</li>
              <li className='mb-2'>Email: ridenest@gmail.com</li>
              <li className='mb-2'>Số điện thoại: 123-456-789</li>
            </ul>
          </div>
          <div>
            <h3 className='font-semibold text-lg mb-4'>Theo dõi chúng tôi</h3>
            <div className='flex space-x-8'>
              <a href='#'>
                <FaFacebook className='text-blue-600 text-4xl' />
              </a>
              <a href='#'>
                <FaTiktok className='text-white text-4xl' />
              </a>
              <a href='#'>
                <FaInstagram className='text-red-600 text-4xl' />
              </a>
            </div>
          </div>
          <div>
            <h3 className='font-semibold text-lg mb-4'>Bản quyền</h3>
            <p className=''>
              &copy; 2024 Công ty RideNest. Mọi quyền lợi được bảo lưu.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer