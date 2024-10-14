package com.acme.bookmanagement.service;

import com.acme.bookmanagement.model.Book;
import com.acme.bookmanagement.repository.BookRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;

class BookServiceTest {
    private final BookRepository bookRepository = Mockito.mock(BookRepository.class);
    private final BookService bookService = new BookService(bookRepository);

    private final Book book = new Book(1L,
            "title-1",
            "author-1",
            LocalDate.of(2021, 2, 3));

    @Test
    void testFindAll() {
        Mockito.when(bookRepository.findAll()).thenReturn(Collections.singletonList(book));
        assertEquals(1, bookService.findAll().size());
    }

    @Test
    void testFindById() {
        Mockito.when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        assertEquals(book, bookService.findById(1L).orElse(null));
    }

    @Test
    void testFindPublishedAfter() {
        LocalDate date = LocalDate.of(2021, 1, 1);
        Book book1 = new Book(1L, "title-1", "author-1", LocalDate.of(2021, 2, 3));
        Book book2 = new Book(2L, "title-2", "author-2", LocalDate.of(2021, 3, 5));

        Mockito.when(bookRepository.findByPublishedDateAfter(date)).thenReturn(List.of(book1, book2));

        assertEquals(2, bookService.findPublishedAfter(date).size());
        assertEquals(book1, bookService.findPublishedAfter(date).get(0));
        assertEquals(book2, bookService.findPublishedAfter(date).get(1));
    }

    @Test
    void testSave() {
        Mockito.when(bookRepository.save(book)).thenReturn(book);
        assertEquals(book, bookService.save(book));
    }

    @Test
    void testDeleteById() {
        bookService.deleteById(1L);
        Mockito.verify(bookRepository).deleteById(1L);
    }
}
