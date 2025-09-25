import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function TextButtons() {
  return (
    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ width: '100%', mt: 1 }}>
      <Button type="submit" variant="text">Submit</Button>
      
      {/* <Button href="#text-buttons">Link</Button> */}
    </Stack>
  );
}
