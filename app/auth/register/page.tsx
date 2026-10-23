
import RegisterForm from '@/app/components/Auth/RegisterForm/RegisterForm'
import { getPageMetadata } from '@/server/lib/constants'

export const metadata = getPageMetadata('register')

const Register = () => {
  return (
    <>
    <div className="flex min-h-full flex-col justify-center px-6 py-12 mb-48">
      <h2
        className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
      >
        Register
      </h2>
      <RegisterForm/>

    </div>
    </>
  )
}

export default Register
