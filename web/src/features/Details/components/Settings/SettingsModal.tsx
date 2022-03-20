import React, { useState } from 'react';
import { Dialog, DialogContent, DialogContentText, Tab } from "@mui/material";
import { TabList, TabPanel, TabContext } from '@mui/lab'

interface SettingsModalProps {
	open: boolean;
	onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose }) => {
  const [tabValue, setTabValue] = useState('1');
  const handleTabChange = (e: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  }

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth={true}>
      <TabContext value={tabValue}>
        <DialogContent>
          <DialogContentText>Settings</DialogContentText>
          <TabList onChange={handleTabChange}>
            <Tab label="Permissions" value="1"/>
            <Tab label="Settings" value="2"/>
          </TabList>
          <TabPanel value="1">
	         
          </TabPanel>
          <TabPanel value="2">
            Blayt
          </TabPanel>
        </DialogContent>
      </TabContext>
		</Dialog>
	)
}

export default SettingsModal;
