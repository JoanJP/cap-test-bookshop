using {cuid} from '@sap/cds/common';

namespace my.bookshop;

entity Books : cuid {
    title : String;
    stock : Integer;
}

entity Authors : cuid {
    name : String;
}
