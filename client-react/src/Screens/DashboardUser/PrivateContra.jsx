import React, { useState, useEffect } from 'react';
import authSvg from '../../assets/Login/reset.svg';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { updateUser, isAuth, getCookie, signout } from '../../helpers/auth';
import NavbarUser from './NavBar2/NavBar2';
import NavbarAdmin from '../DashboardAdmin/NavBar/NavBar';

const Private = ({ history }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password1: '',
    textChange: 'Update',
    role: '',
    suscripcion: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    const token = getCookie('token');
    axios
      .get(`${process.env.REACT_APP_API_URL}/user/${isAuth()._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        const { role, name, email, suscripcion } = res.data;
        setFormData({ ...formData, role, name, email, suscripcion });
      })
      .catch(err => {
        toast.error(`Error To Your Information ${err.response.statusText}`);
        if (err.response.status === 401) {
          signout(() => {
            history.push('/login');
          });
        }
      });
  };
  
  const { name, email, password1, textChange, role, suscripcion } = formData;
  const handleChange = text => e => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  const handleSubmit = e => {
    const token = getCookie('token');
    console.log(token);
    e.preventDefault();
    setFormData({ ...formData, textChange: 'Submitting' });
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/user/update`,
        {
          name,
          email,
          password: password1,
          suscripcion
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then(res => {
        updateUser(res, () => {
          toast.success('Cambio de contraseña, Exitoso');
          setFormData({ ...formData, textChange: 'Update' });
        });
      })
      .catch(err => {
        toast.error("Ingrese un minimo de 6 caracteres");
        console.log(err.response);
      });
  };

 // Navbar a usar
 let NavbarContent;
  
 if (role == "admin") {
   NavbarContent = NavbarAdmin;
 }else{
   NavbarContent = NavbarUser;
 }

  return (
    <>
    <NavbarContent/>
    <div className='min-h-screen bg-gray-100 text-gray-900 flex justify-center'>
      <ToastContainer />
      <div className='max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1'>
        <div className='lg:w-1/2 xl:w-5/12 p-6 sm:p-12'>
          <div className='mt-12 flex flex-col items-center'>
            <h1 className='text-2xl xl:text-3xl font-extrabold'>
              Cambiar Contraseña
            </h1>

            <form
              className='w-full flex-1 mt-8 text-indigo-500'
              onSubmit={handleSubmit}
            >
              <div className='mx-auto max-w-xs relative '>
                  <input
                  className='w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5'
                  type='email'
                  placeholder='Email'
                  disabled
                  value={email}
                />
                <input
                  className='w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5'
                  type='password'
                  placeholder='Password'
                  onChange={handleChange('password1')}
                  value={password1}
                />
                <button
                  type='submit'
                  className='mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none'
                >
                  <i className='fas fa-user-plus fa 1x w-6  -ml-2' />
                  <span className='ml-3'>{textChange}</span>
                </button>
              </div>
              
            </form>
          </div>
        </div>
        <div className='flex-1 bg-indigo-100 text-center hidden lg:flex'>
          <div
            className='m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat'
            style={{ backgroundImage: `url(${authSvg})` }}
          ></div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Private;