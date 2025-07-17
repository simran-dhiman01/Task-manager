const express = require('express')
const app = express();
const cors = require('cors')
const taskRoutes = require('./routes/taskRoutes')

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.use('/api/tasks' , taskRoutes);


const PORT =8000
app.listen(PORT, ()=>{
    console.log(`Server running on PORT ${PORT}`); 
})