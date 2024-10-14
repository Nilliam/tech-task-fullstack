import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBooks } from "./features/bookReducer";
import BooksList from "./components/BooksList";
import AddBook from "./components/AddBook";
import { fetchBooks } from "./api/api";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadBooks = async () => {
      const books = await fetchBooks();
      dispatch(setBooks(books));
    };

    loadBooks();
  }, [dispatch]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AppBar position="relative">
        <Toolbar>
          <AutoStoriesIcon sx={{ p: 1 }} />
          <Typography variant="h4">Book Management</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box
          sx={{ p: 5}}
          display="flex"
          alignItems="flex-start"
          gap={5}
        >
          <AddBook />
          <BooksList />
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default App;
