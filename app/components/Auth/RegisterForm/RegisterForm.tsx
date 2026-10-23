"use client";
import { USER_ROLE_OWNER, USER_ROLES_DATA } from '@/server/lib/constants';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import TextInput from '../../Global/TextInput/TextInput';
import { registerSchema } from '@/server/validation/auth.schema';
import { postRequest } from '@/server/services/http.service';

type FieldErrors = Record<string, string[] | undefined>;

const RegisterForm = () => {
  const router = useRouter();

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    role: USER_ROLE_OWNER
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false)

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }))

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    setErrors({});
    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      console.log(errors);
      return;
    }
    setLoading(true);

    try {
      const response = await postRequest("register", parsed.data);

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.fields) 
          setErrors(responseData.fields);        
        else 
          setFormError(responseData.error ?? "Something went wrong, Please try again");
          return

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
            id='name'
            label='Name'
            type='text'
            autoComplete='name'
            value={values.name}
            onChange={set("name")}
          />
          {errors?.name?.[0] && (
            <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
          )}

          <TextInput
            id='email'
            label='Email'
            type='email'
            autoComplete='email'
            value={values.email}
            onChange={set("email")}
          />
          {errors?.email?.[0] && (
            <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
          )}
          <TextInput
            id='password'
            label='Password'
            type='Password'
            value={values.password}
            onChange={set("password")}
          />
          {errors?.password?.[0] && (
            <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
          )}
          <fieldset>
            <legend className="block text-sm font-semibold text-gray-800">I am a</legend>
            <div className="mt-2 space-y-2">
              {USER_ROLES_DATA.map((r) => (
                <label
                  key={r.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-md p-3 ring-1 ring-inset
                  ${values.role === r.value ? "bg-blue-50 ring-blue-600" : "ring-gray-300"}`}
                >
                  <input
                    type="radio" name="role" value={r.value}
                    checked={values.role === r.value} onChange={set("role")}
                    className="mt-1 h-4 w-4 text-blue-600"
                  />
                  <span>
                    <span className="block text-sm font-medium text-gray-900">{r.title}</span>
                    <span className="block text-sm text-gray-500">{r.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white"

            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?&nbsp;
          <Link
            href="/auth/signin"
            className="font-semibold leading-6 text-blue-600 hover:text-blue-500"
          >Sign in
          </Link>
        </p>
      </div>
    </>
  )
}

export default RegisterForm