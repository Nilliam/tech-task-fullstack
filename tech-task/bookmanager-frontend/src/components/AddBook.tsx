import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBook } from "../features/bookReducer";
import { createBook } from "../api/api";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import {  Box, Button, Card, TextField, Typography } from "@mui/material";

const AddBook = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const dateFormat = "YYYY-MM-DD";

  const handleAddBook = async () => {
    if (!title || !author || !publishedDate) return;

    const newBook = await createBook({ title, author, publishedDate });
    dispatch(addBook(newBook));
    setTitle("");
    setAuthor("");
    setPublishedDate("");
  };

  const handlePublishedDate = (date: Dayjs | null) => {
    setPublishedDate(date ? date.format(dateFormat) : "");
  };

  return (
    <Card sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Add Book
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          fullWidth
          type="text"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          fullWidth
          type="text"
          label="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <DatePicker
          label="Published Date"
          format="DD/MM/YYYY"
          value={publishedDate ? dayjs(publishedDate, dateFormat) : null}
          onChange={(value) => handlePublishedDate(value)}
        />
      </Box>
      <Box mt={4} display="flex" justifyContent="right">
        <Button
          size="large"
          variant="contained"
          onClick={handleAddBook}
          sx={{ marginTop: 2 }}
        >
          Add
        </Button>
      </Box>
    </Card>
  );
};

export default AddBook;
