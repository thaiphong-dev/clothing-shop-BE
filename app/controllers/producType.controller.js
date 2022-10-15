var config = require("../config/db.config");
const sql = require("mssql");
const pdf = require("html-pdf");
const baocao = require("../models/template");
const hoadon = require("../models/hoaDon");

exports.layTheLoai = async (req, res, next) => {
  try {
    let connection = await sql.connect(config);
    let dsTheLoai = await connection.request().query("select * from TheLoai");
    return res.status(200).send({ data: dsTheLoai.recordset });
  } catch (error) {
    console.log(error);
  }
};

exports.laySanPham = async (req, res, next) => {
  try {
    let connection = await sql.connect(config);
    let dsSp = await connection.request().query("select * from SanPham");
    let dsSpct = await layKhuyenMai();

    let data = dsSp.recordset.map((x) => ({
      ...x,
      detail: dsSpct.filter((y) => y.maSP === x.maSP),
    }));

    return res.status(200).send({ data: data });
  } catch (error) {
    return res.status(error.code).send(error);
  }
};

exports.layDsKhuyenMai = async (req, res, next) => {
  try {
    let connection = await sql.connect(config);
    let dskm = await connection.request().query(`SELECT * FROM KhuyenMai ORDER BY maKM DESC`);
    let dskmct = await connection.request().query("SELECT * from CT_KhuyenMai");

    let data = dskm.recordset.map((x) => ({
      ...x,
      detail: dskmct.recordset.filter((y) => y.maKM === x.maKM),
    }));

    return res.status(200).send({ data: data });
  } catch (error) {
    return res.status(error.code).send(error);
  }
};

exports.layChiTietSanPham = async (req, res, next) => {
  try {
    let connection = await sql.connect(config);
    let dsSp = await connection
      .request()
      .query(`select * from SanPham where maSP = ${req.body.maSP}`);
    let dsSpct = await connection
      .request()
      .query(`select * from CT_SanPham where maSP = ${req.body.maSP}`);

    let dskm = await connection.request().query(`SELECT * FROM KhuyenMai`);
    let dskmct = await connection.request().query("SELECT * from CT_KhuyenMai");

    let detailKm = dskm.recordset.map((x) => ({
      ...x,
      detail: dskmct.recordset.filter((y) => y.maKM === x.maKM),
    }));

    let kq = dsSpct.recordset;
    let currentDate = new Date();

    for (let i = 0; i < detailKm?.length; ++i) {
      if (currentDate < new Date(detailKm[i].ngayKetThuc)) {
        kq = kq.map((k) => {
          let result;
          if (detailKm[i].detail.filter((y) => y.maCTSP == k.maCTSP)?.[0]) {
            result =
              k?.phanTramGiam !== undefined
                ? k?.phanTramGiam +
                  detailKm[i].detail.filter((y) => y.maCTSP == k.maCTSP)?.[0]
                    ?.phanTramGiam
                : detailKm[i].detail.filter((y) => y.maCTSP == k.maCTSP)?.[0]
                    ?.phanTramGiam;
            return {
              ...k,
              phanTramGiam: result,
            };
          }
          return {
            ...k,
          };
        });
      }
    }

    let data = dsSp.recordset.map((x) => ({
      ...x,
      detail: kq.filter((y) => y.maSP === x.maSP),
    }));
    return res.status(200).send({ data: data });
  } catch (error) {
    console.log(error);
  }
};

exports.laySanPhamHot = async (req, res, next) => {
  try {
    let connection = await sql.connect(config);
    let dsSp = await connection
      .request()
      .query(`SELECT top(8)* FROM SanPham ORDER BY luotXem DESC`);
    let dsSpct = await layKhuyenMai();

    let data = dsSp.recordset.map((x) => ({
      ...x,
      detail: dsSpct.filter((y) => y.maSP === x.maSP),
    }));
    return res.status(200).send({ data: data });
  } catch (error) {
    console.log(error);
  }
};

