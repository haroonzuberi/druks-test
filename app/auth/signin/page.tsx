import LoginForm from '@/app/components/Auth/LoginForm/LoginForm'
import { getPageMetadata } from '@/server/lib/constants'
import React from 'react'

export const metadata = getPageMetadata('signin')
const Signin = () => {
  return (
    <>
    <div className="flex min-h-full flex-col justify-center px-6 py-12 mb-48">
      <h2
        className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
      >
        Sign in
      </h2>

      <LoginForm />

    </div>
    </>
  )
}

export default Signin
