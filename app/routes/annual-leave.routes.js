// const { authJwt, verifySignUp } = require("../middlewares");
// const controller = require("../controllers/annual-leave.controller");

// module.exports = function (app) {
//   app.use(function (req, res, next) {
//     res.header(
//       "Access-Control-Allow-Headers",
//       "authorization, Origin, Content-Type, Accept"
//     );
//     next();
//   });

//   /**
//    * @swagger
//    * /annual-leave:
//    *    post:
//    *      tags:
//    *        - Annual leave
//    *      summary: Add a new Annual Leave
//    *      requestBody:
//    *        required: true
//    *        content:
//    *          application/json:
//    *            schema:
//    *              type: object
//    *              properties:
//    *                fullName:
//    *                  type: string
//    *                teamName:
//    *                  type: string
//    *                teamLeader:
//    *                  type: string
//    *                startDate:
//    *                  type: string
//    *                endDate:
//    *                  type: string
//    *                type:
//    *                  type: string
//    *                reason:
//    *                  type: string
//    *      security:
//    *        - JWT: []
//    *      responses:
//    *        201:
//    *          description: Receive back annualLeaveId.
//    *
//    */
//   app.post("/annual-leave", [authJwt.verifyToken], controller.addAnnualLeave);

//   /**
//    * @swagger
//    * /annual-leave:
//    *    get:
//    *      tags:
//    *        - Annual leave
//    *      summary: Get all Annual Leave
//    *      parameters:
//    *        - name: keyword
//    *          in: query
//    *          required: false
//    *          type: string
//    *        - name: pageNumber
//    *          in: query
//    *          required: false
//    *          type: string
//    *        - name: pageSize
//    *          in: query
//    *          required: false
//    *          type: string
//    *      security:
//    *        - JWT: []
//    *      responses:
//    *        200:
//    *          description: Receive back a annualLeave list.
//    */
//   app.get("/annual-leave", [authJwt.verifyToken], controller.getAll);

//   /**
//    * @swagger
//    * /annual-leave/{id}:
//    *    get:
//    *      tags:
//    *        - Annual leave
//    *      summary: Get Annual Leave by id
//    *      parameters:
//    *        - name: id
//    *          in: path
//    *          required: true
//    *          type: string
//    *      security:
//    *        - JWT: []
//    *      responses:
//    *        200:
//    *          description: Receive back annualLeaveId.
//    */
//   app.get(
//     "/annual-leave/:id",
//     [authJwt.verifyToken],
//     controller.getAnnualLeave
//   );

//   /**
//    * @swagger
//    * /annual-leaves/get-by-userId/{userId}:
//    *    get:
//    *      tags:
//    *        - Annual leave
//    *      summary: Get Annual Leave by userId
//    *      parameters:
//    *        - name: userId
//    *          in: path
//    *          required: true
//    *          type: string
//    *      security:
//    *        - JWT: []
//    *      responses:
//    *        200:
//    *          description: Receive back annualLeaveId.
//    */
//   app.get(
//     "/annual-leaves/get-by-userId/:userId",
//     [authJwt.verifyToken],
//     controller.getAnnualLeaveByUserId
//   );

//   /**
//    * @swagger
//    * /annual-leave/{id}:
//    *    put:
//    *      tags:
//    *        - Annual leave
//    *      summary: Update Annual Leave by id
//    *      parameters:
//    *        - name: id
//    *          in: path
//    *          required: true
//    *          type: string
//    *      requestBody:
//    *        required: true
//    *        content:
//    *          application/json:
//    *            schema:
//    *              type: object
//    *              properties:
//    *                status:
//    *                  type: number
//    *      security:
//    *        - JWT: []
//    *      responses:
//    *        200:
//    *          description: Receive back annualLeaveId.
//    */
//   app.put(
//     "/annual-leave/:id",
//     [authJwt.verifyToken], // authJwt.isAdmin
//     controller.updateAnnualLeave
//   );

//   /**
//    * @swagger
//    * /annual-leave/{id}:
//    *    delete:
//    *      tags:
//    *        - Annual leave
//    *      summary: Delete a Annual Leave by id
//    *      parameters:
//    *        - name: id
//    *          in: path
//    *          required: true
//    *          type: string
//    *      security:
//    *        - JWT: []
//    *      responses:
//    *        400:
//    *          description: Invalid Id.
//    *        404:
//    *          descriptionL: Annual Leave not found.
//    */
//   app.delete(
//     "/annual-leave/:id",
//     [authJwt.verifyToken],
//     controller.deleteAnnualLeave
//   );
// };
