import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { accessToken } from '../redux/userSlice';
import { BASEURL } from '../constant/constants';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
});

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
    const dispatch = useDispatch()
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const {data} = await axios.post(`${BASEURL}/login`, values);
      dispatch(accessToken(data.accessToken))
      toast.success("Login Successfully...")
      navigate('/home');
    } catch (error) {
      console.error(error);
      if (error.response) {
        setErrors({
          submit: error.response.data.message || 'Login failed. Please try again.'
        });
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-violet-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-10">
            <h2 className="text-4xl font-extrabold text-center text-violet-800 mb-2">
              Login
            </h2>
            <p className="text-center text-violet-500 mb-8">
              Welcome back! Please enter your details.
            </p>
            
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-violet-700 mb-2">
                      Email Address
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${
                        errors.email && touched.email 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-violet-300 focus:ring-violet-500'
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && touched.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="password" className="block text-sm font-medium text-violet-700">
                        Password
                      </label>
                      <a href="#" className="text-sm text-violet-600 hover:text-violet-500">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Field
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${
                          errors.password && touched.password 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-violet-300 focus:ring-violet-500'
                        }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-violet-400 hover:text-violet-600"
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && touched.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                  </div>
                  
                  {errors.submit && (
                    <div className="text-red-500 text-sm text-center mb-4">
                      {errors.submit}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-violet-600 text-white rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                  </button>
                </Form>
              )}
            </Formik>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-violet-600">
                Don't have an account?{' '}
                <span 
                  className='cursor-pointer text-violet-700 hover:text-violet-800' 
                  onClick={() => navigate('/register')}
                >
                  Sign up
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;