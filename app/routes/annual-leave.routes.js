const { authJwt, verifySignUp } = require("../middlewares");
const controller = require("../controllers/annual-leave.controller");

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
   * /annual-leave:
   *    post:
   *      tags:
   *        - Annual-leave
   *      summary: Add a new annual-leave
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                fullName:
   *                  type: string
   *                teamName:
   *                  type: string
   *                teamLeader:
   *                  type: string
   *                fromDate:
   *                  type: string
   *                toDate:
   *                  type: string
   *                type:
   *                  type: string
   *                reason:
   *                  type: string
   *                createdDate:
   *                  type: string
   *                createdBy:
   *                  type: string
   *      security:
   *        JWT: []
   *      responses:
   *        200:
   *          description: Receive back annual-leaveId.
   *
   */
  app.post("/annual-leave", controller.addAnnualLeave);

  /**
   * @swagger
   * /annual-leave:
   *    get:
   *      tags:
   *        - Annual-leave
   *      summary: Get all annual-leave
   *      security:
   *        - JWT: []
   *      responses:
   *        200:
   *          description: Receive back a annual-leave list.
   */
  app.get("/annual-leave", [authJwt.verifyToken], controller.getAll);

  /**
   * @swagger
   * /annual-leave/{id}:
   *    get:
   *      tags:
   *        - Annual-leave
   *      summary: Get annual-leave by id
   *      parameters:
   *        - name: id
   *          in: path
   *          required: true
   *          type: string
   *      security:
   *        - JWT: []
   *      responses:
   *        200:
   *          description: Receive back annual-leaveId.
   */
  app.get(
    "/annual-leave/:id",
    [authJwt.verifyToken],
    controller.getAnnualLeave
  );

  /**
   * @swagger
   * /annual-leave/{id}:
   *    post:
   *      tags:
   *        - Annual-leave
   *      summary: Update annual-leave by id
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
   *                  type: string
   *      security:
   *        - JWT: []
   *      responses:
   *        200:
   *          description: Receive back annual-leaveId.
   */
  app.post(
    "/annual-leave/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateAnnualLeave
  );

  /**
   * @swagger
   * /annual-leave/{id}:
   *    delete:
   *      tags:
   *        - Annual-leave
   *      summary: Delete a annual-leave by id
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
   *          descriptionL: Annual-leave not found.
   */
  app.delete(
    "/annual-leave/:id",
    [authJwt.verifyToken],
    controller.deleteAnnualLeave
  );
};
