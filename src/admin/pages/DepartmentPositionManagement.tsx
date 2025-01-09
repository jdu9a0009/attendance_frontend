import React, { useEffect, useState } from 'react';
import { Box, Button, Tabs, Tab } from '@mui/material';
import DepartmentTable from '../components/DepartmentTable';
import PositionTable from '../components/PositionTable';
import DepartmentDialog from '../components/DepartmentDialog';
import PositionDialog from '../components/PositionDialog';
import '../../shared/styles/App.css';
import { fetchDepartments, fetchPositions } from '../../utils/libs/axios';
import { useTranslation } from 'react-i18next';
// import { Department } from '../components/Table/types'

export interface Department {
  id: number;
  name: string;
  display_number: number; // Новый параметр
  department_nickname: string;
}


export interface Position {
  id: number;
  name: string;
  department_id: number;
  department: string;
}

export interface DepartmentResponse {
  count: number;
  displayNumber: number;  
  results: Department[];
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
  const [newDepartmentNickName, setNewDepartmentNickName] = useState('');
  const [newPositionName, setNewPositionName] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [selectedDepartment] = useState('');
  const [selectedDisplayNumber, setSelectedDisplayNumber] = useState<number>(0);
  const [nextDisplayNumber, setNextDisplayNumber] = useState<number>(0);
  const { t } = useTranslation('admin');
  
  

  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const data = await fetchDepartments();
      
      if (data) {
        const { departments, nextDisplayNumber } = data;
        const positionsData = await fetchPositions();
  
        setDepartments(departments || []); // Если departments не определены, используем пустой массив
        setPositions(positionsData || []);
        setNextDisplayNumber(nextDisplayNumber || 1); // Если nextDisplayNumber не определен, используем 1 как значение по умолчанию
      } else {
        console.error("No data received from fetchDepartments");
      }
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
        id: departments.length + 1, // Это значение можно адаптировать в зависимости от логики вашего приложения
        name: newDepartmentName,
        display_number: nextDisplayNumber, 
        department_nickname: newDepartmentNickName,
      };
  
      setDepartments([...departments, newDepartment]);
      handleCloseDepartmentDialog();
    }
  };
  
  

  const handleUpdateDepartment = () => {
    if (editingDepartment && newDepartmentName.trim() !== '') {
      const updatedDepartments = [...departments];
      const currentDisplayNumber = editingDepartment.display_number;
      
      // Если пользователь выбрал новый display_number
      if (selectedDisplayNumber !== currentDisplayNumber) {
        // Находим департамент с которым нужно поменяться
        const departmentToSwap = updatedDepartments.find(
          dep => dep.display_number === selectedDisplayNumber
        );
        
        if (departmentToSwap) {
          // Меняем display_number местами
          departmentToSwap.display_number = currentDisplayNumber;
          editingDepartment.display_number = selectedDisplayNumber;
        }
      }
  
      // Обновляем имя департамента
      editingDepartment.name = newDepartmentName;
      
      setDepartments(updatedDepartments);
      handleCloseDepartmentDialog();
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
      alert('役職名を入力し、 部署を選択してください。');
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
      alert(' 有効な 役職名を入力し、 部署を選択してください。');
    }
  };

  const handleDeleteDepartment = (departmentId: number) => {
    if (window.confirm('この部署を削除しますか？')) {
      setDepartments(departments.filter(d => d.id !== departmentId));
      setPositions(positions.filter(p => p.department_id !== departmentId));
      fetchData();
    }
  };

  const handleDeletePosition = (positionId: number) => {
    if (window.confirm('この役職を削除しますか？')) {
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
  departments={departments}
  nextDisplayNumber={nextDisplayNumber} // Передаем nextDisplayNumber
  onDisplayNumberChange={(number) => setSelectedDisplayNumber(number)}
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