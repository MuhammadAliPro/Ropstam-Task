import { Button, CssBaseline, Grid, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { unSetUserToken } from '../features/authSlice';
import { getToken, removeToken } from '../services/LocalStorageService';
import ChangePassword from './auth/ChangePassword';
import { useGetLoggedUserQuery } from '../services/userAuthApi';
import { useEffect, useState } from 'react';
import { setUserInfo, unsetUserInfo } from '../features/userSlice'; 
import Navbar from '../components/Navbar';
import ReactPaginate from "react-paginate";

const Dashboard = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { access_token } = getToken()
  const { data, isSuccess } = useGetLoggedUserQuery(access_token)
  const [carsData , setCarsData] = useState();
  const [cataData , setCataData] = useState();
 const [selectedCata, setSelectedcata] = useState();
 const [carColor, setCarColor] = useState('');
 const [carModel, setCarModel] = useState('');
 const [carId, setCarId] = useState('');
 const [carRegistrationNo, setCarRegistrationNo] = useState('');
 const [carCata, setCarCata] = useState('');
 let [Pages,setPages] = useState(0)



 const paginate = async (data) => {
  let Page = data.selected + 1;
  const cars = await fetch(`http://127.0.0.1:8000/cars/api/getcar?page=${Page}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' ,
    'authorization': `Bearer ${access_token}`,
  },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      setCarsData(data.results)

    })
    .catch((err) => console.log(err));

};


 
  useEffect(() => {
    getCars()
    getCatagories()

  },[])


const getCars = async() => {
  const cars = await fetch('http://127.0.0.1:8000/cars/api/getcar', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' ,
    'authorization': `Bearer ${access_token}`,
  },
  })
    .then((res) => res.json())
    .then((data) => {
      setPages(data.total_pages)
      setCarsData(data.results)

    })
    .catch((err) => console.log(err));
}


const getCarById = async(id) => {
  const cars = await fetch(`http://127.0.0.1:8000/cars/api/getcarbyid/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' ,
    'authorization': `Bearer ${access_token}`,
  },
  })
    .then((res) => res.json())
    .then((data) => {
    setCarCata(data.catagory)
      setCarId(data.id)
     setCarColor(data.color)
     setCarModel(data.model)
     setCarRegistrationNo(data.registrationNo)

    })
    .catch((err) => console.log(err));
}


const deleteCar = async(e) => {
  e.preventDefault();
  const cars = await fetch(`http://127.0.0.1:8000/cars/api/deletecar/${carId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' ,
    'authorization': `Bearer ${access_token}`,
  },
  })
    .then((res) => res.json())
    .then((data) => {
      document.location.reload()

    })
    .catch((err) => console.log(err));
}

const postCars = async(e) => {
  e.preventDefault();
  let colorvalue = document.querySelector('[name="color"]').value;
  let modelvalue = document.querySelector('[name="model"]').value;
  let registrationvalue = document.querySelector('[name="registrationNo"]').value;
  const data = {
    "catagory": selectedCata,
    "model": modelvalue,
    "color": colorvalue,
    "registrationNo": registrationvalue
}
const cars = await fetch('http://127.0.0.1:8000/cars/api/addcar', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' ,
  'authorization': `Bearer ${access_token}`,
},
body: JSON.stringify(data)

})
  .then((res) => res.json())
  .then((data) => {
    document.location.reload()
  })
  .catch((err) => console.log(err));


    
}


const getCatagories = async() => {
  const cars = await fetch('http://127.0.0.1:8000/cars/api/getcatagory', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' ,
    'authorization': `Bearer ${access_token}`,
  },
  })
    .then((res) => res.json())
    .then((data) => {
      setCataData(data)
      
    })
    .catch((err) => console.log(err));
}

const getDataByCatagory = async(e) => {
  const cars = await fetch(`http://127.0.0.1:8000/cars/api/getcarsbycatagory/${e}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' ,
    'authorization': `Bearer ${access_token}`,
  },
  })
    .then((res) => res.json())
    .then((data) => {
      setCarsData(data.results)
      
    })
    .catch((err) => console.log(err));
}




const showCars = () => {
  if(carsData){
    return(
        carsData.map((e,key) => {
          return(
          <tr key={key}>
          <td>{e.catagory.name}</td>
          <td>{e.model}</td>
          <td>{e.color}</td>
          <td>{e.registrationNo}</td>
          <td> <a href="#editEmployeeModal" onClick={() => getCarById(e.id)} className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a> <a href="#deleteEmployeeModal" className="delete" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Delete" onClick={() => getCarById(e.id)}>&#xE872;</i></a> </td>
        </tr>
          )
        })
    )

    
  }
}


