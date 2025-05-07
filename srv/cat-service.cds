using my.bookshop as my from '../db/data-model';

service CatalogService {
    entity Books @readonly   as projection on my.Books;
    entity Authors @readonly as projection on my.Authors;
    entity Orders            as projection on my.Orders;

    //action <actionName>(input : <type>) returns{ <output> }
    // for submit the order
    action submitOrder(book : Books : ID, amount : Integer) returns {
        orderID                     : UUID;
        stock                       : Integer;
        status                      : String;
        message                     : String;
    };

    // then for processing the order
    action processOrder(order : Orders : ID)                returns {
        orderID                        : UUID;
        status                         : String;
        message                        : String;
    };
}
