const { authJwt } = require("../middlewares")
const controller = require("../controllers/menu.controller")

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Alow-Headers",
            "authorization, Origin, Content-Type, Accept"
        )
        next()
    })

    /**
   * @swagger
   * /menu:
   *    post:
   *      tags:
   *        - Menu 
   *      summary: Add a new menu item
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                label:
   *                   type: string
   *                icon:
   *                  type: string
   *                link:
   *                  type: string            
   *                order:
   *                  type: number
   *                roleLevel:
   *                  type: number
   *      security:
   *        - JWT: []
   *      responses:
   *        200:
   *          description: Receive back menu label.
   */
    app.post(
        "/menu",
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ],
        controller.addMenu
    )
    /**
   * @swagger
   * /menu:
   *    get:
   *      tags:
   *        - Menu 
   *      summary: Get all menu items
   *      security:
   *        - JWT: []
   *      responses:
   *        200:
   *          description: Receive back a menu list.
   */
    app.get(
        "/menu",
        [
            authJwt.verifyToken
        ],
        controller.getAll
    )
    /**
   * @swagger
   * /menu/{id}:
   *    get:
   *      tags:
   *        - Menu
   *      summary: Get menu item by id
   *      parameters:
   *        - name: id
   *          in: path
   *          required: true
   *          type: string
   *      security:
   *        - JWT: []
   *      responses:
   *        200:
   *          description: Receive back menuId.
   */
    app.get(
        "/menu/:id", 
        [
            authJwt.verifyToken
        ],
        controller.getMenu
    )
    /**
   * @swagger
   * /menu/{id}:
   *    put:
   *      tags:
   *        - Menu 
   *      summary: Update menu item
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
   *                label:
   *                  type: string 
   *                icon:
   *                  type: string
   *                link:
   *                  type: string
   *                order:
   *                  type: number
   *                level:
   *                  type: number
   *      security:
   *        - JWT: []
   *      responses:
   *        200:
   *          description: Receive back a menu item that updated.
   */
    app.put(
        "/menu/:id",
        [
            authJwt.verifyToken, 
            authJwt.isAdmin
        ],
        controller.updateMenu
    )
  /**
   * @swagger
   * /menu/{id}:
   *    delete:
   *      tags:
   *        - Menu
   *      summary: Delete a menu item by id
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
   *          description: Menu Item not found.
   */
    app.delete(
        "/menu/:id",
        [
            authJwt.verifyToken, 
            authJwt.isAdmin
        ],
        controller.deleteMenu
    )
}