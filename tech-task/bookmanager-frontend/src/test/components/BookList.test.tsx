/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/prefer-screen-queries */
import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import BooksList from "../../components/BooksList";
import booksReducer from "../../features/bookReducer";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { fetchBooksPublishedAfter, deleteBook } from "../../api/api";

jest.mock("../../api/api");

describe("BooksList", () => {
  let store: ReturnType<typeof configureStore>;
  let initialState: RootState;

  beforeEach(() => {
    initialState = {
      books: {
        books: [
          {
            id: 1,
            title: "Book One",
            author: "Author One",
            publishedDate: "2021-01-01",
          },
          {
            id: 2,
            title: "Book Two",
            author: "Author Two",
            publishedDate: "2022-02-02",
          },
        ],
      },
    };
    store = configureStore({
      reducer: {
        books: booksReducer,
      },
      preloadedState: initialState,
    });
  });

  it("should render a list of books", () => {
    const { getByText } = render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Provider store={store}>
          <BooksList />
        </Provider>
      </LocalizationProvider>
    );

    expect(getByText("Books")).toBeInTheDocument();
    expect(
      getByText("Book One by Author One (Published: 2021-01-01)")
    ).toBeInTheDocument();
    expect(
      getByText("Book Two by Author Two (Published: 2022-02-02)")
    ).toBeInTheDocument();
  });

  it("should filter out old books by selected date", async () => {
    (fetchBooksPublishedAfter as jest.Mock).mockResolvedValue([
      {
        id: 2,
        title: "Book Two",
        author: "Author Two",
        publishedDate: "2022-02-02",
      },
    ]);

    const { getByText, queryByText, getByLabelText } = render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Provider store={store}>
          <BooksList />
        </Provider>
      </LocalizationProvider>
    );

    expect(
      getByText("Book One by Author One (Published: 2021-01-01)")
    ).toBeInTheDocument();
    expect(
      getByText("Book Two by Author Two (Published: 2022-02-02)")
    ).toBeInTheDocument();

    const dateInput = getByLabelText("Select a Date");
    fireEvent.change(dateInput, { target: { value: "31/12/2021" } });

    await waitFor(() => {
      expect(
        queryByText("Book One by Author One (Published: 2021-01-01)")
      ).not.toBeInTheDocument();
      expect(
        getByText("Book Two by Author Two (Published: 2022-02-02)")
      ).toBeInTheDocument();
    });
  });

  it("should delete a book when the delete button is clicked and confirmed", async () => {
    (deleteBook as jest.Mock).mockResolvedValue(1);

    const { getByText, queryByText, getByTestId } = render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Provider store={store}>
          <BooksList />
        </Provider>
      </LocalizationProvider>
    );

    expect(
      getByText("Book One by Author One (Published: 2021-01-01)")
    ).toBeInTheDocument();

    const deleteButton = getByTestId("delete-1");
    fireEvent.click(deleteButton);

    const confirmButton = getByText("Yes");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(deleteBook).toHaveBeenCalledWith(1);
    });

    await waitFor(() => {
      expect(
        queryByText("Book One by Author One (Published: 2021-01-01)")
      ).not.toBeInTheDocument();
    });
  });


});
