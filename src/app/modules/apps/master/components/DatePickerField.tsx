import React from 'react';
import { useField, useFormikContext } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Define types for props
interface DatePickerFieldProps  {
  name: string;
  label: string;}
  
const DatePickerField: React.FC<DatePickerFieldProps> = ({ label, name }) => {
  const [field, meta] = useField<Date | null>(name);
  const { setFieldValue } = useFormikContext();

  return (
    <div className="col-md-6 fv-row">
      <label className="fs-5 fw-semibold mb-2">{label}</label>
      <DatePicker selected={field.value ? new Date(field.value) : null} 
      onChange={date => setFieldValue(name,date)} className="form-control form-control-solid" dateFormat="yyyy-MM-dd"/>
     
       {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default DatePickerField;
