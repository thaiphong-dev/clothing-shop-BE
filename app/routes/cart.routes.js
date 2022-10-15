const { authJwt, verifySignUp } = require("../middlewares");
const controller = require("../controllers/cart.controller");

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
   * /cart:
   *    post:
   *      tags:
   *        - Cart
   *      summary: Add a new Cart
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                userId:
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
   *                      size:
   *                        type: string
   *                      price:
   *                        type: number
   *                      amount:
   *                        type: number
   *                      totalPrice:
   *                        type: number
   *                status:
   *                  type: number
   *      security:
   *        - JWT: []
   *      responses:
   *        201:
   *          description: Receive back cartId.
   *
   */
  app.post("/cart", [authJwt.verifyToken], controller.addCart);

  /**
   * @swagger
   * /cart:
   *    get:
   *      tags:
   *        - Cart
   *      summary: Get all Cart
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
   *          description: Receive back a cart list.
   */
  app.get("/cart", [authJwt.verifyToken], controller.getAll);

  /**
   * @swagger
   * /cart/{id}:
   *    get:
   *      tags:
   *        - Cart
   *      summary: Get Cart by id
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
  app.get("/cart/:id", [authJwt.verifyToken], controller.getCart);

  /**
   * @swagger
   * /cart/get-by-userId/{userId}:
   *    get:
   *      tags:
   *        - Cart
   *      summary: Get Cart by userId
   *      parameters:
   *        - name: userId
   *          in: path
   *          required: true
   *          type: string
   *      security:
   *        - JWT: []
   *      responses:
   *        200:
   *          description: Receive back cartId.
   */
   app.get(
    "/cart/get-by-userId/:userId",
    [authJwt.verifyToken],
    controller.getCartByUserId
  );

  /**
   * @swagger
   * /cart/{id}:
   *    post:
   *      tags:
   *        - Cart
   *      summary: Update Cart by id
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
   *                detail:
   *                  type: array
   *                  items:
   *                    type: object
   *                    properties:
   *                      productId:
   *                        type: string
   *                      name:
   *                        type: string
   *                      size:
   *                        type: string
   *                      price:
   *                        type: number
   *                      amount:
   *                        type: number
   *                      totalPrice:
   *                        type: number
   *                status:
   *                  type: number
   *      security:
   *        - JWT: []
   *      responses:
   *        200:
   *          description: Receive back cartId.
   */
  app.post(
    "/cart/:id",
    [authJwt.verifyToken], // authJwt.isAdmin
    controller.updateCart
  );

  /**
   * @swagger
   * /cart/{id}:
   *    delete:
   *      tags:
   *        - Cart
   *      summary: Delete a Cart by id
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
   *          descriptionL: Cart not found.
   */
  app.delete("/cart/:id", [authJwt.verifyToken], controller.deleteCart);
};
