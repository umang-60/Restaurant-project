let foods=[]
let editIndex = -1;
const form=document.getElementById("foodform");
const foodname=document.getElementById("foodname");
const price=document.getElementById("price");
const category=document.getElementById("category");
const description=document.getElementById("description");
const tablebody=document.querySelector("#foodtable tbody");

form.addEventListener("submit", function(e){
    e.preventDefault();
    if(foodname.value.trim()==""){
        alert("please fill the food entry");
        return;
    }
    if(price.value === "" || Number(price.value) <= 0){
        alert("Please enter a valid price");
        return;
    }
    if(category.value.trim()==""){
        alert("please fill up the category");
        return;
    }
    if(description.value.trim()==""){
        alert("please fill up the description");
        return;
    }

    
    let fooditem={
        name:foodname.value,
        price:price.value,
        category:category.value,
        description:description.value
    }
   if(editIndex === -1){

        foods.push(fooditem);

    }else{

        foods[editIndex] = fooditem;

        editIndex = -1;
    }
    console.log(foods)

    displayfoods();
    form.reset();
    if(editIndex === -1){
        alert("Food added successfully");
    }else{
        alert("Food updated successfully");
    }

});

function displayfoods(){
    tablebody.innerHTML=""

    foods.forEach(function(item,index){
        const row=document.createElement("tr");
        row.innerHTML=`
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td>${item.category}</td>
            <td>${item.description}</td>
            <td>
                <button onclick="editFood(${index})">Edit</button>
                <button onclick="deletefood(${index})">Delete</button>
            </td>
        `;
        tablebody.appendChild(row);
        
    });
}
    function deletefood(index){
        if(confirm("Are you sure you want to delete this food?")){
            foods.splice(index,1);
            displayFoods();
        }
    }
    function editFood(index){

        foodname.value = foods[index].name;
        price.value = foods[index].price;
        category.value = foods[index].category;
        description.value = foods[index].description;

        editIndex = index;
        document.querySelector('button[type="submit"]').textContent = "Update Food";
    }



