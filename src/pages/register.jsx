import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { accessToken } from '../redux/userSlice';
import { toast } from 'react-toastify';
import { BASEURL } from '../constant/constants';

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .required('Username is required'),
  
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must include uppercase, lowercase, number, and special character'
    )
    .required('Password is required'),
  
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required')
});

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const { data } = await axios.post(`${BASEURL}/register`, values);
      dispatch(accessToken(data.accessToken))
      toast.success("Created account successfully...")
      navigate('/home');
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        setErrors({ submit: error.response.data.message });
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-violet-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-3xl font-bold text-center text-violet-800 mb-2">
              Create Account
            </h2>
            <p className="text-center text-violet-500 text-sm mb-6">
              Register to start your journey
            </p>
            
            <Formik
              initialValues={{
                username: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: ''
              }}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <Field
                      type="text"
                      name="username"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 
                        ${errors.username && touched.username 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-violet-300 focus:ring-violet-500'}`}
                      placeholder="Username"
                    />
                    {errors.username && touched.username && (
                      <div className="text-red-500 text-xs mt-1">{errors.username}</div>
                    )}
                  </div>

                  <div>
                    <Field
                      type="email"
                      name="email"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 
                        ${errors.email && touched.email 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-violet-300 focus:ring-violet-500'}`}
                      placeholder="Email Address"
                    />
                    {errors.email && touched.email && (
                      <div className="text-red-500 text-xs mt-1">{errors.email}</div>
                    )}
                  </div>

                  <div>
                    <Field
                      type="tel"
                      name="phone"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 
                        ${errors.phone && touched.phone 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-violet-300 focus:ring-violet-500'}`}
                      placeholder="Phone Number"
                    />
                    {errors.phone && touched.phone && (
                      <div className="text-red-500 text-xs mt-1">{errors.phone}</div>
                    )}
                  </div>
                  
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 
                        ${errors.password && touched.password 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-violet-300 focus:ring-violet-500'}`}
                      placeholder="Password"
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
                    {errors.password && touched.password && (
                      <div className="text-red-500 text-xs mt-1">{errors.password}</div>
                    )}
                  </div>

                  <div className="relative">
                    <Field
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 
                        ${errors.confirmPassword && touched.confirmPassword 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-violet-300 focus:ring-violet-500'}`}
                      placeholder="Confirm Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-violet-400 hover:text-violet-600"
                    >
                      {showConfirmPassword ? (
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
                    {errors.confirmPassword && touched.confirmPassword && (
                      <div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>
                    )}
                  </div>
                  
                  {errors.submit && (
                    <div className="text-red-500 text-xs text-center mb-2">{errors.submit}</div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 px-4 bg-violet-600 text-white rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-1 focus:ring-violet-500 transition duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </button>
                </Form>
              )}
            </Formik>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-violet-600">
                Already have an account?{' '}
                <span 
                  className='cursor-pointer text-violet-700 hover:text-violet-800' 
                  onClick={() => navigate('/')}
                >
                  Log in
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;