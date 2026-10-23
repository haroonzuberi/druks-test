import Link from 'next/link'

import HeaderUserInfo from '../HeaderUserInfo/HeaderUserInfo';
import { SessionUser } from '@/server/lib/auth';

const Header = async ({user}: {user:SessionUser | null}) => {

  
  return (
    <>
      <nav className="w-full px-4 py-4">
        <div className="header-bar mx-auto flex max-w-6xl flex-col items-start gap-3">
          <div className="leading-tight">
            <Link href="/" className="font-bold text-3xl">Restaurant Reviews</Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 leading-loose">
            
            <HeaderUserInfo user={user}/>
          </div>
        </div>
      </nav>

    </>
  )
}

export default Header
