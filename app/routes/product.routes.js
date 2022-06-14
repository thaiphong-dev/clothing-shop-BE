const { authJwt, verifySignUp } = require("../middlewares");
const controller = require("../controllers/product.controller");

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
   * /product:
   *    post:
   *      tags:
   *        - Product
   *      summary: Add a new Product
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                productname:
   *                  type: string
   *                price:
   *                  type: number
   *                preview:
   *                  type: string
   *                image:
   *                  type: string
   *                productType:
   *                  type: string
   *                gender:
   *                   type: number
   *                productInfo:
   *                  type: array
   *                  items:
   *                    type: object
   *                    properties:
   *                      size:
   *                        type: string
   *                      amount:
   *                        type: number
   *                status:
   *                  type: number
   *      security:
   *        - JWT: []
   *      responses:
   *        201:
   *          description: Receive back productId.
   *
   */
  app.post("/product", [authJwt.verifyToken], controller.addProduct);

  /**
   * @swagger
   * /product:
   *    get:
   *      tags:
   *        - Product
   *      summary: Get all Product
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
   *          description: Receive back a product list.
   */
  app.get("/product", controller.getAll);

  /**
   * @swagger
   * /product/{id}:
   *    get:
   *      tags:
   *        - Product
   *      summary: Get Product by id
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
  app.get("/product/:id", controller.getProduct);

  /**
   * @swagger
   * /product/{id}:
   *    put:
   *      tags:
   *        - Product
   *      summary: Update Product by id
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
   *                productname:
   *                  type: string
   *                price:
   *                  type: number
   *                preview:
   *                  type: string
   *                image:
   *                  type: string
   *                productType:
   *                   type: string
   *                gender:
   *                   type: number
   *                productInfo:
   *                  type: array
   *                status:
   *                  type: number
   *      security:
   *        - JWT: []
   *      responses:
   *        200:
   *          description: Receive back productId.
   */
  app.put(
    "/product/:id",
    [authJwt.verifyToken], // authJwt.isAdmin
    controller.updateProduct
  );

  /**
   * @swagger
   * /product/{id}:
   *    delete:
   *      tags:
   *        - Product
   *      summary: Delete a Product by id
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
   *          descriptionL: Product not found.
   */
  app.delete("/product/:id", [authJwt.verifyToken], controller.deleteProduct);
};