const updateCar = async(e) => {
  e.preventDefault();
  const data = {
    "catagory": carCata.id,
    "model": carModel,
    "color": carColor,
    "registrationNo": carRegistrationNo
}
const cars = await fetch(`http://127.0.0.1:8000/cars/api/updatecar/${carId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' ,
  'authorization': `Bearer ${access_token}`,
},
body: JSON.stringify(data)

})
  .then((res) => res.json())
  .then((data) => {
    document.location.reload()

  })
  .catch((err) => console.log(err));


    
}

let handleCatagoryChange = (e) => {

  getDataByCatagory(e.target.value)
  setSelectedcata(e.target.value)
}

let handleChangeForEdit = (e) => {
  setCarCata(e.target.value)
}


const styles = {
  'marginTop': "20px",
  'marginRight':'100px'
}

  return (
    <>
  <Navbar/>
  <div className="container">
	<div className="table-wrapper">
		<div className="table-title">
			<div className="row">
				<div className="col-sm-6">
					<h2><b> Registered Cars</b></h2> </div>
          <br />

<select onChange={handleCatagoryChange}> 
  <option value="⬇️ Select a car⬇️"> -- Select a car -- </option>
        {/* Mapping through each fruit object in our fruits array
      and returning an option element with the appropriate attributes / values.
     */}
  {cataData? cataData.map((c) => <option key={c.id} value={c.id}>{c.name}</option>):null}
</select>
				<div className="col-sm-6 " style={styles}> 
        <a href="#addEmployeeModal" className="btn btn-success" data-toggle="modal">
       <span>Add New Cars</span></a> 
        </div>
			</div>
		</div>
		<table className="table table-striped table-hover">
			<thead>
				<tr>

					<th>catagory</th>
					<th>color</th>
					<th>model</th>
					<th>registrationNo</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>

        {showCars()}

			</tbody>
		</table>
		<div className="clearfix">
      {Pages === 1 || Pages === 0? null:

<ReactPaginate
        previousLabel={<a href="#">Previous</a>}
        nextLabel={<a href="#" className="page-link">Next</a>}
        breakLabel={"..."}
        pageCount={Math.ceil(Pages)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={paginate}
        containerClassName={"pagination"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-link"}
        previousLinkClassName={"page-link"}
        breakClassName={"page-link"}
        breakLinkClassName={"page-link"}
        activeClassName={"page-link"}
      />



}

		</div>
	</div>
</div>
<div id="addEmployeeModal" className="modal fade">
	<div className="modal-dialog">
		<div className="modal-content">
			<form>
				<div className="modal-header">
					<h4 className="modal-title">Add Car</h4>
					<button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				</div>
				<div className="modal-body">
					<div className="form-group">
						<label>Select a Catagory </label>
						<select onChange={handleCatagoryChange}> 
  <option value="⬇️ Select a car⬇️"> -- Select a car -- </option>
        {/* Mapping through each fruit object in our fruits array
      and returning an option element with the appropriate attributes / values.
     */}
  {cataData? cataData.map((c) => <option key={c.id} value={c.id}>{c.name}</option>):null}
</select>
            </div>
					<div className="form-group">
						<label>Color</label>
						<input type="text" name="color" className="form-control" required/> </div>
					<div className="form-group">
						<label>Model</label>
						<input type="text" name="model" className="form-control" required/>
					</div>
					<div className="form-group">
						<label>Registration No</label>
						<input type="text" name="registrationNo" className="form-control" required/> </div>
				</div>
				<div className="modal-footer">
					<input type="button" className="btn btn-default" data-dismiss="modal" value="Cancel"/>
					<input type="submit" className="btn btn-success" value="Add" onClick={(e) => postCars(e)}/> </div>
			</form>
		</div>
	</div>
</div>
<div id="editEmployeeModal" className="modal fade">
	<div className="modal-dialog">
		<div className="modal-content">
			<form>
				<div className="modal-header">
					<h4 className="modal-title">Edit Employee</h4>
					<button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				</div>
				<div className="modal-body">
					<div className="form-group">
						<label>Select a Catagory </label>
						<select onChange={handleChangeForEdit}> 
  <option value={carCata.id}>{carCata.name} </option>
        {/* Mapping through each fruit object in our fruits array
      and returning an option element with the appropriate attributes / values.
     */}
  {cataData? cataData.map((c) => <option key={c.id} value={c.id}>{c.name}</option>):null}
</select>
            </div>
            {carColor? 
            <>
					<div className="form-group">
						<label>Color</label>
						<input type="text" name="color" value={carColor} className="form-control" onChange={(e) => setCarColor(e.target.value)} required/> </div>
					<div className="form-group">
						<label>Model</label>
						<input type="text" name="model" value={carModel} className="form-control" onChange={(e) => setCarModel(e.target.value)} required/>
					</div>
					<div className="form-group">
						<label>Registration No</label>
						<input type="text" name="registrationNo" value={carRegistrationNo} className="form-control" onChange={(e) => setCarRegistrationNo(e.target.value)} required/> </div>
            </>
        : null }
				</div>
				<div className="modal-footer">
					<input type="button" className="btn btn-default" data-dismiss="modal" value="Cancel"/>
					<input type="submit" className="btn btn-info" value="Save" onClick={(e) => updateCar(e)} /> </div>
			</form>
		</div>
	</div>
</div>
<div id="deleteEmployeeModal" className="modal fade">
	<div className="modal-dialog">
		<div className="modal-content">
			<form>
				<div className="modal-header">
					<h4 className="modal-title">Delete Employee</h4>
					<button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				</div>
				<div className="modal-body">
					<p>Are you sure you want to delete these Records?</p>
					<p className="text-warning"><small>This action cannot be undone.</small></p>
				</div>
				<div className="modal-footer">
					<input type="button" className="btn btn-default" data-dismiss="modal" value="Cancel"/>
					<input type="submit" className="btn btn-danger" value="Delete" onClick={(e) => deleteCar(e)}/> 
          </div>
			</form>
		</div>
	</div>
</div>

  </>
  )
};

export default Dashboard;
