import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes, Outlet } from 'react-router-dom';
import { PageLink, PageTitle } from '../../../../_metronic/layout/core';
import UserMaster from './components/UserMaster';
import BuilderMaster from './components/BuilderMaster';
import ProjectMaster from './components/ProjectMaster';
import { BuildingMaster } from './components/BuildingMaster';
import  UnitCategoryMaster  from './components/UnitCategoryMaster';
import BuildingUnitMaster from './components/BuildingUnitMaster';
import ClientMaster from './components/ClientMaster';
import { AgreementMaster } from './components/AgreementMaster';
import { AgreementTemplates } from './components/AgreementTemplates';
import { DocumentTypeMaster } from './components/DocumentTypeMaster';
import { UploadMaster } from './components/UploadMaster';
import FetchData from './components/FetchData';

export interface Status {
  isactive: boolean;
  isdeleted: boolean;
  [key: string]: boolean;
}

export interface Userdata {
  userid?: number;
	username: string;
	user_firstname: string;
	user_lastname: string;
	user_email: string;
	user_phone: string;
	user_password: string;
	user_confirmpassword: string;
	role: string;
	isactive: boolean;
	isdeleted: boolean;
}

export interface Builder {
  builderid: number;
  userid: string;
  companyname: string;
  companylogo: File | null;
  companyestyear: string;
  headofficephone: string;
  companydescription: string;
  headofficeaddress: string;
  headofficeemail: string;
  alternateofficeemail: string;
  alternateofficephone: string;
  alternateofficeaddress: string;
  isactive: boolean;
  isdeleted: boolean;
}

export interface Project {
  projectid: number;
  builderid: string;
  projectname: string;
  projectstartdate: string;
  projectenddate: string;
  projectarea: string;
  projectsiteaddress: string;
  surveyno: string;
  hissano: string;
  isactive: boolean;
  isdeleted: boolean;
}

export interface Building {
  buildingid: number;
  buildingname: string;
  builderid: number;
  projectid: number;
  buildingsiteaddress: string;
  buildingdescription: string;
  buildingreferencename: string;
  buildingwingname: string;
  buildingarea: string;
  nooffloors: string;
  noofflats: string;
  noofshops: string;
  noofotherunits: string;
  noofparking: string;
  isactive: boolean;
  isdeleted: boolean;
}

export interface UnitCategory {
  unitcategoryid: number;
  categoryname: string;
  categoryreferencename: string;
  isactive: boolean;
  isdeleted: boolean;
}

export interface BuildingUnit {
  buildingunitid: number;
  projectid: string;
  buildingid: string;
  unitshortname: string;
  unitreferencename: string;
  unitarea: string;
  unitareareference: string;
  unitcategoryid: string;
  isactive: boolean;
  isdeleted: boolean;
}

export interface Client {
  clientid?: number;
  clientname: string;
  clientreferencename: string;
  clientaddress: string;
  clientphone: string;
  clientemail: string;
  clientpanno: string;
  clientpanphoto: File | null;
  clientaadharno: string;
  clientaadharphoto: File | null;
  isactive: boolean;
  isdeleted: boolean;
}
interface Upload {
  uploadid:number;
  builderid?: string;
  projectid?: string;
  buildingid?: string;
  unitcategoryid?: string;
  documentfile: File | null;
  documenttitle: string;
  documentdescription: string;
  documenttags: string;
}

