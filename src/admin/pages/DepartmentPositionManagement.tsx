import React, { useEffect, useState } from 'react';
import { Box, Button, Tabs, Tab } from '@mui/material';
import DepartmentTable from '../components/DepartmentTable';
import PositionTable from '../components/PositionTable';
import DepartmentDialog from '../components/DepartmentDialog';
import PositionDialog from '../components/PositionDialog';
import '../../shared/styles/App.css';
import { fetchDepartments, fetchPositions } from '../../utils/libs/axios';
import { useTranslation } from 'react-i18next';

export interface Department {
  id: number;
  name: string;
}

export interface Position {
  id: number;
  name: string;
  department_id: number;
  department: string;
}


function DepartmentPositionManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [openDepartmentDialog, setOpenDepartmentDialog] = useState(false);
  const [openPositionDialog, setOpenPositionDialog] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newPositionName, setNewPositionName] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [selectedDepartment] = useState('');
  const { t } = useTranslation('admin');
  
  

  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const departmentsData = await fetchDepartments();
      const positionsData = await fetchPositions();
      setDepartments(departmentsData);
      setPositions(positionsData);
      
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };
  

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOpenDepartmentDialog = () => {
    setOpenDepartmentDialog(true);
  };

  const handleCloseDepartmentDialog = () => {
    fetchData();
    setOpenDepartmentDialog(false);
    setNewDepartmentName('');
    setEditingDepartment(null);
    
  };

  const handleOpenPositionDialog = () => {
    setOpenPositionDialog(true);
  };

  const handleClosePositionDialog = () => {
    fetchData();
    setOpenPositionDialog(false);
    setNewPositionName('');
    setSelectedDepartmentId(null);
    setEditingPosition(null);
    
  };

  const handleAddDepartment = () => {
    if (newDepartmentName.trim() !== '') {
      const newDepartment: Department = {
        id: departments.length + 1,
        name: newDepartmentName,
      };
      setDepartments([...departments, newDepartment]);
      handleCloseDepartmentDialog();
    } 
  };

  const handleUpdateDepartment = () => {
    if (editingDepartment && newDepartmentName.trim() !== '') {
      setDepartments(departments.map(d =>
        d.id === editingDepartment.id ? { ...d, name: newDepartmentName } : d
      ));
      fetchData();
      handleCloseDepartmentDialog();
    } else {
      alert('Please enter a valid department name.');
    }
  };

  const handleAddPosition = () => {
    if (newPositionName.trim() !== '' && selectedDepartmentId) {
      const newPosition: Position = {
        id: positions.length + 1,
        name: newPositionName,
        department_id: selectedDepartmentId,
        department: selectedDepartment,
      };
      setPositions([...positions, newPosition]);
      fetchData();
      handleClosePositionDialog();
    } else {
      alert('Please enter a position name and select a department.');
    }
  };

  

  const handleUpdatePosition = () => {
    if (editingPosition && newPositionName.trim() !== '' && selectedDepartmentId) {
      setPositions(positions.map(p =>
        p.id === editingPosition.id ? { ...p, name: newPositionName, departmentId: selectedDepartmentId } : p
      ));
      fetchData();
      handleClosePositionDialog();
    } else {
      alert('Please enter a valid position name and select a department.');
    }
  };

  const handleDeleteDepartment = (departmentId: number) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter(d => d.id !== departmentId));
      setPositions(positions.filter(p => p.department_id !== departmentId));
      fetchData();
    }
  };

  const handleDeletePosition = (positionId: number) => {
    if (window.confirm('Are you sure you want to delete this position?')) {
      setPositions(positions.filter(p => p.id !== positionId));
      fetchData();
    }
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setNewDepartmentName(department.name);
    setOpenDepartmentDialog(true);
    
  };

  const handleEditPosition = (position: Position) => {
    setEditingPosition(position);
    setNewPositionName(position.name);
    setSelectedDepartmentId(position.department_id);
    setOpenPositionDialog(true);
  };

  return (   
    <Box sx={{ width: '100%', padding: 0, marginTop: 2}} className="DepartmentPositionManagement">
      <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label = {t('positionTable.changeDep')}/>
          <Tab label={t('positionTable.changePos')} />
        </Tabs>
      </Box>
      {activeTab === 0 && (
        <>
          <Button variant="outlined" onClick={handleOpenDepartmentDialog} sx={{marginTop: 2}}> 
          {t('departmentTable.dialogTitleAdd')}
          </Button>
          <DepartmentTable 
            departments={departments}
            onEdit={handleEditDepartment}
            onDelete={handleDeleteDepartment}
          />
          <DepartmentDialog
            open={openDepartmentDialog}
            onClose={handleCloseDepartmentDialog}
            department={editingDepartment}
            onSave={editingDepartment ? handleUpdateDepartment : handleAddDepartment}
          />
        </>
      )}

      {activeTab === 1 && (
        <>
          <Button variant="outlined" onClick={handleOpenPositionDialog} sx={{marginTop: 2}}>
          {t('positionTable.dialogTitleAdd')}
          </Button>
          <PositionTable
            positions={positions}
            departments={departments}
            onEdit={handleEditPosition}
            onDelete={handleDeletePosition}
          />
          <PositionDialog
            open={openPositionDialog}
            onClose={handleClosePositionDialog}
            position={editingPosition}
            departments={departments}
            onSave={editingPosition ? handleUpdatePosition : handleAddPosition}
          />
        </>
      )}
    </Box>
  );
}

export default DepartmentPositionManagement;