exports.laySanPhamMoi = async (req, res, next) => {
  try {
    let connection = await sql.connect(config);
    let dsSp = await connection
      .request()
      .query(`SELECT top(8)* FROM SanPham where TrangThai = 0`);
    let dsSpct = await layKhuyenMai();

    let data = dsSp.recordset.map((x) => ({
      ...x,
      detail: dsSpct.filter((y) => y.maSP === x.maSP),
    }));
    return res.status(200).send({ data: data });
  } catch (error) {
    console.log(error);
  }
};

// dang fix table
exports.locSanPham = async (req, res) => {
  try {
    //   let connection = await sql.connect(config);
    //   let result = await connection.request()
    //           .input('giaMax', sql.Int, req.body.max)
    //           .input('giaMin', sql.Int, req.body.min)
    //           .input('maTheLoai', sql.Int, req.body.maTheLoai)
    //           .execute("sp_LocSanPham");
    //   console.log("ds result", result);

    return res.status(200).send({ data: "result.recordset" });
  } catch (error) {
    console.log(error);
  }
};

exports.locSanPhamTheoTen = async (req, res) => {
  try {
    let connection = await sql.connect(config);
    let result = await connection
      .request()
      .input("tenSanPham", sql.NVarChar, req.body.tenSP)
      .execute("sp_TimKiemSanPham");

    let dsSpct = await layKhuyenMai();

    let data = result.recordset.map((x) => ({
      ...x,
      detail: dsSpct.filter((y) => y.maSP === x.maSP),
    }));
    return res.status(200).send({ data: data });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error });
  }
};

exports.themGioHang = async (req, res) => {
  try {
    let connection = await sql.connect(config);
    await connection
      .request()
      .input("maKH", sql.Int, req.body.maKH)
      .input("hoTen", sql.NVarChar, req.body.fullname)
      .input("sdt", sql.NVarChar, req.body.phone)
      .input("email", sql.NVarChar, req.body.email)
      .input("diaChi", sql.NVarChar, req.body.address)
      .input("ngayTao", sql.DateTime, req.body.ngayTao)
      .input("trangThai", sql.Int, req.body.trangThai)
      .input("moTa", sql.NVarChar, req.body.note)
      .query(
        `insert into GioHang (maKH, hoTen, sdt, email, diaChi, ngayTao, trangThai, moTa) values (@maKH, @hoTen, @sdt, @email, @diaChi, @ngayTao, @trangThai, @moTa)`
      );
    let idGio = await connection
      .request()
      .query(`select max(idGio) from GioHang where maKH = ${req.body.maKH}`);
    let id = idGio.recordset[0][""];
    req.body.arr.forEach(async (x) => {
      await connection
        .request()
        .input("idGio", sql.Int, id)
        .input("maCTSP", sql.Int, x.maCTSP)
        .input("soLuong", sql.Int, x.number)
        .input("gia", sql.Int, x.price)
        .query(
          `insert into CT_GioHang (idGio, maCTSP, soLuong, gia) values (@idGio, @maCTSP, @soLuong, @gia)`
        );
      let slTon = await connection
        .request()
        .query(`SELECT slTon FROM CT_SanPham where maCTSP = ${x.maCTSP}`);
      await connection
        .request()
        .query(
          `update CT_SanPham set slTon = ${
            slTon.recordset[0].slTon - x.number
          } where maCTSP = ${x.maCTSP}`
        );
    });
    let dsdh = await connection.request().query(`SELECT * FROM GioHang `);
    let dsdhct = await connection.request().query("select * from CT_GioHang");
    let data = dsdh.recordset.map((x) => ({
      ...x,
      detail: dsdhct.recordset.filter((y) => y.idGio === x.idGio),
    }));
    return res.status(200).send({ data: data });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ data: error });
  }
};

exports.layGioHang = async (req, res) => {
  try {
    let connection = await sql.connect(config);

    let dsdh = await connection
      .request()
      .query(
        `SELECT * FROM GioHang where maKH = ${req.params.maKH} order by ngayTao desc`
      );
    let dsdhct = await connection.request().query("select * from CT_GioHang");

    let data = dsdh.recordset.map((x) => ({
      ...x,
      detail: dsdhct.recordset.filter((y) => y.idGio === x.idGio),
    }));

    return res.status(200).send({ data: data });
  } catch (error) {
    console.log(error);
  }
};

