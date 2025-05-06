const { v4: uuidv4 } = require("uuid");

module.exports = (srv) => {
  srv.on("submitOrder", async (req) => {
    console.log(req.data);
    const { book: bookID, amount } = req.data;
    if (!bookID || !amount || amount <= 0) {
      return req.error(400, `Invalid book ID or amount!`);
    }

    const { Orders, Books } = cds.entities("my.bookshop");
    // from Books where bookID, select stock
    const book = await SELECT.one.from(Books, bookID).columns("stock");
    if (!book) return req.error(404, "Book not found!");
    if (book.stock < amount) return req.error(409, `Only ${book.stock} left!`);

    // Insert order and get the ID
    const orderID = uuidv4();
    await INSERT.into(Orders).entries({
      ID: orderID,
    });

    //Out
    return {
      orderID,
      amount: amount,
      message: `Order ${orderID} created for book ${bookID}!`,
    };
  });
};
