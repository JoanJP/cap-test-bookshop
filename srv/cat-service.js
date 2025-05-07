const { v4: uuidv4 } = require("uuid");
const cds = require("@sap/cds");

module.exports = (srv) => {
  srv.on("submitOrder", async (req) => {
    const { book: bookID, amount } = req.data;
    if (!bookID || !amount || amount <= 0) {
      return req.error(400, `Invalid book ID or amount!`);
    }

    const { Orders, Books } = cds.entities("my.bookshop");
    // from Books where bookID, select stock, only select the column stock
    const book = await SELECT.one.from(Books, bookID).columns("stock");
    if (!book) return req.error(404, "Book not found!");
    if (book.stock < amount) return req.error(409, `Only ${book.stock} left!`);

    // Insert order and get the ID
    const orderID = uuidv4();
    await INSERT.into(Orders).entries({
      ID: orderID,
      book_ID: bookID,
      amount: amount,
      status: "New",
    });

    // // The syntax below is to update the corresponding book stock
    // await UPDATE(Books, bookID).with({ stock: book.stock - amount });

    // Out
    return {
      orderID,
      amount: amount,
      status: "New",
      message: `Order ${orderID} created for book ${bookID}!`,
    };
  });

  srv.on("processOrder", async (req) => {
    const { order: orderID } = req.data;
    const { Orders, Books } = cds.entities("my.bookshop");

    const order = await SELECT.one.from(Orders, orderID).columns("*");
    if (!order) return req.error(404, "Order not found!");
    if (order.status !== "New")
      return req.error(400, "Order has already been processed!");

    const books = await SELECT.one.from(Books).where({ ID: order.book_ID });
    if (!books) return req.error(404, "The associated book is not found!");

    // if (books.stock < order.amount) {
    //   return req.error(400, `Not enough stock. Only ${books.stock} available.`);
    // }

    await UPDATE(Books, order.book_ID).set({ stock: { "-=": order.amount } });

    await UPDATE(Orders, orderID).set({ status: "Processed" });

    return {
      orderID,
      status: "Processed",
      message: `Order ${orderID} processed, stock updated for ${order.book_ID}`,
    };
  });
};
