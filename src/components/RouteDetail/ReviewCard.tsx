import React, { useEffect, useState } from 'react';
import { Rate } from 'antd';
import { IReview } from '@/services/reviewService';
import busService from '@/services/busService';

interface ReviewCardProps {
    busId: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ busId }) => {
    const [reviews, setReviews] = useState<IReview[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            const data = await busService.getReview(busId)
            setReviews(data);
        };

        fetchReviews();
    }, [busId]);

    return (
        <div className='border-t-2 py-3'>
            <p className='font-semibold text-lg'>Đánh giá cho chuyến xe</p>
            {reviews.length === 0 ? (
                <p>Không có đánh giá nào.</p>
            ) : (
                reviews.map((review) => (
                    <div key={review._id} className="shadow-md border-gray-300 border-2 p-2 rounded-md my-4">
                        <div className='flex items-center gap-2'><img src={review.userId.avatar} className='w-8 h-8 rounded-full'></img><p className='font-semibold'> {review.userId ? review.userId.username : 'Không có thông tin người dùng'}</p></div>
                        <div className='my-2'>
                            <Rate disabled value={review.rating} />
                        </div>
                        <p>{review.content}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default ReviewCard;