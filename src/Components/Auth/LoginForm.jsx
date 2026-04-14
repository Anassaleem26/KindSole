import React, { useState } from 'react'
import { Input, Button } from '../../index'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import authservice from '../../Firebase/Auth-services';
import { login as sliceLogin } from '../../Store/authSlice';
import { toast } from 'sonner';

function LoginForm() {

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const userLogin = async (data) => {

    try {
      setError("")
      setIsLoading(true);

      let session = await authservice.login(data)
      if (session) {

        let userData = await authservice.getCurrentUser();

        if (userData) {

          const role = await authservice.getUserRole(userData.uid);

          const fullUserData = { ...userData, role }
          dispatch(sliceLogin(fullUserData))

          if (role === "admin") {
            toast.success("Wellcome Admin!")
            navigate("admin-dashboard")
          } else {
            toast.success("Login sucessfully")
            navigate("/")
          }
        }
      }
    } catch (error) {

      toast.error(error.message)
      setError(error)
      console.log("login error", error);

    } finally {
      setIsLoading (false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div>
        <form
          onSubmit={handleSubmit(userLogin)}
          className=' w-120'>
          <div>
            <h2 className='text-center text-2xl tracking-wider mb-5 uppercase'>login</h2>

            {error && <p className='text-red-600 mt-8 text-center'>{error}</p>}

            <div>
              <Input
                type="email"
                placeholder="Email"
                autoComplete="email"
                {...register("email", {
                  required: true,
                  validate: {
                    matchpattren: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Invalid email"
                  }
                })}
              />
              {errors.email && <p className='text-red-600 mt-8 text-center'>{errors.email.message}</p>}

            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: true,

                })}
              />
              {errors.password && <p className='text-red-600 mt-8 text-center'>{errors.password.message}</p>}
            </div>

            <Button type="submit" className="bg-black text-white w-full text-lg transition-all duration-150 
            active:scale-97" >
              {isLoading ? "Processing..." : "Login"}
            </Button>

          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Don&apos;t have any account?&nbsp;
          <Link
            to='/Signup'
            className='text-lg ml-1 hover:underline text-black hover:text-blue-600 transition-all  ' >
            Signup
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginForm