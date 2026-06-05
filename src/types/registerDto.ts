import type { userAttributes } from "../models/userModel.js";

export interface RegisterDTO {
    name: string;
    phone_number: string;
    email: string;
    password: string;
    confirm_password: string;
    gender: userAttributes["gender"];
}