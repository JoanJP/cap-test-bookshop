const cds = require("@sap/cds");
module.exports = async function () {
  const db = await cds.connect.to("db"); // connect to database service
  const { Books } = db.entities; // get reflected definitions

  // Create order report
  this.before("CREATE", "Orders", async (req) => {
    const order = req.data;
    if (!order.amount || order.amount <= 0)
      return req.error(400, "Order at least 1 book!");
    const trx = cds.transaction(req);
    const affectedRows = await trx.run(
      UPDATE(Books)
        .set({ stock: { "-=": order.amount } })
        .where({ stock: { ">=": order.amount }, /*and*/ ID: order.book_ID })
    );
    if (affectedRows === 0) req.error(409, "Stock is not available, sorry!");
  });

  // Delete order

  // Add some discount for overstocked books
  this.after("READ", "Books", (each) => {
    if (each.stock > 111) each.title += ` -- 11% discount!`;
  });
};
