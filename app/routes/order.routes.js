const { authJwt, verifySignUp } = require("../middlewares");
const controller = require("../controllers/order.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  /**
   * @swagger
   * /order:
   *    post:
   *      tags:
   *        - Order
   *      summary: Add a new Order
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                userId:
   *                  type: string
   *                username:
   *                  type: string
   *                fullname:
   *                  type: string
   *                email:
   *                  type: string
   *                country:
   *                  type: string
   *                address:
   *                  type: string
   *                contact:
   *                  type: string
   *                detail:
   *                  type: array
   *                  items:
   *                    type: object
   *                    properties:
   *                      productId:
   *                        type: string
   *                      name:
   *                        type: string
   *                      price:
   *                        type: number
   *                      amount:
   *                        type: number
   *                      totalPrice:
   *                        type: number
   *                paymentAddress:
   *                  type: string
   *                paymentType:
   *                  type: string
   *                status:
   *                  type: number
   *      security:
   *        - JWT: []
   *      responses:
   *        201:
   *          description: Receive back orderId.
   *
   */
  app.post("/order", [authJwt.verifyToken], controller.addOrder);

  /**
   * @swagger
   * /order:
   *    get:
   *      tags:
   *        - Order
   *      summary: Get all Order
   *      parameters:
   *        - name: keyword
   *          in: query
   *          required: false
   *          type: string
   *        - name: pageNumber
   *          in: query
   *          required: false
   *          type: string
   *        - name: pageSize
   *          in: query
   *          required: false
   *          type: string
   *      security:
   *        - JWT: []
   *      responses:
   *        200:
   *          description: Receive back a order list.
   */
  app.get("/order", [authJwt.verifyToken], controller.getAll);

  /**
   * @swagger
   * /order/{id}:
   *    get:
   *      tags:
   *        - Order
   *      summary: Get Order by id
   *      parameters:
   *        - name: id
   *          in: path
   *          required: true
   *          type: string
   *      security:
   *        - JWT: []
   *      responses:
   *        200:
   *          description: Receive back annualLeaveId.
   */
  app.get("/order/:id", [authJwt.verifyToken], controller.getOrder);

  /**
   * @swagger
   * /order/get-by-userId/{userId}:
   *    get:
   *      tags:
   *        - Order
   *      summary: Get Order by userId
   *      parameters:
   *        - name: userId
   *          in: path
   *          required: true
   *          type: string
   *      security:
   *        - JWT: []
   *      responses:
   *        200:
   *          description: Receive back orderId.
   */
   app.get(
    "/order/get-by-userId/:userId",
    [authJwt.verifyToken],
    controller.getOrderByUserId
  );

  /**
   * @swagger
   * /order/{id}:
   *    post:
   *      tags:
   *        - Order
   *      summary: Update Order by id
   *      parameters:
   *        - name: id
   *          in: path
   *          required: true
   *          type: string
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: number
   *      security:
   *        - JWT: []
   *      responses:
   *        200:
   *          description: Receive back orderId.
   */
  app.post(
    "/order/:id",
    [authJwt.verifyToken], // authJwt.isAdmin
    controller.updateOrder
  );

  /**
   * @swagger
   * /order/{id}:
   *    delete:
   *      tags:
   *        - Order
   *      summary: Delete a Order by id
   *      parameters:
   *        - name: id
   *          in: path
   *          required: true
   *          type: string
   *      security:
   *        - JWT: []
   *      responses:
   *        400:
   *          description: Invalid Id.
   *        404:
   *          descriptionL: Order not found.
   */
  app.delete("/order/:id", [authJwt.verifyToken], controller.deleteOrder);
};
