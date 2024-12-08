import React from "react";
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { X } from 'lucide-react';
import { toast } from "react-toastify";
import userApiClient from "../services/userApi.js";
import { BASEURL } from "../constant/constants.js";

const ChangePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Old password is required'),
  newPassword: Yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .notOneOf([Yup.ref('oldPassword')], 'New password must be different from old password'),
  confirmPassword: Yup.string()
    .required('Please confirm your new password')
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
});

const PasswordChangeModal = ({ isOpen, onClose }) => {
  const handleChangePassword = async (values, { setSubmitting, resetForm }) => {
    try {
      await userApiClient.post(`${BASEURL}/changePassword`, {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      });
      toast.success("Password changed successfully");
      onClose();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
      console.error('Password change failed', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-5 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Change Password</h2>
          <button 
            onClick={onClose}
            className="hover:bg-white/20 rounded-full p-1 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <Formik
          initialValues={{ oldPassword: '', newPassword: '', confirmPassword: '' }}
          validationSchema={ChangePasswordSchema}
          onSubmit={handleChangePassword}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="p-6 space-y-4">
              <div>
                <label className="block mb-2 text-indigo-800">Old Password</label>
                <Field
                  name="oldPassword"
                  type="password"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${
                    errors.oldPassword && touched.oldPassword
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-indigo-300 focus:ring-indigo-500'
                  }`}
                  placeholder="Enter old password"
                />
                {errors.oldPassword && touched.oldPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-indigo-800">New Password</label>
                <Field
                  name="newPassword"
                  type="password"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${
                    errors.newPassword && touched.newPassword
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-indigo-300 focus:ring-indigo-500'
                  }`}
                  placeholder="Enter new password"
                />
                {errors.newPassword && touched.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-indigo-800">Confirm New Password</label>
                <Field
                  name="confirmPassword"
                  type="password"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${
                    errors.confirmPassword && touched.confirmPassword
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-indigo-300 focus:ring-indigo-500'
                  }`}
                  placeholder="Confirm new password"
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PasswordChangeModal;