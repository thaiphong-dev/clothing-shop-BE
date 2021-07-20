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
   *      summary: Add a new annualLeave
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
   *      security:
   *        - JWT: []
   *      responses:
   *        200:
   *          description: Receive back annualLeaveId.
   *
   */
  app.post("/annual-leave", [authJwt.verifyToken], controller.addAnnualLeave);

  /**
   * @swagger
   * /annual-leave:
   *    get:
   *      tags:
   *        - Annual-leave
   *      summary: Get all annualLeave
   *      security:
   *        - JWT: []
   *      responses:
   *        200:
   *          description: Receive back a annualLeave list.
   */
  app.get("/annual-leave", [authJwt.verifyToken], controller.getAll);

  /**
   * @swagger
   * /annual-leave/{id}:
   *    get:
   *      tags:
   *        - Annual-leave
   *      summary: Get annualLeave by id
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
   *      summary: Update annualLeave by id
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
   *          description: Receive back annualLeaveId.
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
   *      summary: Delete a annualLeave by id
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
   *          descriptionL: AnnualLeave not found.
   */
  app.delete(
    "/annual-leave/:id",
    [authJwt.verifyToken],
    controller.deleteAnnualLeave
  );
};
