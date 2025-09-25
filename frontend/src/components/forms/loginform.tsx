'use client'
import { useState, type ChangeEvent, type FormEvent } from 'react';
import axios from 'axios';
import {useRouter} from 'next/navigation'
import BasicTextFields from '@/components/ui/forminput'
import TextButtons from '@/components/ui/textbuttons';

export default function Loginform() {
    const [user, setUser] = useState({
        email : "",
        password:""
    })

    const router = useRouter();

    const handleLogin = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            type LoginResponse = {
                success: boolean;
                data: { user: { userId: string; username: string; email: string; profilePicture: string }, token: string };
            };
            const { data } = await axios.post<LoginResponse>("http://localhost:4000/api/users/login", user, { withCredentials: true });
            console.log("user logging...", data);
            const token = data.data.token;
            // Save token to cookie for middleware checks (client-managed, not httpOnly)
            document.cookie = `token=${token}; Path=/; Max-Age=86400; SameSite=Lax`;
            router.push("/dashboard");
        } catch (error) {
            console.log("wrong credentials - ", error);
        }

    }
    return (
        <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div style={{ width: '100%', maxWidth: 420, background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 24 }}>
                <h1 className="text-3xl">Login</h1>
                <form onSubmit={handleLogin}>
                    <BasicTextFields name="email" label="Email" value={user.email} onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({...user, email:e.target.value})}/>
                    <BasicTextFields name="password" type="password" label="Password" value={user.password} onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({...user, password:e.target.value})}/>
                    <TextButtons/>
                </form>
            </div>
        </div>
    )
}