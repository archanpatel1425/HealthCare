import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginUser } from "../Store/patient/authslice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (values) => {
    try {
      const response = await dispatch(loginUser(values));
      if (response.payload.success) {
        toast.success(response.payload.message);
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error(response.payload);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  // return (
  //   <div className="flex justify-center items-center h-screen bg-gray-100">
  //     <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
  //       <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
  //       <Formik
  //         initialValues={{ identifier: "", password: "" }}
  //         onSubmit={handleSubmit}
  //       >
  //         {({ isSubmitting }) => (
  //           <Form>
  //             <div className="mb-4">
  //               <label
  //                 htmlFor="identifier"
  //                 className="block text-sm font-medium text-gray-700"
  //               >
  //                 Email
  //               </label>
  //               <Field
  //                 type="text"
  //                 name="identifier"
  //                 id="identifier"
  //                 placeholder="Enter Your Email"
  //                 className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
  //               />
  //               <ErrorMessage
  //                 name="identifier"
  //                 component="div"
  //                 className="text-red-500 text-sm mt-1"
  //               />
  //             </div>

  //             <div className="mb-4">
  //               <label
  //                 htmlFor="password"
  //                 className="block text-sm font-medium text-gray-700"
  //               >
  //                 Password
  //               </label>
  //               <Field
  //                 type="password"
  //                 name="password"
  //                 id="password"
  //                 placeholder="Enter Your Password"
  //                 className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
  //               />
  //               <ErrorMessage
  //                 name="password"
  //                 component="div"
  //                 className="text-red-500 text-sm mt-1"
  //               />
  //             </div>

  //             <button
  //               type="submit"
  //               disabled={isSubmitting}
  //               className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  //             >
  //               {isSubmitting ? "Submitting..." : "Login"}
  //             </button>
  //           </Form>
  //         )}
  //       </Formik>
  //       <div className="mt-4 flex flex-col gap-2">
  //         <button
  //           onClick={() => navigate("/signup/patient")}
  //           className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
  //         >
  //           Create Account as Patient
  //         </button>
  //         <button
  //           onClick={() => navigate("/signup/doctor")}
  //           className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
  //         >
  //           Create Account as Doctor
  //         </button>
  //       </div>
  //       <ToastContainer position="top-right" autoClose={3000} />
  //     </div>
  //   </div>
  // );
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 to-green-300" data-aos="zoom-in-up">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-green-700 mb-6">
          Login
        </h2>
        <Formik
          initialValues={{ identifier: "", password: "" }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <div>
                <label
                  htmlFor="identifier"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Field
                  type="text"
                  name="identifier"
                  id="identifier"
                  placeholder="Enter Your Email"
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
                <ErrorMessage
                  name="identifier"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter Your Password"
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
              >
                {isSubmitting ? "Submitting..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
        <div className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => navigate("/signup/patient")}
            className="w-full bg-white text-green-600 border border-green-600 py-2 px-4 rounded-lg font-semibold hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
          >
            Create Account as Patient
          </button>
          <button
            onClick={() => navigate("/signup/doctor")}
            className="w-full bg-white text-green-600 border border-green-600 py-2 px-4 rounded-lg font-semibold hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
          >
            Create Account as Doctor
          </button>
          {/* <button
            onClick={() => navigate("/signup/doctor")}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
          >
            Create Account as Doctor
          </button> */}
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default Login;
