const db = require("../configs/database");

const Order = {
  create: (orderData, callback) => {
    const { orderId, value, creationDate, items } = orderData;

    db.run(
      `INSERT INTO orders (orderId, value, creationDate) VALUES (?, ?, ?)`,
      [orderId, value, creationDate],
      function (err) {
        if (err) {
          return callback(err);
        }

        if (!items || items.length === 0) {
          return callback(null, { orderId });
        }

        let pending = items.length;
        let hasError = false;

        items.forEach((item) => {
          db.run(
            `INSERT INTO items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)`,
            [orderId, item.productId, item.quantity, item.price],
            function (itemErr) {
              if (hasError) return;

              if (itemErr) {
                hasError = true;
                return callback(itemErr);
              }

              pending--;

              if (pending === 0) {
                callback(null, { orderId });
              }
            }
          );
        });
      }
    );
  },

  getByOrderId: (orderId, callback) => {
    db.get(
      `SELECT * FROM orders WHERE orderId = ?`,
      [orderId],
      (err, order) => {
        if (err) {
          return callback(err);
        }

        if (!order) {
          return callback(null, null);
        }

        db.all(
          `SELECT productId, quantity, price FROM items WHERE orderId = ?`,
          [orderId],
          (itemsErr, items) => {
            if (itemsErr) {
              return callback(itemsErr);
            }

            callback(null, {
              ...order,
              items
            });
          }
        );
      }
    );
  },

  getAll: (callback) => {
    db.all(`SELECT * FROM orders`, [], (err, orders) => {
      if (err) {
        return callback(err);
      }

      if (orders.length === 0) {
        return callback(null, []);
      }

      let pending = orders.length;
      const result = [];

      orders.forEach((order) => {
        db.all(
          `SELECT productId, quantity, price FROM items WHERE orderId = ?`,
          [order.orderId],
          (itemsErr, items) => {
            if (itemsErr) {
              return callback(itemsErr);
            }

            result.push({
              ...order,
              items
            });

            pending--;

            if (pending === 0) {
              callback(null, result);
            }
          }
        );
      });
    });
  },

  update: (orderId, orderData, callback) => {
    const { value, creationDate, items } = orderData;

    db.run(
      `UPDATE orders SET value = ?, creationDate = ? WHERE orderId = ?`,
      [value, creationDate, orderId],
      function (err) {
        if (err) {
          return callback(err);
        }

        if (this.changes === 0) {
          return callback(null, false);
        }

        db.run(`DELETE FROM items WHERE orderId = ?`, [orderId], (deleteErr) => {
          if (deleteErr) {
            return callback(deleteErr);
          }

          if (!items || items.length === 0) {
            return callback(null, true);
          }

          let pending = items.length;
          let hasError = false;

          items.forEach((item) => {
            db.run(
              `INSERT INTO items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)`,
              [orderId, item.productId, item.quantity, item.price],
              function (itemErr) {
                if (hasError) return;

                if (itemErr) {
                  hasError = true;
                  return callback(itemErr);
                }

                pending--;

                if (pending === 0) {
                  callback(null, true);
                }
              }
            );
          });
        });
      }
    );
  },

  delete: (orderId, callback) => {
    db.run(`DELETE FROM items WHERE orderId = ?`, [orderId], (itemsErr) => {
      if (itemsErr) {
        return callback(itemsErr);
      }

      db.run(`DELETE FROM orders WHERE orderId = ?`, [orderId], function (err) {
        if (err) {
          return callback(err);
        }

        callback(null, this.changes > 0);
      });
    });
  }
};

module.exports = Order;