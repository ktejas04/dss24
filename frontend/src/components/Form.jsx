import React, { useState } from 'react';
import axios from 'axios';

const Form = () => {

  const url = "https://dss24.onrender.com";
  const [registrationType, setRegistrationType] = useState('solo');
  const [data, setData] = useState({
    name: "",
    email: "",
    college: "",
    phone: "",
    teamName: "",
    teamCollege: "",
    numberOfMembers: 2,
    members: [{ name: "", phone: "", email: "" }, { name: "", phone: "", email: "" }],
    isTeam: false
  });

  const onChangeHandler = (event) => {
    setData(data => ({
      ...data,
      [event.target.name]: event.target.value
    }));
  }

  const onMemberChangeHandler = (index, event) => {
    const updatedMembers = data.members.map((member, i) => 
      i === index ? { ...member, [event.target.name]: event.target.value } : member
    );
    setData(data => ({
      ...data,
      members: updatedMembers
    }));
  }

  const addMember = () => {
    setData(data => ({
      ...data,
      members: [...data.members, { name: "", phone: "", email: "" }]
    }));
  }

  const sendData = async (event) => {
    event.preventDefault();

    console.log(registrationType);
    
    try {
      if (registrationType === "solo" ) {
        setData(data => ({
          ...data,
          isTeam: false
        }))
      } 
      else {
        setData(data => ({
          ...data,
          isTeam: true
        }))
      }
      
      const response = await axios.post(`${url}/api/v1/user/register`, data);
      if (response.data.success) {
        alert("Registration successful")
      }
      else {
        alert(response.data.message);
        
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h2>Register as:</h2>
      <div>
        <label>
          <input
            type="radio"
            value="solo"
            checked={registrationType === 'solo'}
            onChange={() => {
              setRegistrationType('solo');
              setData(data => ({
                ...data,
                isTeam: false
              }))
            }}
          />
          Solo
        </label>
        <label>
          <input
            type="radio"
            value="team"
            checked={registrationType === 'team'}
            onChange={() => {
              setRegistrationType('team');
              setData(data => ({
                ...data,
                isTeam: true
              }))
            }}
          />
          Team
        </label>
      </div>

      <form className='form' onSubmit={sendData}>
        {registrationType === 'solo' && (
          <>
            <label htmlFor="name">Name </label>
            <input type="text" id="name" name="name" onChange={onChangeHandler} value={data.name}/>

            <label htmlFor="email">Email </label>
            <input type="email" id="email" name="email" onChange={onChangeHandler} value={data.email}/>

            <label htmlFor="college">College </label>
            <input type="text" id="college" name="college" onChange={onChangeHandler} value={data.college}/>
            
            <label htmlFor="phone">Phone Number </label>
            <input type="text" id="phone" name="phone" onChange={onChangeHandler} value={data.phone}/>
          </>
        )}

        {registrationType === 'team' && (
          <>
            <label htmlFor="teamName">Team Name </label>
            <input type="text" id="teamName" name="teamName" onChange={onChangeHandler} value={data.teamName}/>

            <label htmlFor="teamCollege">Team College </label>
            <input type="text" id="teamCollege" name="teamCollege" onChange={onChangeHandler} value={data.teamCollege}/>

            <label htmlFor="numberOfMembers">Number of Members </label>
            <input
              type="number"
              id="numberOfMembers"
              name="numberOfMembers"
              min="2"
              max="6"
              onChange={onChangeHandler}
              value={data.numberOfMembers}
              onBlur={() => {
                const membersCount = Math.max(2, data.numberOfMembers);
                setData(data => ({
                  ...data,
                  members: data.members.slice(0, membersCount).concat(
                    Array(Math.max(0, membersCount - data.members.length)).fill({ name: "", phone: "" })
                  )
                }));
              }}
            />

            {data.members.map((member, index) => (
              <div key={index}>
                <label htmlFor={`memberName${index}`}>Member {index + 1} Name </label>
                <input
                  type="text"
                  id={`memberName${index}`}
                  name="name"
                  onChange={(event) => onMemberChangeHandler(index, event)}
                  value={member.name}
                />

                <label htmlFor={`memberPhone${index}`}>Member {index + 1} Email </label>
                <input
                  type="email"
                  id={`memberEmail${index}`}
                  name="email"
                  onChange={(event) => onMemberChangeHandler(index, event)}
                  value={member.email}
                />

                <label htmlFor={`memberPhone${index}`}>Member {index + 1} Phone </label>
                <input
                  type="text"
                  id={`memberPhone${index}`}
                  name="phone"
                  onChange={(event) => onMemberChangeHandler(index, event)}
                  value={member.phone}
                />                
              </div>
            ))}
          </>
        )}

        <button type='submit' className='submit-btn'>Submit</button>
      </form>
    </div>
  )
}

export default Form;
