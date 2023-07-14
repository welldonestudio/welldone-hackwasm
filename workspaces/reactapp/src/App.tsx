import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { AppBar, Box, Tab, Tabs } from "@mui/material";
import Neutron from "./chain/Neutron";
import Juno from "./chain/Juno";

function LinkTab({ label, to, value, ...tabProps }: any) {
  return (
    <Tab
      component={Link}
      label={label}
      to={to}
      value={value}
      sx={{ textTransform: 'none' }}
      {...tabProps}
    />
  );
}

function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            indicatorColor="secondary"
            centered
          >
            <LinkTab label="Neutron" to="/neutron" value="/neutron" />
            <LinkTab label="Juno" to="/juno" value="/juno" />
          </Tabs>
        </AppBar>
        <Box sx={{ p: 3 }}>
          <Routes>
            <Route path="/neutron" element={<Neutron />} />
            <Route path="/juno" element={<Juno />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;