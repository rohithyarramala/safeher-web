import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ 
      success: true, 
      message: "Logged out successfully" 
    });

    // 1. Clear the Web Cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0), // Set expiration to the past
      path: '/',
    });

    // 2. Mobile App Note: 
    // The mobile app will receive this 200 OK and should 
    // manually delete the JWT from its SecureStore/AsyncStorage.

    return response;
  } catch (err) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}