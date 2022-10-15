const { authJwt, verifySignUp } = require("../middlewares");
const controller = require("../controllers/producType.controller");

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
  // app.post("/product", [authJwt.verifyToken], controller.addProduct);

  /**
   * @swagger
   * /products:
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
   app.get("/products", controller.laySanPham);
   app.get("/promotion", controller.layDsKhuyenMai);

   /**
   * @swagger
   * /hotProducts:
   *    get:
   *      tags:
   *        - Product
   *      summary: Get hot Product
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
    app.get("/hotProducts", controller.laySanPhamHot);

    /**
   * @swagger
   * /newProducts:
   *    get:
   *      tags:
   *        - Product
   *      summary: Get new Products
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
     app.get("/newProducts", controller.laySanPhamMoi);
  /**
   * @swagger
   * /products/filter:
   *    post:
   *      tags:
   *        - Product
   *      summary: Get new Products
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
 app.post("/products/filter", controller.locSanPham);

  /**
   * @swagger
   * /products/filter:
   *    post:
   *      tags:
   *        - Product
   *      summary: Get new Products
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
 app.post("/products/filterName", controller.locSanPhamTheoTen);
   /**
   * @swagger
   * /productdetail:
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
  app.post("/productdetail", controller.layChiTietSanPham);
  app.post("/cart", controller.themGioHang)
  app.get("/cart/:maKH", controller.layGioHang)
  app.get("/ngoaiTe", controller.layNgoaiTe)

  // app.get("/sale", controller.layKhuyenMai)

  app.get("/admin/cart", controller.layGioHangAdmin)
  app.post("/admin/create-promotion", controller.themKhuyenMai)
  app.post("/admin/add-product-promotion", controller.themSanPhamKhuyenMai)
  app.post("/admin/duyet", controller.duyetDonHang)
  app.post("/admin/huy", controller.huytDonHang)
  app.post("/create-baocao-pdf", controller.taoBaoCao)
  app.get("/get-baocao-pdf", controller.inBaoCao)
  app.post("/create-hoadon-pdf", controller.taoHoaDon)
  app.get("/get-hoadon-pdf", controller.inHoaDon)
  app.get("/admin/employee", controller.layNhanVien)
  /**
   * @swagger
   * /productType:
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
  app.get("/productType", controller.layTheLoai);

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
  // app.get("/product/:id", [authJwt.verifyToken], controller.getProduct);

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
  // app.put(
  //   "/product/:id",
  //   [authJwt.verifyToken], // authJwt.isAdmin
  //   controller.updateProduct
  // );

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
  //app.delete("/product/:id", [authJwt.verifyToken], controller.deleteProduct);
};
