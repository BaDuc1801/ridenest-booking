'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ICommentHome {
    name: string;
    title: string;
    image: string;
    content: string;
}

const comments: ICommentHome[] = [
    {
        name: "Anh Nguyễn Tuấn Quỳnh",
        title: "CEO Saigon Books",
        image: "https://229a2c9fe669f7b.cmccloud.com.vn/images/testimonial-quynh.jpg",
        content: "Lần trước tôi có việc gấp phải đi công tác, lên mạng tìm đặt vé xe thì tình cờ tìm thấy RideNest. Sau khi tham khảo, tôi quyết định đặt vé và thanh toán. Công nhận rất tiện và nhanh chóng. Chỉ một lúc sau, nhà xe liên hệ xác nhận vé ngay và thông báo thời gian xe dự kiến đón để tôi chuẩn bị. Tôi khá bất ngờ vì nhà xe có thông tin của mình nhanh đến vậy. Chuyến đi hôm đó rất tuyệt. Tôi nhất định sẽ tiếp tục ủng hộ RideNest.",
    },
    {
        name: "Shark Phi",
        title: "Giám đốc BSSC",
        image: "https://229a2c9fe669f7b.cmccloud.com.vn/images/testimonial-phi.jpg",
        content: "Các đối tác của RideNest đều là những hãng xe lớn, có uy tín nên tôi hoàn toàn yên tâm khi lựa chọn đặt vé cho bản thân và gia đình. Nhờ hiển thị rõ nhà xe và vị trí chỗ trống trên xe, tôi rất dễ dàng tìm chuyến mình muốn và chỗ mình muốn ngồi. Còn hình thức thanh toán có cả thẻ, ví, tại nhà xe và tốc độ thanh toán thì siêu nhanh, tiết kiệm cho tôi rất nhiều thời gian.",
    },
    {
        name: "Chị Tú Ngô",
        title: "YOLA Co-Founder",
        image: "https://229a2c9fe669f7b.cmccloud.com.vn/images/testimonial-tu-ngo.jpg",
        content: "RideNest là ứng dụng đầu tiên tôi nghĩ tới khi cần đặt vé xe. Vì không những RideNest có nhiều ưu đãi lớn mà còn có nhiều hãng xe chất lượng, tôi được tuỳ chọn chỗ yêu thích nên tôi rất hài lòng.",
    },
    {
        name: "Bữu Vi Vu",
        title: "Travel tiktoker",
        image: "https://229a2c9fe669f7b.cmccloud.com.vn/images/testimonial-buuvivu.jpg",
        content: "Tôi thường chọn đặt vé tại RideNest mỗi khi du lịch cùng người thân, bạn bè. Bên cạnh việc đặt vé nhanh chóng, thuận tiện, RideNest còn có các đợt Flashsale định kỳ lên đến 50%. Săn vé thành công vào các dịp này giúp tôi tiết kiệm đáng kể chi phí đi lại cho mỗi chuyến đi.",
    }
]

const CommentList = () => {
    return (
        <div className=''>
            <p className='text-2xl font-semibold mb-2'>Khách hàng nói gì về RideNest</p>
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={30}
                className='lg:h-[470px] h-[400px]'
                loop={true}
                pagination={{ clickable: true }}
                breakpoints={{
                    0: { slidesPerView: 1, slidesPerGroup: 1 },
                    1050: { slidesPerView: 2, slidesPerGroup: 2 },
                }}
            >
                    {
                        comments.map((item, index) => (
                            <SwiperSlide key={index}>
                                <div className="p-5 rounded-2xl shadow-md border-2 border-gray-100 md:grid md:grid-cols-2 col-auto md:gap-4 m-1 lg:h-[420px] h-[350px]">
                                    <div className='max-md:grid max-md:grid-cols-2 max-md:gap-4'>
                                        <img src={item.image} alt={item.name} className="h-50 w-50 max-md:w-full object-cover object-top" />
                                        <div>
                                            <h4 className="text-2xl font-semibold md:my-2 text-blue-600">{item.name}</h4>
                                            <p className="text-xl font-semibold text-gray-700">{item.title}</p>
                                        </div>
                                    </div>
                                    <p className="md:col-span-1 max-md:mt-4 text-justify">{item.content}</p>
                                </div>
                            </SwiperSlide>
                        ))
                    }
            </Swiper>
        </div>
    )
}

export default CommentList
