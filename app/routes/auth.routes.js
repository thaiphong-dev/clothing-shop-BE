const { verifySignUp } = require("../middlewares")
const controller = require("../controllers/auth.controller")

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "authorization, Origin, Content-Type, Accept"
    )
    next()
  })

  app.post(
    "/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  )

  /**
   * @swagger
   * /auth/signin:
   *    post:
   *      tags:
   *        - Authentication
   *      summary: Sign in
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                email:
   *                  type: string
   *                password:
   *                  type: string
   *      responses:
   *        200:
   *          description: Receive back token.
   */
  app.post("/auth/signin", controller.signin)

  app.post("/auth/refresh-token", controller.refreshToken)

  // /**
  //  * @swagger
  //  * /auth/forgot-password:
  //  *    post:
  //  *      tags:
  //  *        - Authentication
  //  *      summary: Fill email to get reset password link
  //  *      requestBody:
  //  *        required: true
  //  *        content:
  //  *          application/json:
  //  *            schema:
  //  *              type: object
  //  *              properties:
  //  *                email:
  //  *                  type: string
  //  *      responses:
  //  *        200:
  //  *          description: Receive email has link to reset password.
  //  */
  // app.post("/auth/forgot-password", controller.forgotPassword)

  // /**
  //  * @swagger
  //  * /auth/reset-password/{token}:
  //  *    put:
  //  *      tags:
  //  *        - Authentication
  //  *      summary: Using link with token to reset password.
  //  *      parameters:
  //  *        - name: token
  //  *          in: path
  //  *          required: true
  //  *          type: string
  //  *      requestBody:
  //  *        required: true
  //  *        content:
  //  *          application/json:
  //  *            schema:
  //  *              type: object
  //  *              properties:
  //  *                password:
  //  *                  type: string 
  //  *      responses:
  //  *        200:
  //  *          description: Change password successfully
  //  */
  // app.put("/auth/reset-password/:token", controller.resetPassword)
}
