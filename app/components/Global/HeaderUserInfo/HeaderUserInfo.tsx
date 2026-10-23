"use client"
import { SessionUser } from '@/server/lib/auth';
import { ApiRouteKey, USER_ROLE_OWNER } from '@/server/lib/constants';
import { postRequest } from '@/server/services/http.service';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useState } from 'react'

const HeaderUserInfo = ({ user }: { user: SessionUser | null }) => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        setLoading(true);
        try {
            const res = await postRequest('logout' as ApiRouteKey);
            if (!res.ok) {
                console.log("logout not working");
            }
        } catch (error) {
            console.log(error);
        } finally {
            router.push("/auth/signin");
            router.refresh();
        }
    }
    return (
        <>
            {!user ? 
            <>
                <Link href="/auth/signin" className="text-sm font-semibold text-blue-500"
                >Sign in</Link>
                <Link href="/auth/register" className="text-sm font-semibold text-blue-500"
                >Register</Link>
            </>
                :
                <>
                    
                    <span className="text-sm font-semibold text-gray-600">
                        Welcome, <span className="font-medium text-gray-900">{user.name ?? user.email}</span>
                    </span>
                    {user.role === USER_ROLE_OWNER &&
                        <Link href="/restaurants/new" className="text-sm font-semibold text-blue-500"
                        >Add Restaurant</Link>
                    }
                    <button onClick={handleLogout} disabled={loading} className="text-sm font-semibold text-blue-500"
                    >Sign out</button>
                </>

            }

        </>
    )
}

export default HeaderUserInfo
