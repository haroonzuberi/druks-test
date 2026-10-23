"use client"
import { ApiRouteKey, USER_ROLE_OWNER } from '@/server/lib/constants';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import TextInput from '../../Global/TextInput/TextInput';
import { loginSchema } from '@/server/validation/auth.schema';
import { postRequest } from '@/server/services/http.service';


type FieldErrors = Record<string, string[] | undefined>;
const LoginForm = () => {
  const router = useRouter();

  const [values, setValues] = useState({
    email: "",
    password: "",
    role: USER_ROLE_OWNER
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false)

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }))

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    setErrors({});
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      console.log(errors);
      return;
    }
    setLoading(true);

    try {
      const response = await postRequest("login" as ApiRouteKey, parsed.data);

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.fields) {
          setErrors(responseData.fields);
        } else {
          setFormError(responseData.error ?? "Something went wrong, Please try again");
          return;
        }
      }
      router.push("/");
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

  };
  return (
    <>
      <div className="mt-10 max-w-md mx-auto w-full shadow-2xl p-6 rounded-lg">
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {formError && <>
            <div role="alert" className='rounded-md bg-red-50, p-3 text-sm text-red-700 ring-1 ring-red-200'>
              <p>{formError}</p>

            </div>
          </>}


          <TextInput
            id='email'
            label='Email'
            type='email'
            autoComplete='email'
            value={values.email}
            onChange={set("email")}
          />

          <TextInput
            id='password'
            label='Password'
            type='Password'
            value={values.password}
            onChange={set("password")}
          />

         
          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white"

            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>


        <p className="mt-10 text-center text-sm text-gray-500">
          Don't have an account?&nbsp;
          <Link
            href="/auth/register"
            className="font-semibold leading-6 text-blue-600 hover:text-blue-500"
          >
            Register
          </Link>
        </p>

      </div>
    </>
  )
}

export default LoginForm