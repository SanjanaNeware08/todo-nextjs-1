import * as React from 'react';
import TextField from '@mui/material/TextField';

type Props = {
  label: string;
  value: string;
  name?: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BasicTextFields({ label, value, onChange, type = "text", name }: Props) {
  return (
    <TextField
      id={`field-${name || label}`}
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      type={type}
      variant="standard"
      fullWidth
      margin="normal"
      InputLabelProps={{
        sx: {
          color: '#fff',
          '&.Mui-focused': { color: '#fff' }
        }
      }}
      InputProps={{
        sx: {
          color: '#fff',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' }
        }
      }}
    />
  );
}