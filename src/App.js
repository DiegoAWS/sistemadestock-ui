import React from "react";
import { Grid, Button, Paper } from "@material-ui/core";



 import icons from './icons'
function App() {
 
  return (
    <div className="App">
      <Grid
        container
        spacing={1}
        direction="row"
        alignItems="center"
       
      >
        {icons.map((item,i) => (
          <Grid item xs={1} key={i}>
            <Button color="primary">
              <Paper component={require(`@material-ui/icons/${item.name}`).default} />
            </Button>
          </Grid>
        ))}

       
      </Grid>
    </div>
  );
}

export default App;
