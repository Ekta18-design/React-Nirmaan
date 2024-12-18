import {Navigate, Route, Routes, Outlet} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import Private , { FormValues }  from './components/Private'
import {Group} from './components/Group'
import {Drawer} from './components/Drawer'
import { FormikHelpers } from 'formik';
import UserTable from './components/UserTable'


const chatBreadCrumbs: Array<PageLink> = [
  {
    title: 'Chat',
    path: '/apps/chat/private-chat',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const ChatPage: React.FC = () => {
  const handleSubmit = async (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({values}),
        
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Data submitted successfully:', data);
      alert('Form submitted successfully');

      formikHelpers.resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again later.');
    } finally {
      formikHelpers.setSubmitting(false);
    }
  };

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='private-chat'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Private chat</PageTitle>
              <Private onSubmit={handleSubmit} />
                <UserTable/>
            </>
          }
        />
         
         <Route
          path='usertable'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>User Table</PageTitle>
             <UserTable/>
            </>
          }
        />
        <Route
          path='group-chat'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Group chat</PageTitle>
              <Group />
            </>
          }
        />
        <Route
          path='drawer-chat'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Drawer chat</PageTitle>
              <Drawer />
            </>
          }
        />
        <Route index element={<Navigate to='/apps/chat/private-chat' />} />
      </Route>
    </Routes>
  )
}

export default ChatPage