const layKhuyenMai = async (res) => {
  try {
    let connection = await sql.connect(config);
    let dsSpct = await connection.request().query("select * from CT_SanPham");
    let dskm = await connection.request().query(`SELECT * FROM KhuyenMai`);
    let dskmct = await connection.request().query("SELECT * from CT_KhuyenMai");
    let data = dskm.recordset.map((x) => ({
      ...x,
      detail: dskmct.recordset.filter((y) => y.maKM === x.maKM),
    }));
    let kq = dsSpct.recordset;
    let currentDate = new Date();
    for (let i = 0; i < data?.length; ++i) {
      if (currentDate < new Date(data[i].ngayKetThuc) && currentDate >= new Date(data[i].ngayApDung)) {
        kq = kq.map((k) => {
          let result;
          if (data[i].detail.filter((y) => y.maCTSP == k.maCTSP)?.[0]) {
            result =
              k?.tiLeGiam !== undefined
                ? k?.tiLeGiam +
                  data[i].detail.filter((y) => y.maCTSP == k.maCTSP)?.[0]
                    ?.phanTramGiam
                : data[i].detail.filter((y) => y.maCTSP == k.maCTSP)?.[0]
                    ?.phanTramGiam;
            return {
              ...k,
              phanTramGiam: result,
            };
          }

          return {
            ...k,
          };
        });
      }
    }

    return kq;
  } catch (error) {
    console.log(error);
  }
};

exports.layNgoaiTe = async (req, res) => {
  try {
    let connection = await sql.connect(config);
    let dsnt = await connection.request().query("select * from NgoaiTe");

    return res.status(200).send({ data: dsnt.recordset[0] });
  } catch (error) {
    return res.status(400).send({ data: error });
  }
};

// admin

exports.layGioHangAdmin = async (req, res) => {
  try {
    let connection = await sql.connect(config);

    let dsdh = await connection
      .request()
      .query(`SELECT * FROM GioHang order by ngayTao desc`);
    let dsdhct = await connection.request().query("select * from CT_GioHang");

    let data = dsdh.recordset.map((x) => ({
      ...x,
      detail: dsdhct.recordset.filter((y) => y.idGio === x.idGio),
    }));

    return res.status(200).send({ data: data });
  } catch (error) {
    return res.status(400).send({ data: error });
  }
};

exports.layNhanVien = async (req, res) => {
  try {
    let connection = await sql.connect(config);
    // lay nv Giao
    let dstk = await connection
      .request()
      .query(`SELECT * FROM TaiKhoan where maQuyen = 3`);

    let dsnv = await connection.request().query(`SELECT * FROM NhanVien`);

    let nvGiao = dstk.recordset.map((x) => ({
      ...x,
      detail: dsnv.recordset.filter((y) => y.maTK === x.maTK),
    }));
    // lay nv duyet
    let dstkDuyet = await connection.request().query(`SELECT * FROM TaiKhoan`);

    let dsnvDuyet = await connection.request().query(`SELECT * FROM NhanVien`);

    let nvDuyet = dstkDuyet.recordset.map((x) => ({
      ...x,
      detail: dsnvDuyet.recordset.filter((y) => y.maTK === x.maTK),
    }));

    nvGiao.sort((a, b) => a.detail[0].soDonGiao - b.detail[0].soDonGiao);

    return res.status(200).send({
      data: {
        nvGiao: nvGiao,
        nvDuyet: nvDuyet,
      },
    });
  } catch (error) {
    return res.status(400).send({ data: error });
  }
};

exports.duyetDonHang = async (req, res) => {
  try {
    let connection = await sql.connect(config);
    await connection
      .request()
      .input("ngayGiao", sql.DateTime, req.body.ngayGiao)
      .input("maNVGiao", sql.NVarChar, req.body.maNVGiao)
      .input("maNVDuyet", sql.VarChar, req.body.maNVDuyet)
      .query(
        `update GioHang set ngayGiao = @ngayGiao, trangThai = ${req.body.trangThai}, maNVDuyet = @maNVDuyet, maNVGiao = @maNVGiao  where idGIo = ${req.body.idGio}`
      );

    return res.status(200).send({});
  } catch (error) {
    console.log(error);
    return res.status(400).send({ data: error });
  }
};

