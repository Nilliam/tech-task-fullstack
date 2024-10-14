import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { Box, Button, Typography } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

interface SearchFilterProps {
  selectedDate: Dayjs | null;
  handleDateChange: (date: Dayjs | null) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  selectedDate,
  handleDateChange,
}) => {
  return (
    <div>
     <Box display="flex" alignItems="center" gap={1}>
      <FilterListIcon />
      <Typography variant="h6">Books Published After</Typography>
      {selectedDate && <Button onClick={() => handleDateChange(null)}><RemoveCircleIcon color="error"/></Button>}
    </Box>
      <DatePicker
        label="Select a Date"
        value={selectedDate}
        onChange={handleDateChange}
        format="DD/MM/YYYY"
      />
    </div>
  );
};

export default SearchFilter;
