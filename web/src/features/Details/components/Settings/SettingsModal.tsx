import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogContentText, Tab, Typography } from "@mui/material";
import { TabList, TabPanel, TabContext } from '@mui/lab'
import PermissionPanel from './PermissionPanel';

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
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth={true}>
      <TabContext value={tabValue}>
        <DialogContent>
          <DialogContentText>Settings</DialogContentText>
          <TabList onChange={handleTabChange}>
            <Tab label="Members" value="1"/>
            <Tab label="Settings" value="2"/>
          </TabList>
          <TabPanel value="1">
	          <PermissionPanel />
          </TabPanel>
          <TabPanel value="2">
	          <Box>
		          <Typography>Danger Zone</Typography>
	            <Button style={{ marginTop: 10 }} variant="outlined">
		            Delete
	            </Button>
	          </Box>
          </TabPanel>
        </DialogContent>
      </TabContext>
		</Dialog>
	)
}

export default SettingsModal;
