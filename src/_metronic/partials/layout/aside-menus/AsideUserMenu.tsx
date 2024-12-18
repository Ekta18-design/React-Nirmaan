import { FC,  useEffect,useState } from 'react';
import { KTIcon, toAbsoluteUrl } from '../../../helpers';
import { UserMenu } from '../user-menu/UserMenu';
import axios from 'axios';

// Helper to get the userid from either localStorage or cookies
const getUserId = () => {
  const userIdFromLocalStorage = localStorage.getItem('userid');
  const userIdFromCookie = document.cookie.split('; ').find(row => row.startsWith('userid='))?.split('=')[1];
  return userIdFromLocalStorage || userIdFromCookie;
};


interface User {
  email: string;
  user_firstname: string;
  username:string;
  role?: string;
}

interface AsideUserMenuProps {
  user: User | null;
}

const AsideUserMenu: FC<AsideUserMenuProps> = () => {
  const [user, setUser] = useState<User | null>(null);
   // Fetch user data from usermaster API
   useEffect(() => {
    const fetchUserData = async () => {
      const userId = getUserId(); // Get the userid from localStorage or cookie
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:5001/usermaster/${userId}`);
          setUser(response.data); // Assuming the response structure is correct
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);
  return (
    <div className='d-flex flex-stack'>
      <div className='d-flex align-items-center'>
        <div className='symbol symbol-circle symbol-40px'>
          <img src={toAbsoluteUrl('media/avatars/300-1.jpg')} alt='avatar' />
        </div>
        <div className='ms-2'>
          <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bolder lh-1'>
            {user?.user_firstname || 'First Name'}
          </a>
          <span className='text-muted fw-bold d-block fs-7 lh-1'>{user?.role || 'Role'}</span>
        </div>
      </div>
      <div className='ms-1'>
        <div
          className='btn btn-sm btn-icon btn-active-color-primary position-relative me-n2'
          data-kt-menu-trigger='click'
          data-kt-menu-overflow='false'
          data-kt-menu-placement='top-end'
        >
          <KTIcon iconName='setting-2' className='fs-1' />
        </div>
        <UserMenu user={user}/>
      </div>
    </div>
  );
};

export { AsideUserMenu };
