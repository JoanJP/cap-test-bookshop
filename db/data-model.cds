using {
    cuid,
    managed
} from '@sap/cds/common';

namespace my.bookshop;

entity Books : cuid {
    title  : String;
    author : Association to Authors;
    stock  : Integer;
}

entity Authors : cuid {
    name  : String;
    books : Association to many Books
                on books.author = $self;
}

entity Orders : managed {
    key ID     : UUID;
        book   : Association to Books;
        amount : Integer;
}
