import axios from 'axios';
import type { User, AuthResponse } from '@/app/types/Auth/auth.interface';
import { BASE_API } from '@/app/utils/const.util';

const api = axios.create({
  baseURL: `${BASE_API}/api`,
  withCredentials: true, // จำเป็นต้องตั้งค่านี้เพื่อให้ส่ง cookies
});

/**
 * ฟังก์ชันเริ่มกระบวนการ Google OAuth login
 * ฟังก์ชันนี้จะ redirect ผู้ใช้ไปยังหน้า Google login
 */
export const loginWithGoogle = (): void => {
  // สำหรับ login ด้วย Google ไม่ต้องใช้ axios เพราะเราต้องการให้ browser redirect
  window.location.href = `${BASE_API}/auth/google`;
};

/**
 * ฟังก์ชันสำหรับ logout ผู้ใช้
 * ฟังก์ชันนี้จะเรียก API endpoint สำหรับ logout ซึ่งจะลบ HTTP-only cookie
 * @returns Promise ที่ resolve เป็นข้อมูลการ logout
 */
export const logout = async (): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

/**
 * ฟังก์ชันตรวจสอบว่าผู้ใช้ login อยู่หรือไม่
 * ฟังก์ชันนี้จะเรียก API endpoint ที่ต้องการ authentication
 * @returns Promise ที่ resolve เป็น true ถ้า user logged in, false ถ้าไม่ได้ login
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    await api.get('/api/me');
    return true;
  } catch (error) {
    console.error('Not authenticated:', error);
    return false;
  }
};

/**
 * ฟังก์ชันดึงข้อมูลผู้ใช้ปัจจุบันที่ login อยู่
 * @returns Promise ที่ resolve เป็นข้อมูลผู้ใช้หรือ null ถ้าไม่ได้ login
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get<{ id: number; email: string; name: string; picture: string }>('/api/me');
    
    // แปลงรูปแบบข้อมูลให้ตรงกับ User interface
    return {
      id: response.data.id,
      email: response.data.email,
      displayName: response.data.name,
      pictureUrl: response.data.picture,
    };
  } catch (error) {
    console.error('Get current user failed:', error);
    return null;
  }
};

/**
 * ฟังก์ชันตรวจสอบสถานะการเข้าสู่ระบบและดึงข้อมูลผู้ใช้
 * สะดวกสำหรับตรวจสอบทั้ง authentication status และข้อมูลผู้ใช้ในครั้งเดียว
 * @returns Promise ที่ resolve เป็นข้อมูลสถานะการเข้าสู่ระบบและข้อมูลผู้ใช้
 */
export const getAuthStatus = async (): Promise<{ isAuthenticated: boolean; user: User | null }> => {
  try {
    const user = await getCurrentUser();
    return { isAuthenticated: !!user, user };
  } catch (error) {
    console.error('Get auth status failed:', error);
    return { isAuthenticated: false, user: null };
  }
};

const authApi = {
  loginWithGoogle,
  logout,
  isAuthenticated,
  getCurrentUser,
  getAuthStatus,
};

export default authApi;