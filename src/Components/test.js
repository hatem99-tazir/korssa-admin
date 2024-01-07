import React, { useState } from 'react';

const DynamicForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const addField = () => {
    const newField = `field${Object.keys(formData).length + 1}`;
    setFormData((prevData) => ({
      ...prevData,
      [newField]: '',
    }));
  };

  const removeField = (fieldName) => {
    // Create a copy of the form data without the specified field
    const { [fieldName]: removedField, ...restFields } = formData;
    setFormData(restFields);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((fieldName) => (
          <div key={fieldName}>
            <label htmlFor={fieldName}>{fieldName}:</label>
            <input
              type="text"
              id={fieldName}
              name={fieldName}
              value={formData[fieldName]}
              onChange={handleInputChange}
            />
            <button type="button" onClick={() => removeField(fieldName)}>
              Remove Field
            </button>
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
      <button onClick={addField}>Add Field</button>
    </div>
  );
};

export default DynamicForm;