exports.huytDonHang = async (req, res) => {
  try {
    let connection = await sql.connect(config);

    await connection
      .request()
      .query(
        `update GioHang set trangThai = ${req.body.trangThai} where idGIo = ${req.body.idGio}`
      );

    return res.status(200).send({});
  } catch (error) {
    console.log(error);
    return res.status(400).send({ data: error });
  }
};

exports.themKhuyenMai = async (req, res) => {
  try {
    let connection = await sql.connect(config);
    await connection
      .request()
      .input("maNV", sql.VarChar, req.body.maNV)
      .input("ngayApDung", sql.DateTime, req.body.ngayApDung)
      .input("ngayKetThuc", sql.DateTime, req.body.ngayKetThuc)
      .input("moTa", sql.NVarChar, req.body.moTa)
      .query(
        `insert into KhuyenMai (maNV, ngayApDung, ngayKetThuc, moTa) values (@maNV, @ngayApDung, @ngayKetThuc, @moTa)`
      );
    let maKM = await connection
      .request()
      .input("maNV", sql.VarChar, req.body.maNV)
      .query(`select max(maKM) from KhuyenMai where maNV = @maNV`);
    let id = maKM.recordset[0][""];
    req.body.dssp.forEach( (x) => {
      x.detail?.forEach(async(e) => {
        await connection
        .request()
        .input("maKM", sql.Int, id)
        .input("maCTSP", sql.Int, e.maCTSP)
        .input("phanTramGiam", sql.Int, req.body.tiLeGiam)
        .query(
          `insert into CT_KhuyenMai (maKM, maCTSP, phanTramGiam) values (@maKM, @maCTSP, @phanTramGiam)`
        );
      })
          
    });
    let dskm = await connection.request().query(`SELECT * FROM KhuyenMai `);
    let dskmct = await connection.request().query("select * from CT_KhuyenMai");
    let data = dskm.recordset.map((x) => ({
      ...x,
      detail: dskmct.recordset.filter((y) => y.idGio === x.idGio),
    }));
    return res.status(200).send({ data: data });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ data: error });
  }
};

exports.themSanPhamKhuyenMai = async (req, res) => {
  try {
    let connection = await sql.connect(config);

    req.body.productList?.forEach( (x) => {
      x.detail?.forEach(async(e) => {
        await connection
        .request()
        .input("maKM", sql.Int, req.body.maKM)
        .input("maCTSP", sql.Int, e.maCTSP)
        .input("phanTramGiam", sql.Int, req.body.tiLeGiam)
        .query(
          `insert into CT_KhuyenMai (maKM, maCTSP, phanTramGiam) values (@maKM, @maCTSP, @phanTramGiam)`
        );
      })
          
    });
    let dskm = await connection.request().query(`SELECT * FROM KhuyenMai `);
    let dskmct = await connection.request().query("select * from CT_KhuyenMai");
    let data = dskm.recordset.map((x) => ({
      ...x,
      detail: dskmct.recordset.filter((y) => y.idGio === x.idGio),
    }));
    return res.status(200).send({ data: data });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ data: error });
  }
};



// in bao cao
exports.taoBaoCao = async (req, res) => {
  const data = {};
  pdf.create(baocao(req.body), {}).toFile("baocao.pdf", (err) => {
    if (err) {
      res.send(Promise.reject());
    }
    res.send(Promise.resolve());
  });
};
exports.inBaoCao = async (req, res) => {
  res.sendFile(`D:/thực hành tốt nghiệp 2022/BE/baocao.pdf`);
};
// in hoa don
exports.taoHoaDon = async (req, res) => {
  const data = {};
  pdf.create(hoadon(req.body), {}).toFile("hoadon.pdf", (err) => {
    if (err) {
      res.send(Promise.reject());
    }
    res.send(Promise.resolve());
  });
};
exports.inHoaDon = async (req, res) => {
  res.sendFile(`D:/thực hành tốt nghiệp 2022/BE/hoadon.pdf`);
};
