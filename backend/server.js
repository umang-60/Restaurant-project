const express=require('express')
const app=express()
let foods=[]
app.use(express.json())

app.get('/', (req,res) => {
    res.send("Restaurant Management Backend");
});
app.get('/api/foods', (req, res) => {
    res.json(foods);
});
app.post('/api/foods', (req, res) => {
    const food = req.body;
    foods.push(food);
    res.status(201).json({
        message: "Food added successfully",
        food: food
    });
});
app.listen(3000,()=>{
    console.log(`server is running at http://localhost:3000`)
})
