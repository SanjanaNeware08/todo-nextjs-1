'use client'
import { useState, type ChangeEvent, type FormEvent } from 'react';
import axios from 'axios';
import {useRouter} from 'next/navigation'
import {toast} from 'react-hot-toast'
import TextButtons from '../ui/textbuttons';
import BasicTextFields from '../ui/forminput'
import Image from 'next/image'

export default function Signupform() {
    const [user, setUser] = useState({
        username:"",
        email:"",
        password:"",
        profilePicture:""
    })

    const router = useRouter();

    const handleProfileFile = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if(!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setUser(prev => ({ ...prev, profilePicture: String(reader.result || "") }));
        };
        reader.readAsDataURL(file);
    }

    const handleSignup = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:4000/api/users/register", user);
            console.log("user Created Successfully", res.data);
            toast.success("signup seccess")
            router.push("/login");
        } catch(err) {
            console.log("error sigining user", err);
        }
    }
    return(
        <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div style={{ width: '100%', maxWidth: 420, background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 24 }}>
                <h1 className="text-3xl">Sign up</h1>
                <form onSubmit={handleSignup}>
                    <BasicTextFields name="username" label="username" value={user.username} onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({...user, username:e.target.value})}/>
                    <BasicTextFields name="email" type="email" label="Email" value={user.email} onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({...user, email:e.target.value})}/>
                    <BasicTextFields name="password" type="password" label="Password" value={user.password} onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({...user, password:e.target.value})}/>
                    <div className="mt-5 mb-3">
                        <label className="block mb-2 text-sm font-medium text-white">Add your Picture</label>
                        <input
                          id="profilePic"
                          type="file"
                          accept="image/*"
                          onChange={handleProfileFile}
                          className="sr-only mt-5"
                        />
                        <label
                          htmlFor="profilePic"
                          className="mt-5 block-flex items-center justify-center rounded-md border border-white/30 px-4 py-2 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
                        >
                          Choose file
                        </label>
                        {user.profilePicture ? (
                            <Image src={user.profilePicture} alt="preview" width={96} height={96} className="mt-2 object-cover rounded" />
                        ) : null}
                    </div>
                    
                    <TextButtons/>
                </form>
            </div>
        </div>
    )
}
