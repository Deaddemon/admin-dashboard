import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [editableRow, setEditableRow] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .then(response => {
        setUsers(response.data);
        setFilteredUsers(response.data);  
      })
      .catch(error => console.error(error));
  }, []);

  const handleCheckboxChange = (id) => {
    let newSelectedRows;

    if (id === 'header') {
      newSelectedRows = selectedRows.length === pageSize ? [] : paginatedUsers.map(user => user.id);
    } else {
      newSelectedRows = selectedRows.includes(id)
        ? selectedRows.filter(rowId => rowId !== id)
        : [...selectedRows, id];
    }

    setSelectedRows(newSelectedRows);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDeleteSelected = () => {
    const updatedUsers = users.filter(user => !selectedRows.includes(user.id));
    setUsers(updatedUsers);
    setSelectedRows([]);
  };

  const handleEditClick = (id) => {
    setEditableRow(id);
  };

  const handleSaveClick = () => {
    setEditableRow(null);
  };

  const handleDeleteClick = (id) => {
    const updatedUsers = users.filter(u => u.id !== id);
    setUsers(updatedUsers);
    setSelectedRows(selectedRows.filter(selectedId => selectedId !== id));
  };

  const handleSearch = () => {
 
    setFilteredUsers(
      users.filter(user =>
        Object.values(user).some(value =>
          value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();  
      handleSearch();
    }
  };

  const totalFilteredPages = Math.ceil(filteredUsers.length / pageSize);

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="App">
      <div className="header">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="search-icon" onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className="delete-selected" onClick={handleDeleteSelected}>
          <FaTrash color="red" size={20} />
          <span>Delete Selected</span>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange('header')}
                checked={selectedRows.length === paginatedUsers.length && paginatedUsers.length > 0}
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map(user => (
            <tr key={user.id} className={selectedRows.includes(user.id) ? 'selected' : ''}>
              <td>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(user.id)}
                  checked={selectedRows.includes(user.id)}
                />
              </td>
              <td>{user.id}</td>
              <td>
                {editableRow === user.id ? (
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => {
                      const updatedUsers = users.map(u => (u.id === user.id ? { ...u, name: e.target.value } : u));
                      setUsers(updatedUsers);
                    }}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editableRow === user.id ? (
                  <input
                    type="text"
                    value={user.email}
                    onChange={(e) => {
                      const updatedUsers = users.map(u => (u.id === user.id ? { ...u, email: e.target.value } : u));
                      setUsers(updatedUsers);
                    }}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editableRow === user.id ? (
                  <input
                    type="text"
                    value={user.role}
                    onChange={(e) => {
                      const updatedUsers = users.map(u => (u.id === user.id ? { ...u, role: e.target.value } : u));
                      setUsers(updatedUsers);
                    }}
                  />
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editableRow === user.id ? (
                  <button className="save" onClick={() => handleSaveClick()}>Save</button>
                ) : (
                  <button className="edit" onClick={() => handleEditClick(user.id)}>Edit</button>
                )}
                <button className="delete" onClick={() => handleDeleteClick(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button className="first-page" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>First Page</button>
        <button className="previous-page" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous Page</button>
        
        <button className="current-page" > <span>{currentPage}</span> </button>
        <button className="next-page" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalFilteredPages}>Next Page</button>
        <button className="last-page" onClick={() => handlePageChange(totalFilteredPages)} disabled={currentPage === totalFilteredPages}>Last Page</button>
      </div>
    </div>
  );
}

export default App;
