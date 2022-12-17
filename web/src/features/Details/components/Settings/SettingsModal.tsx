import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogContentText, Tab, Typography } from "@mui/material";
import { TabList, TabPanel, TabContext } from '@mui/lab'
import PermissionPanel from './PermissionPanel';
import { useTranslation } from 'react-i18next';

interface SettingsModalProps {
	open: boolean;
	onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose }) => {
  const [tabValue, setTabValue] = useState('1');
  const handleTabChange = (e: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  }

  const [t] = useTranslation()

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth={true}>
      <TabContext value={tabValue}>
        <DialogContent>
          <DialogContentText>{t("SETTINGS_MODAL_TITLE")}</DialogContentText>
          <TabList onChange={handleTabChange}>
            <Tab label={t("MEMBERS_LABEL")} value="1"/>
            <Tab label={t("SETTINGS_LABEL")} value="2"/>
          </TabList>
          <TabPanel value="1">
	          <PermissionPanel />
          </TabPanel>
          <TabPanel value="2">
	          <Box>
		          <Typography>{t("DANGER_ZONE")}</Typography>
	            <Button style={{ marginTop: 10 }} variant="outlined">
		            {t("DELETE")}
	            </Button>
	          </Box>
          </TabPanel>
        </DialogContent>
      </TabContext>
		</Dialog>
	)
}

export default SettingsModal;
