import { IUser } from "./userService";

export interface IReview {
  _id?: string;
  userId: IUser; 
  content: string;
  rating: number; 
  createdAt?: string;
  updatedAt?: string;
}

// const reviewService = {
  
// }