
import {useIntl} from 'react-intl'
import {KTIcon} from '../../../helpers'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'
import {AsideMenuItem} from './AsideMenuItem'

export function AsideMenuMain() {
  const intl = useIntl()

  return (
    <>
      <AsideMenuItem
        to='/dashboard'
        icon='black-right'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='bi-app-indicator'
      />
     {/* <AsideMenuItem to='/builder' icon='black-right' title='Layout Builder' fontIcon='bi-layers' /> */}

      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Apps</span>
        </div>
      </div>
      {/*<AsideMenuItemWithSub to='/apps/chat' title='Chat' fontIcon='bi-chat-left' icon='black-right'>
        <AsideMenuItem to='/apps/chat/private-chat' title='Private Chat' hasBullet={true} />
       
        <AsideMenuItem to='/apps/chat/usertable' title='User Table' hasBullet={true} />
        <AsideMenuItem to='/apps/chat/group-chat' title='Group Chart' hasBullet={true} />
        <AsideMenuItem to='/apps/chat/drawer-chat' title='Drawer Chart' hasBullet={true} />
      </AsideMenuItemWithSub>*/}
      <AsideMenuItemWithSub to='/apps/master' title='Master' fontIcon='bi-chat-left' icon='black-right'>
        <AsideMenuItem to='/apps/master/user-master' title='User Master' hasBullet={true} />
        <AsideMenuItem to='/apps/master/builder-master' title='Builder Master' hasBullet={true} />
        <AsideMenuItem to='/apps/master/project-master' title='Project Master' hasBullet={true} />
        <AsideMenuItem to='/apps/master/building-master' title='Building Master' hasBullet={true} />
        <AsideMenuItem to='/apps/master/unitcategory-master' title='Unit Category Master' hasBullet={true} />
        <AsideMenuItem to='/apps/master/buildingunit-master' title='Building Unit Master' hasBullet={true} />
        <AsideMenuItem to='/apps/master/client-master' title='Client Master' hasBullet={true} />
        <AsideMenuItem to='/apps/master/agreement-master' title='Agreement Master' hasBullet={true} />
        <AsideMenuItem to='/apps/master/agreement-templates' title='Agreement Templates' hasBullet={true} />
        <AsideMenuItem to='/apps/master/documenttype-master' title='Document Type Master' hasBullet={true} />
        <AsideMenuItem to='/apps/master/upload-master' title='Upload Master' hasBullet={true} />
        <AsideMenuItem to='/apps/master/fetch-data' title='Fetch Data' hasBullet={true} />

      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub to='/apps/localstorge-data' title='LocalStorage-Data' fontIcon='bi-chat-left' icon='black-right'>
      <AsideMenuItem to='/apps/localstorge-data/usermasterdata' title='User Master Data' hasBullet={true} />
      <AsideMenuItem to='/apps/localstorge-data/buildermasterdata' title='Builder Master Data' hasBullet={true} />
      <AsideMenuItem to='/apps/localstorge-data/projectmasterdata' title='Project Master Data' hasBullet={true} />
      <AsideMenuItem to='/apps/localstorge-data/buildingmasterdata' title='Building Master Data' hasBullet={true} />
      <AsideMenuItem to='/apps/localstorge-data/unitcategorymasterdata' title='Unit Category Master Data' hasBullet={true} />
      <AsideMenuItem to='/apps/localstorge-data/buildingunitmasterdata' title='Building Unit Master Data' hasBullet={true} />
      <AsideMenuItem to='/apps/localstorge-data/clientmasterdata' title='Client Master Data' hasBullet={true} />
      <AsideMenuItem to='/apps/localstorge-data/uploadmasterdata' title='Upload Master Data' hasBullet={true} />
     
      </AsideMenuItemWithSub>
    
      {/*<AsideMenuItem
        to='/apps/user-management/users'
        icon='black-right'
        title='User management'
        fontIcon='bi-layers'
      />*/}
      {/*<AsideMenuItem
        to='/apps/task-manager/tasks'
        icon='black-right'
        title='Task Manager'
        fontIcon='bi-layers'
      />*/}
    {/* <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Crafted</span>
        </div>
      </div>*/}
     {/* <AsideMenuItemWithSub
        to='/crafted/pages'
        title='Pages'
        fontIcon='bi-archive'
        icon='black-right'
      >
        <AsideMenuItemWithSub to='/crafted/pages/profile' title='Profile' hasBullet={true}>
          <AsideMenuItem to='/crafted/pages/profile/overview' title='Overview' hasBullet={true} />
          <AsideMenuItem to='/crafted/pages/profile/projects' title='Projects' hasBullet={true} />
          <AsideMenuItem to='/crafted/pages/profile/campaigns' title='Campaigns' hasBullet={true} />
          <AsideMenuItem to='/crafted/pages/profile/documents' title='Documents' hasBullet={true} />
          <AsideMenuItem
            to='/crafted/pages/profile/connections'
            title='Connections'
            hasBullet={true}
          />
        </AsideMenuItemWithSub>

        <AsideMenuItemWithSub to='/crafted/pages/wizards' title='Wizards' hasBullet={true}>
          <AsideMenuItem
            to='/crafted/pages/wizards/horizontal'
            title='Horizontal'
            hasBullet={true}
          />
          <AsideMenuItem to='/crafted/pages/wizards/vertical' title='Vertical' hasBullet={true} />
        </AsideMenuItemWithSub>
      </AsideMenuItemWithSub>*/}
      {/*<AsideMenuItemWithSub
        to='/crafted/accounts'
        title='Accounts'
        icon='black-right'
        fontIcon='bi-person'
      >
        <AsideMenuItem to='/crafted/account/overview' title='Overview' hasBullet={true} />
        <AsideMenuItem to='/crafted/account/settings' title='Settings' hasBullet={true} />
      </AsideMenuItemWithSub>*/}
      {/*<AsideMenuItemWithSub to='/error' title='Errors' fontIcon='bi-sticky' icon='black-right'>
        <AsideMenuItem to='/error/404' title='Error 404' hasBullet={true} />
        <AsideMenuItem to='/error/500' title='Error 500' hasBullet={true} />
      </AsideMenuItemWithSub>*/}
      {/*<AsideMenuItemWithSub
        to='/crafted/widgets'
        title='Widgets'
        icon='black-right'
        fontIcon='bi-layers'
      >
        <AsideMenuItem to='/crafted/widgets/lists' title='Lists' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/statistics' title='Statistics' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/charts' title='Charts' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/mixed' title='Mixed' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/tables' title='Tables' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/feeds' title='Feeds' hasBullet={true} />
      </AsideMenuItemWithSub>*/}
      
      {/*<div className='menu-item'>
        <div className='menu-content'>
          <div className='separator mx-1 my-4'></div>
        </div>
      </div>*/}
     {/* <div className='menu-item'>
        <a
          target='_blank'
          className='menu-link'
          href={import.meta.env.VITE_APP_PREVIEW_DOCS_URL + '/changelog'}
        >
          <span className='menu-icon'>
            <KTIcon iconName='document' className='fs-2' />
          </span>
          <span className='menu-title'>Changelog {import.meta.env.VITE_APP_VERSION}</span>
        </a>
      </div>*/}
    </>
  )
}
