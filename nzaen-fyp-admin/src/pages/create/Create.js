import { useState, useEffect } from 'react'
import { useCollection } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'
import { timestamp } from '../../firebase/config'
import { useFirestore } from '../../hooks/useFirestore'
import { useHistory } from 'react-router'
import { useDocument } from '../../hooks/useDocument'
import { projectAuth, projectStorage, projectFirestore } from '../../firebase/config'

import DateTimePicker from 'react-datetime-picker';

import { QuizzBuilder } from "react-quizzes"


import QuizExample from "./QuizExample";
import { Quiz } from "react-quizzes";


import Select, { components } from 'react-select'
import React from 'react'
import ReactDOM from 'react-dom';
import { ReactFormBuilder } from 'react-form-builder2';

import './Create.css'

export default function Create() {
  const [activeTab, setActiveTab] = useState('start');
  const [isLoading, setIsLoading] = useState(false); // New state variable

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [occupationFilter, setOccupationFilter] = useState(null);
  const [locationFilter, setLocationFilter] = useState(null);
  const [minAgeFilter, setMinAgeFilter] = useState(null);
  const [maxAgeFilter, setMaxAgeFilter] = useState(null);
  const history = useHistory()
  const { addDocument, response } = useFirestore('surveys')
  const { user } = useAuthContext()
  const { documents } = useCollection('users')
  const [users, setUsers] = useState([])
  const [desc, setDesc] = useState([])



  // form field values
  const [thumbnail, setThumbnail] = useState();
  const [file, setFile] = useState(null);
  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [assignedUsers, setAssignedUsers] = useState([])
  const [formError, setFormError] = useState(null)
  const [formdata, setFormData] = useState([]);



  const handlePrintFormData = () => {
    console.log(formdata);
  };
  // Before the component function
  const [occupations, setOccupations] = useState([]);
  const [locations, setLocations] = useState([]);

  const ages = [
    { value: '', label: 'All Ages' }, // Option for selecting all ages
    ...Array.from({ length: 100 }, (_, index) => ({
      value: index + 1,
      label: (index + 1).toString(),
    })),
  ];



  // create user values for react-select
  useEffect(() => {
    if (documents) {
      setUsers(documents.map(user => {
        return { value: { ...user, id: user.id }, label: user.displayName }
      }))
    }
  }, [documents])
  useEffect(() => {
    if (documents) {
      const allOccupations = Array.from(new Set(documents.map(user => user.occupation)));
      const allAges = Array.from(new Set(documents.map(user => user.age)));

      setUsers(documents.map(user => {
        return { value: { ...user, id: user.id }, label: user.displayName };
      }));



      const occupationOptions = [
        { value: '', label: 'All Occupations' }, // Option for selecting all occupations
        ...allOccupations.map(occupation => ({
          value: occupation,
          label: occupation
        }))
      ];

      setOccupations(occupationOptions);
    }
  }, [documents]);

  // Retrieve unique list of locations from documents
  useEffect(() => {
    if (documents) {
      const allLocations = Array.from(new Set(documents.map(user => user.location)));

      // Create location options array including option for selecting all locations
      const locationOptions = [
        { value: '', label: 'All Locations' }, // Option for selecting all locations
        ...allLocations.map(location => ({
          value: location,
          label: location
        }))
      ];

      setLocations(locationOptions);
    }
  }, [documents]);




  const handleSearchChange = e => {
    setSearchQuery(e.target.value);
  };

  const handleOccupationChange = selectedOption => {
    if (selectedOption.value === '') {
      setOccupationFilter(null); // All occupations selected
    } else {
      setOccupationFilter(selectedOption);
    }
  };

  // Handle location filter change
  const handleLocationChange = selectedOption => {
    if (selectedOption.value === '') {
      setLocationFilter(null); // All locations selected
    } else {
      setLocationFilter(selectedOption);
    }
  };


  const handleMinAgeChange = selectedOption => {
    setMinAgeFilter(selectedOption);
  };

  const handleMaxAgeChange = selectedOption => {
    setMaxAgeFilter(selectedOption);
  };

  const handleChange = (e) => {
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
    setThumbnail(e.target.files[0]);
  }


  const renderMediaPreview = () => {
    if (thumbnail) {
      if (thumbnail.type.includes('image')) {
        return <img src={URL.createObjectURL(thumbnail)} alt="Preview" />;
      } else if (thumbnail.type.includes('video')) {
        return <video src={URL.createObjectURL(thumbnail)} controls />;
      } else if (thumbnail.type.includes('audio')) {
        return <audio src={URL.createObjectURL(thumbnail)} controls />;
      }
    }
    return null;
  };


  const filteredUsers = documents && documents.filter(user => {
    let match = true;

    // Apply search query filter
    if (searchQuery) {
      match = user.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    }

    // Apply occupation filter
    if (occupationFilter && occupationFilter.value !== '') {
      const selectedOccupation = occupationFilter.value;
      match = match && user.occupation === selectedOccupation;
    }

    // Apply location filter
    if (locationFilter && locationFilter.value !== '') {
      const selectedLocation = locationFilter.value;
      match = match && user.location === selectedLocation;
    }


    // Apply age filter
    if (minAgeFilter && minAgeFilter.value !== '') {
      const minAge = parseInt(minAgeFilter.value);
      const userAge = parseInt(user.age);
      match = match && userAge >= minAge;
    }

    if (maxAgeFilter && maxAgeFilter.value !== '') {
      const maxAge = parseInt(maxAgeFilter.value);
      const userAge = parseInt(user.age);
      match = match && userAge <= maxAge;
    }

    return match;
  });

  const handleAddUser = () => {
    const modifiedUsers = filteredUsers.filter(user => {
      const userId = user.id;
      return !assignedUsers.some(assignedUser => assignedUser.value.id === userId);
    }).map(user => ({
      value: { ...user, id: user.id },
      label: user.displayName
    }));

    setAssignedUsers(prevUsers => [...prevUsers, ...modifiedUsers]);
  };




  const handleRemoveAllUsers = () => {
    setAssignedUsers([]);

  };

  const handleRemoveUser = user => {
    setAssignedUsers(prevUsers => {
      const filteredUserIds = filteredUsers.map(user => user.id);
      return prevUsers.filter(prevUser => !filteredUserIds.includes(prevUser.value.id));
    });
  };


  const handleSubmit = async (e) => {


    e.preventDefault()
    setFormError(null)


    if (assignedUsers.length < 1) {
      setFormError('Please assign the survey to at least 1 user')
      return
    }

    if (thumbnail == null) {
      setFormError('Thumbnail is null')
      return
    }


    if (dueDate == null) {
      setFormError('You have not set a due date')
      return
    }

    if (desc == null) {
      setFormError('You have not given a title')
      return
    }

    setIsLoading(true); // Start loading



    const createdBy = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid
    }



    // upload user thumbnail
    const uploadPath = `survey/${thumbnail.name}`
    const img = await projectStorage.ref(uploadPath).put(thumbnail)
    const imgUrl = await img.ref.getDownloadURL()

    const assignedUsersList = assignedUsers.map(u => {
      return {
        displayName: u.value.displayName,
        photoURL: u.value.photoURL,
        id: u.value.id
      }
    })

    const survey = {
      description: desc,
      photoURL: imgUrl,
      formdata,
      assignedUsersList,
      createdBy,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      comments: []
    }





    await addDocument(survey)
    setIsLoading(false); // Stop loading
    if (!response.error) {
      history.push('/')
    }
  }


  return (
    <div className="create-form">
      <h2 className="page-title">Create a new Survey</h2>
      <nav>
        <ul className="tabs">
          <li className={`tab ${activeTab === 'start' ? 'active' : ''}`}>
            <button onClick={() => handleTabClick('start')}>Initialise</button>
          </li>
          <li className={`tab ${activeTab === 'create' ? 'active' : ''}`}>
            <button onClick={() => handleTabClick('create')}>Build Form</button>
          </li>
          <li className={`tab ${activeTab === 'user' ? 'active' : ''}`}>
            <button onClick={() => handleTabClick('user')}>Assign Users</button>
          </li>
          <li className={`tab ${activeTab === 'end' ? 'active' : ''}`}>
            <button onClick={() => handleTabClick('end')}>Finalise</button>
          </li>
        </ul>
      </nav>

      <div className="content">
        <form onSubmit={handleSubmit}>
          {activeTab === 'start' && (
            <>
              <label>
                <span>What is the title of your survey?</span>
                <input
                  required
                  type="text"
                  onChange={(e) => setDesc(e.target.value)}
                  value={desc}
                />
              </label>


              <label>
                <span>When is the due date?</span>
                <input
                  required
                  type="date"
                  onChange={(e) => setDueDate(e.target.value)}
                  value={dueDate}
                />

              </label>
              <hr></hr>
              <div className="form-navigation">

                <button type="button" onClick={() => handleTabClick('create')}>Next</button>
              </div>
            </>
          )}

          {activeTab === 'create' && (
            <>
              <label>
                <span>Upload media</span>
                <input
                  required
                  type="file"
                  accept="image/*, video/*, audio/*"
                  onChange={handleChange}

                />

                <div class="previewImage">

                  {renderMediaPreview()}
                </div>

              </label>

              <div class='QuizzBuild'>
                <span>Build the layout of your survey</span>

                <QuizzBuilder
                  language="en"
                  onChange={setFormData}

                />
                <QuizExample data={formdata} />

              </div>
              <hr></hr>
              <div className="form-navigation">
                <button type="button" onClick={() => handleTabClick('start')}>Back</button>
                <button type="button" onClick={() => handleTabClick('user')}>Next</button>
              </div>
            </>
          )}
          {activeTab === 'user' && (
            <>
              <label>
                <div className="filterContainer">
                  <div className="filterItem">
                    <label>
                      <span>Search:</span>
                      <input type="text" value={searchQuery} onChange={handleSearchChange} />
                    </label>
                  </div>

                  <div className="filterItem">
                    <label>
                      <span>Occupation:</span>
                      <Select
                        value={occupationFilter}
                        onChange={handleOccupationChange}
                        options={occupations}
                      />
                    </label>
                  </div>
                  <div className="filterItem">
                    <label>
                      <span>Location:</span>
                      <Select
                        value={locationFilter}
                        onChange={handleLocationChange}
                        options={locations}
                      />
                    </label>
                  </div>

                  <div className="filterItem">
                    <label>
                      <span>Minimum Age:</span>
                      <Select
                        value={minAgeFilter}
                        onChange={handleMinAgeChange}
                        options={ages}
                      />
                    </label>
                  </div>

                  <div className="filterItem">
                    <label>
                      <span>Maximum Age:</span>
                      <Select
                        value={maxAgeFilter}
                        onChange={handleMaxAgeChange}
                        options={ages}
                      />
                    </label>
                  </div>
                </div>
              </label>
              <div className="section-title">

                <span>Filtered Users</span>
              </div>

              <div className="user-table-container">

                {filteredUsers && filteredUsers.length > 0 ? (

                  <table className="user-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Occupation</th>
                        <th>Age</th>
                        <th>Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user.id}>
                          <td>{user.displayName}</td>
                          <td>{user.occupation}</td>
                          <td>{user.age}</td>
                          <td>{user.location}</td>


                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No users found.</p>
                )}
              </div>
              <button type="button" onClick={() => handleAddUser()}>
                Add Users
              </button>
              <button type="button" onClick={() => handleRemoveUser()}>
                Remove Users
              </button>
              <button type="button" onClick={handleRemoveAllUsers}>
                Clear
              </button>
              <div className="section-title">

                <span>Assigned Users</span>
              </div>
              <div className="user-table-container">

                {assignedUsers && assignedUsers.length > 0 ? (
                  <table className="user-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Occupation</th>
                        <th>Age</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedUsers.map(user => (
                        <tr key={user.value.id}>
                          <td>{user.value.displayName}</td>
                          <td>{user.value.occupation}</td>
                          <td>{user.value.age}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No users found.</p>
                )}
              </div>

              <hr></hr>
              <div className="form-navigation">
                <button type="button" onClick={() => handleTabClick('create')}>Back</button>
                <button type="button" onClick={() => handleTabClick('end')}>Next</button>
              </div>
            </>
          )}
          {activeTab === 'end' && (
            <>
              <label>
                <span>Title : {desc}</span>
              </label>
              <label>
                <span>Due date : {dueDate}</span>
              </label>
              <label>
                <span>Media Preview</span>
                <div class="previewImage">

                  {renderMediaPreview()}
                </div>
              </label>
              <label>
                <span>Questions</span>
                <Quiz
                  data={formdata}
                  onSubmit={values => console.log("form submit values", values)}
                />

              </label>


              <div className="section-title">

                <span>Assigned Users</span>
              </div>
              <div className="user-table-container">

                {assignedUsers && assignedUsers.length > 0 ? (
                  <table className="user-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Occupation</th>
                        <th>Age</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedUsers.map(user => (
                        <tr key={user.value.id}>
                          <td>{user.value.displayName}</td>
                          <td>{user.value.occupation}</td>
                          <td>{user.value.age}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No users found.</p>
                )}
              </div>

              <hr></hr>




              {formError && <p className="error">{formError}</p>}
              <hr></hr>
              <div className="form-navigation">
                <button type="button" onClick={() => handleTabClick('user')}>Back</button>
                <button disabled={isLoading}>{isLoading ? 'Creating...' : 'Submit'}</button>
              </div>


            </>

          )}

        </form>
      </div>

      {/* Rest of your code */}
    </div>
  );
}