const chatBreadCrumbs: Array<PageLink> = [
  {
    title: 'Master',
    path: '/apps/master/user-master',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
];

const MasterPage: React.FC = () => {
  const [usersmas, setUsers] = useState<Userdata[]>([]);
  const [master_builders, setBuilders] = useState<Builder[]>([]);
  const [master_projects, setProjects] = useState<Project[]>([]);
  const [master_buildings, setBuildings] = useState<Building[]>([]);
  const [master_uploads, setUploads] = useState<Upload[]>([]);
  const [master_unitcategorys, setUnitCategorys] = useState<UnitCategory[]>([]);
  const [master_buildingunits, setBuildingUnits] = useState<BuildingUnit[]>([]);
  const [master_clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const userResponse = await fetch('http://localhost:5001/usermaster');
        if (!userResponse.ok) throw new Error('Failed to fetch users');
        const user_master = await userResponse.json();
        setUsers(user_master);

        const builderResponse = await fetch('http://localhost:5001/buildermaster');
        if (!builderResponse.ok) throw new Error('Failed to fetch builders');
        const builders = await builderResponse.json();
        setBuilders(builders);

        const projectResponse = await fetch('http://localhost:5001/projectmaster');
        if (!projectResponse.ok) throw new Error('Failed to fetch projects');
        const projects = await projectResponse.json();
        setProjects(projects);

        const buildingResponse = await fetch('http://localhost:5001/buildingmaster');
        if (!buildingResponse.ok) throw new Error('Failed to fetch buildings');
        const buildings = await buildingResponse.json();
        setBuildings(buildings);

        const unitCategoryResponse = await fetch('http://localhost:5001/unitcategorymaster');
        if (!unitCategoryResponse.ok) throw new Error('Failed to fetch unit categories');
        const unitCategories = await unitCategoryResponse.json();
        setUnitCategorys(unitCategories);

        const buildingUnitResponse = await fetch('http://localhost:5001/buildingunitmaster');
        if (!buildingUnitResponse.ok) throw new Error('Failed to fetch building units');
        const buildingUnits = await buildingUnitResponse.json();
        setBuildingUnits(buildingUnits);

        const clientResponse = await fetch('http://localhost:5001/clientmaster');
        if (!clientResponse.ok) throw new Error('Failed to fetch clients');
        const clients = await clientResponse.json();
        setClients(clients);

        const uploadResponse = await fetch('http://localhost:5001/uploadmaster');
        if (!uploadResponse.ok) throw new Error('Failed to fetch uploads');
        const uploads = await uploadResponse.json();
        setUploads(uploads);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSaveUser = (usermas: Userdata) => {
    setUsers(prevUsers => [...prevUsers, usermas]);
  };

  const handleSaveBuilder = (builder: Builder) => {
    setBuilders(prevBuilders => [...prevBuilders, builder]);
  };

  const handleSaveProject = (project: Project) => {
    setProjects(prevProjects => [...prevProjects, project]);
  };

  const handleSaveBuilding = (building: Building) => {
    setBuildings(prevBuildings => [...prevBuildings, building]);
  };

  const handleSaveUnitCategory = (unitcategory: UnitCategory) => {
    setUnitCategorys(prevUnitCategorys => [...prevUnitCategorys, unitcategory]);
  };

  const handleSaveBuildingUnit = (buildingunit: BuildingUnit) => {
    setBuildingUnits(prevBuildingUnits => [...prevBuildingUnits, buildingunit]);
  };

  const handleSaveClient = (client: Client) => {
    setClients(prevClients => [...prevClients, client]);
  };
  const handleSaveUpload = (upload: Upload) => {
    setUploads(prevUploads => [...prevUploads, upload]);
  };

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='user-master'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>User Master</PageTitle>
              <UserMaster onSaveUser={handleSaveUser} />
            </>
          }
        />
        <Route
          path='builder-master'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Builder Master</PageTitle>
              <BuilderMaster user_master={usersmas} onSaveBuilder={handleSaveBuilder} />
            </>
          }
        />
        <Route
          path='project-master'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Project Master</PageTitle>
              <ProjectMaster builders={master_builders} onSaveProject={handleSaveProject} />
            </>
          }
        />
        <Route
          path='building-master'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Building Master</PageTitle>
              <BuildingMaster
                builders={master_builders}
                projects={master_projects}
                onSaveBuilding={handleSaveBuilding}
              />
            </>
          }
        />
        <Route
          path='unitcategory-master'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Unit Category Master</PageTitle>
              <UnitCategoryMaster onSaveUnitCategory={handleSaveUnitCategory} />
            </>
          }
        />
        <Route
          path='buildingunit-master'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Building Unit Master</PageTitle>
              <BuildingUnitMaster
                projects={master_projects}
                buildings={master_buildings}
                unitcategorys={master_unitcategorys}
                onSaveBuildingUnit={handleSaveBuildingUnit}
              />
            </>
          }
        />
        <Route
          path='client-master'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Client Master</PageTitle>
              <ClientMaster onSaveClient={handleSaveClient} />
            </>
          }
        />
        <Route
          path='agreement-master'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Agreement Master</PageTitle>
              <AgreementMaster />
            </>
          }
        />
        <Route
          path='agreement-templates'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Agreement Templates</PageTitle>
              <AgreementTemplates />
            </>
          }
        />
        <Route
          path='documenttype-master'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Document Type Master</PageTitle>
              <DocumentTypeMaster />
            </>
          }
        />
        <Route
          path='upload-master'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Upload Master</PageTitle>
              <UploadMaster builders={master_builders}
               projects={master_projects}
                buildings={master_buildings}
                unitCategories={master_unitcategorys} onSaveUpload={handleSaveUpload} />
            </>
          }
        />
        <Route
          path='fetch-data'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Fetch Data</PageTitle>
              <FetchData />
            </>
          }
        />
        <Route index element={<Navigate to='/apps/master/user-master' />} />
      </Route>
    </Routes>
  );
};

export default MasterPage;
