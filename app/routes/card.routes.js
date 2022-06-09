const { authJwt, verifySignUp } = require("../middlewares");
const controller = require("../controllers/card.controller");

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
   * /card:
   *    post:
   *      tags:
   *        - Card
   *      summary: Add a new Card
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
   *          description: Receive back cardId.
   *
   */
  app.post("/card", [authJwt.verifyToken], controller.addCard);

  /**
   * @swagger
   * /card:
   *    get:
   *      tags:
   *        - Card
   *      summary: Get all Card
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
   *          description: Receive back a card list.
   */
  app.get("/card", [authJwt.verifyToken], controller.getAll);

  /**
   * @swagger
   * /card/{id}:
   *    get:
   *      tags:
   *        - Card
   *      summary: Get Card by id
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
  app.get("/card/:id", [authJwt.verifyToken], controller.getCard);

  /**
   * @swagger
   * /card/get-by-userId/{userId}:
   *    get:
   *      tags:
   *        - Card
   *      summary: Get Annual Leave by userId
   *      parameters:
   *        - name: userId
   *          in: path
   *          required: true
   *          type: string
   *      security:
   *        - JWT: []
   *      responses:
   *        200:
   *          description: Receive back cardId.
   */
   app.get(
    "/card/get-by-userId/:userId",
    [authJwt.verifyToken],
    controller.getCardByUserId
  );

  /**
   * @swagger
   * /card/{id}:
   *    put:
   *      tags:
   *        - Card
   *      summary: Update Card by id
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
   *          description: Receive back cardId.
   */
  app.put(
    "/card/:id",
    [authJwt.verifyToken], // authJwt.isAdmin
    controller.updateCard
  );

  /**
   * @swagger
   * /card/{id}:
   *    delete:
   *      tags:
   *        - Card
   *      summary: Delete a Card by id
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
   *          descriptionL: Card not found.
   */
  app.delete("/card/:id", [authJwt.verifyToken], controller.deleteCard);
};
