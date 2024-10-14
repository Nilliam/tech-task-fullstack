import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteBook as deleteBookReducer,
  setBooks,
} from "../features/bookReducer";
import { deleteBook, fetchBooksPublishedAfter, fetchBooks } from "../api/api";
import { RootState } from "../store";
import SearchFilter from "./SearchFilter";
import dayjs, { Dayjs } from "dayjs";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import useConfirmDialog from "./ConfirmDialog";

const BooksList = () => {
  const dispatch = useDispatch();
  const books = useSelector((state: RootState) => state.books.books);
  const { confirm, ConfirmDialog } = useConfirmDialog(
    "Are you sure you want to delete this book? This action cannot be undone."
  );

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const handleDateChange = async (date: Dayjs | null) => {
    if (!date) {
      const books = await fetchBooks();
      dispatch(setBooks(books));
    } else {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      const books = await fetchBooksPublishedAfter(formattedDate);
      dispatch(setBooks(books));
    }
    setSelectedDate(date);
  };

  const handleDeleteBook = async (bookId: number) => {
    const confirmed = await confirm();
    if (!confirmed) return;

    const deletedBook = await deleteBook(bookId);
    dispatch(deleteBookReducer(deletedBook));
  };

  return (
    <Card>
      <CardHeader sx={{ width: "600px" }} title="Books" />
      <CardContent>
        <SearchFilter
          handleDateChange={handleDateChange}
          selectedDate={selectedDate}
        />
        <ul>
          {books
            .filter(
              (book) =>
                !selectedDate || dayjs(book.publishedDate) > selectedDate
            )
            .map((book) => (
              <li key={book.id}>
                <Box display="flex" alignItems="center" width="100%">
                  <Typography>
                    {book.title} by {book.author} (Published:{" "}
                    {book.publishedDate}){" "}
                  </Typography>
                  <Button
                    data-testid={`delete-${book.id}`}
                    color="error"
                    variant="contained"
                    onClick={() => handleDeleteBook(book.id)}
                    sx={{ marginLeft: 2 }}
                  >
                    Delete
                  </Button>
                </Box>
              </li>
            ))}
        </ul>
        <ConfirmDialog />
      </CardContent>
    </Card>
  );
};

export default BooksList;
