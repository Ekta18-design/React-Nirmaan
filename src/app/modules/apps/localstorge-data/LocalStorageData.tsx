import React from 'react';
import {Navigate, Route, Routes, Outlet} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import UserMasterData from './components/UserMasterData';
import BuilderMasterData from './components/BuilderMasterData';
import ProjectMasterData from './components/ProjectMasterData';
import BuildingMasterData from './components/BuildingMasterData';
import UnitCategoryMasterData from './components/UnitCategoryMasterData';
import BuildingUnitMasterData from './components/BuildingUnitMasterData';
import EditUserMaster from './components/EditUserMaster';
import EditBuilderMaster from './components/EditBuilderMaster';
import EditProjectMaster from './components/EditProjectMaster';
import EditUnitCategoryMaster from './components/EditUnitCategoryMaster';
import ClientMasterData from './components/ClientMasterData';
import EditClientMaster from './components/EditClientMaster';
import { EditBuildingMaster } from './components/EditBuildingMaster';
import EditBuildingUnitMaster from './components/EditBuildingUnitMaster';
import UploadMasterData from './components/UploadMasterData';
import EditUploadMaster from './components/EditUploadMaster';


const chatBreadCrumbs: Array<PageLink> = [
  {
    title: 'LocalStorage-Data',
    path: '/apps/localstorge-data/usermasterdata',
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

const LocalStorageData: React.FC = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='usermasterdata'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>User Master Data</PageTitle>
              <UserMasterData/>
            </>
          }
        />
        <Route
          path='buildermasterdata'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Builder Master Data</PageTitle>
              <BuilderMasterData/>
            </>
          }
        />
        <Route
          path='projectmasterdata'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Project Master Data</PageTitle>
              <ProjectMasterData/>
            </>
          }
        />
        <Route
          path='buildingmasterdata'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Building Master Data</PageTitle>
              <BuildingMasterData/>
            </>
          }
        />
        <Route
          path='unitcategorymasterdata'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Unit Category Master Data</PageTitle>
              <UnitCategoryMasterData/>
            </>
          }
        />
        <Route
          path='buildingunitmasterdata'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Building Unit Master Data</PageTitle>
              <BuildingUnitMasterData/>
            </>
          }
        />
        <Route
          path='clientmasterdata'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Client Master Data</PageTitle>
              <ClientMasterData/>
            </>
          }
        />
         <Route
          path='uploadmasterdata'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Upload Master Data</PageTitle>
              <UploadMasterData/>
            </>
          }
        />
        <Route
          path='editusermaster/:userid'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Edit User Master </PageTitle>
              <EditUserMaster/>
            </>
          }
        />
        <Route
          path='editbuildermaster/:builderid'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Edit Builder Master </PageTitle>
              <EditBuilderMaster/>
            </>
          }
        />
        <Route
          path='editprojectmaster/:projectid'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Edit Project Master </PageTitle>
              <EditProjectMaster/>
            </>
          }
        />
        <Route
          path='editunitcategorymaster/:unitcategoryid'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Edit Unit Category Master </PageTitle>
              <EditUnitCategoryMaster/>
            </>
          }
        />
        <Route
          path='editclientmaster/:clientid'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Edit Client Master </PageTitle>
              <EditClientMaster/>
            </>
          }
        />
        <Route
          path='editbuildingmaster/:buildingid'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Edit Building Master </PageTitle>
              <EditBuildingMaster/>
            </>
          }
        />
        <Route
          path='editbuildingunitmaster/:buildingunitid'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Edit Building Unit Master </PageTitle>
              <EditBuildingUnitMaster/>
            </>
          }
        />
        <Route
          path='edituploadmaster/:uploadid'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Edit Upload Master </PageTitle>
              <EditUploadMaster/>
            </>
          }
        />
          
        <Route index element={<Navigate to='/apps/master/user-master' />} />
      </Route>
    </Routes>
  )
}

export default LocalStorageData;
