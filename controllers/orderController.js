const Order = require("../models/orderModel");

function mapRequestToOrder(body) {
  return {
    orderId: body.numeroPedido,
    value: body.valorTotal,
    creationDate: new Date(body.dataCriacao).toISOString(),
    items: (body.items || []).map((item) => ({
      productId: Number(item.idItem),
      quantity: item.quantidadeItem,
      price: item.valorItem
    }))
  };
}

exports.createOrder = (req, res) => {
  const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

  if (!numeroPedido || !valorTotal || !dataCriacao || !items) {
    return res.status(400).json({
      message: "Os campos numeroPedido, valorTotal, dataCriacao e items são obrigatórios"
    });
  }

  const mappedOrder = mapRequestToOrder(req.body);

  Order.create(mappedOrder, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Erro ao criar pedido",
        error: err.message
      });
    }

    res.status(201).json({
      message: "Pedido criado com sucesso",
      orderId: result.orderId
    });
  });
};

exports.getOrderById = (req, res) => {
  const orderId = req.params.id;

  Order.getByOrderId(orderId, (err, order) => {
    if (err) {
      return res.status(500).json({
        message: "Erro ao buscar pedido",
        error: err.message
      });
    }

    if (!order) {
      return res.status(404).json({
        message: "Pedido não encontrado"
      });
    }

    res.status(200).json(order);
  });
};

exports.getOrders = (req, res) => {
  Order.getAll((err, orders) => {
    if (err) {
      return res.status(500).json({
        message: "Erro ao listar pedidos",
        error: err.message
      });
    }

    res.status(200).json(orders);
  });
};

exports.updateOrder = (req, res) => {
  const orderId = req.params.id;
  const mappedOrder = mapRequestToOrder(req.body);

  Order.update(orderId, mappedOrder, (err, updated) => {
    if (err) {
      return res.status(500).json({
        message: "Erro ao atualizar pedido",
        error: err.message
      });
    }

    if (!updated) {
      return res.status(404).json({
        message: "Pedido não encontrado"
      });
    }

    res.status(200).json({
      message: "Pedido atualizado com sucesso"
    });
  });
};

exports.deleteOrder = (req, res) => {
  const orderId = req.params.id;

  Order.delete(orderId, (err, deleted) => {
    if (err) {
      return res.status(500).json({
        message: "Erro ao deletar pedido",
        error: err.message
      });
    }

    if (!deleted) {
      return res.status(404).json({
        message: "Pedido não encontrado"
      });
    }

    res.status(200).json({
      message: "Pedido deletado com sucesso"
    });
  });
};