import React, { useState } from 'react'
import { Button, Input } from '../../index'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import authservice from '../../Firebase/Auth-services'
import { login } from '../../Store/authSlice'
import { toast } from 'sonner'

function SignUpForm() {

  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm()

  const signup = async (data) => {

    try {
      setError("")
      setIsLoading(true)
      let session = await authservice.createAccount(data)


      if (session) {
        let userData = await authservice.getCurrentUser()

        if (userData) {

          const fullUserData = {...userData, role: "user"}
          dispatch(login(fullUserData))
          toast.success("signup sucessfully")
          navigate("/")
        }
      }

    } catch (error) {
      toast.error(error.message)
      setError(error.message)

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div>
        <form
          onSubmit={handleSubmit(signup)}
          method='post'
          className=' w-120'
        >
          {error && <p className='text-red-600 mt-8 text-center'>{error}</p>}

          <h2 className='text-center text-2xl tracking-wider mb-5 uppercase'>Signup</h2>

          <Input
            type="name"
            placeholder="First Name"
            className=" "
            {...register("firstname", { required: true })}
          />

          <Input
            type="name"
            placeholder="Last Name"
            className=" "
            {...register("lastname", { required: true })}
          />

          <Input
            type="email"
            placeholder="Email"
            autoComplete="email"
            {...register("email", {
              required: true,
              // validate: {
              //   matchpattren: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Invalid email"
              // }
            })}
          />
          {errors.email && <p className='text-red-600 mt-8 text-center'>{errors.email.message}</p>}
          <Input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: true,

            })}
          />
          {errors.password && <p className='text-red-600 mt-8 text-center'>{errors.password.message}</p>}

          <Button
            type='submit'
            className='bg-black text-white w-full text-lg transition-all duration-150 
            active:scale-97 '
          >
            {isLoading ? "Signing Up..." : "Submit"}
          </Button>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Already have an account?&nbsp;
          <Link
            to='/Login'
            className='text-lg ml-1 hover:underline text-black hover:text-blue-600 transition-all  ' >
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default SignUpForm