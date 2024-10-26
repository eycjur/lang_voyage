import { AppBar, Toolbar, Typography, IconButton, Tooltip } from "@mui/material";
import { Home, Settings } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const Navbar = ({ onMenuClick }) => {
  const { t } = useTranslation();

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Lang Voyage
        </Typography>

        <Tooltip title={t("home")}>
          <IconButton color="inherit">
            <Home />
          </IconButton>
        </Tooltip>

        <Tooltip title={t("settings")}>
          <IconButton color="inherit" onClick={onMenuClick}>
            <Settings />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
