import { KTCard } from '../../../../../_metronic/helpers';
import React, { useState, useEffect } from 'react';
import { BuildingUnit, Project, Building, UnitCategory } from '../../master/MasterPage';
import { useNavigate } from 'react-router-dom';

interface BuildingUnitWithNames extends BuildingUnit {
  projectName: string;
  buildingName: string;
  categoryName: string;
}

const BuildingUnitMasterData: React.FC = () => {
  const [buildingunits, setBuildingUnits] = useState<BuildingUnitWithNames[]>([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [buildingUnitResponse, projectResponse, buildingResponse, unitCategoryResponse] = await Promise.all([
          fetch('http://localhost:5001/buildingunitmaster'),
          fetch('http://localhost:5001/projectmaster'),
          fetch('http://localhost:5001/buildingmaster'),
          fetch('http://localhost:5001/unitcategorymaster'),
        ]);
  
        if (!buildingUnitResponse.ok || !projectResponse.ok || !buildingResponse.ok || !unitCategoryResponse.ok) {
          throw new Error('Failed to fetch data');
        }
  
        const buildingUnits = await buildingUnitResponse.json();
        const projectsData = await projectResponse.json();
        const buildingsData = await buildingResponse.json();
        const unitCategoriesData = await unitCategoryResponse.json();
  
        // Create ID-to-name mappings
        const projectMap = new Map<number, string>(
          projectsData.map((project: Project) => [project.projectid, project.projectname])
        );
        const buildingMap = new Map<number, string>(
          buildingsData.map((building: Building) => [building.buildingid, building.buildingname])
        );
        const unitCategoryMap = new Map<number, string>(
          unitCategoriesData.map((category: UnitCategory) => [category.unitcategoryid, category.categoryname])
        );
  
        // Map building units to include names
        const buildingUnitsWithNames = buildingUnits.map((unit: BuildingUnit) => ({
          ...unit,
          projectName: projectMap.get(Number(unit.projectid)) || 'Unknown Project',
          buildingName: buildingMap.get(Number(unit.buildingid)) || 'Unknown Building',
          categoryName: unitCategoryMap.get(Number(unit.unitcategoryid)) || 'Unknown Category',
        }));
  
        setBuildingUnits(buildingUnitsWithNames);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  const handleDelete = async (buildingunitid: number) => {
    if (buildingunitid === undefined) return;
    try {
      const response = await fetch(`http://localhost:5001/buildingunitmaster/${buildingunitid}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBuildingUnits(prevBuildingUnits => prevBuildingUnits.filter(buildingu => buildingu.buildingunitid !== buildingunitid));
      } else {
        console.error('Error deleting Building Unit');
      }
    } catch (error) {
      console.error('Error deleting Building Unit:', error);
    }
  };

  const handleEdit = (buildingunitid: number) => {
    if (buildingunitid === undefined) return; 
    navigate(`/apps/localstorge-data/editbuildingunitmaster/${buildingunitid}`);
  };

  return (
    <>
      <KTCard>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Data</span>
          </h3>
        </div>
        <div className='card-body py-3'>
          <div className='table-responsive'>
            <table className='table align-middle gs-0 gy-4'>
              <thead>
                <tr className='fw-bold text-muted bg-light'>
                  <th className='ps-4 min-w-50px'>Building Unit Id</th>
                  <th className='min-w-125px'>Project Name</th>
                  <th className='min-w-125px'>Building Name</th>
                  <th className='min-w-125px'>Unit Short Name</th>
                  <th className='min-w-125px'>Unit Reference Name</th>
                  <th className='min-w-125px'>Unit Area</th>
                  <th className='min-w-125px'>Unit Area Reference</th>
                  <th className='min-w-125px'>Unit Category Name</th>
                  <th className='min-w-125px'>Active</th>
                  <th className='min-w-125px'>Deleted</th>
                  <th className='min-w-125px' colSpan={2}>Actions</th>
                </tr>
              </thead>
              <tbody>
            {buildingunits.length > 0 ? (
              buildingunits.map(buildingunit => (
                <tr key={buildingunit.buildingunitid}>
                  <td>
                    <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                      {buildingunit.buildingunitid}
                    </div>
                  </td>
                  <td>
                    <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                      {buildingunit.projectName}
                    </div>
                  </td>
                  <td>
                    <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                      {buildingunit.buildingName}
                    </div>
                  </td>
                  <td>
                    <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                      {buildingunit.unitshortname}
                    </div>
                  </td>
                  <td>
                    <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                      {buildingunit.unitreferencename}
                    </div>
                  </td>
                  <td>
                    <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                      {buildingunit.unitarea}
                    </div>
                  </td>
                  <td>
                    <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                      {buildingunit.unitareareference}
                    </div>
                  </td>
                  <td>
                    <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                      {buildingunit.categoryName}
                    </div>
                  </td>
                  <td>
                    <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                      {buildingunit.isactive ? 'Yes' : 'No'}
                    </div>
                  </td>
                  <td>
                    <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                      {buildingunit.isdeleted ? 'Yes' : 'No'}
                    </div>
                  </td>
                  <td>
                    <button className='btn btn-primary btn-sm me-2'
                      onClick={() => handleEdit(buildingunit.buildingunitid)}> Edit </button>
                  </td>
                  <td>
                    <button className='btn btn-danger btn-sm'
                      onClick={() => handleDelete(buildingunit.buildingunitid)}> Delete </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12}>No data available</td>
              </tr>
            )}
          </tbody>
            </table>
          </div>
        </div>
      </KTCard>
    </>
  );
};

export default BuildingUnitMasterData;
