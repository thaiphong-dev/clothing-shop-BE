module.exports = (data) =>{
    const today = new Date();
    const ngayGiao = new Date(data.ngayGiao);
    const list = data.detail
    const mappingSize = {
      1: "S",
      2: "M",
      3: "L",
      4: "XL",
      5: "XXL",
    };
    const addCommas = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, "");
let tong = 0
return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>in hinh giam dinh</title>
  </head>
  <style>
    .xcg13 {
      position: relative;
      margin: 1rem auto;
    }

    .xcg13_header {
      display: block;
      border: 0.125rem solid black;
      height: auto;
      width: 20rem;
      float: right;
      text-align: center;
    }

    .xcg13_title {
      position: relative;
      display: flex;
      top: 3rem;
      width: 70rem;
      margin: 0 auto;
      border-bottom: 0.1215rem solid black;
    }

    .xcg13_body {
      position: relative;
    }

    .xcg13_body-header {
      position: relative;
      top: 2rem;
      width: 45rem;
      margin: 0 auto;
    }

    .formatline {
      font-weight: 500;
      padding:0 1rem;
    }

    .formatTitle {
      text-align: center;
      /* font-weight: bold; */
    }

    table {
      border-collapse: collapse;
    }

    table,
    th,
    td {
      border: 1px solid;
    }

    .formatTable {
      position: relative;
      with: 150%
      top: 3rem;
      margin: 0 auto;
    }
  </style>

  <body>
    <div class="xcg13">
      
    
      <div class="xcg13_body">
        <div class="xcg13_body-header">
          <h1
            style="
              font-weight: 700;
              text-transform: uppercase;
              text-align: center;
            "
          >
            Hóa đơn số : ${data.idGio}
          </h1>
          <h2 class="formatline">
           Họ tên người nhận: ${data.hoTen}
          </h2>
          <h2 class="formatline">Số điện thoại: ${data.sdt}</h2>
          <h2 class="formatline">Địa chỉ: 70 nguyễn sỹ sách</h2>
          <h2 class="formatline">Ngày giao: ${`${ngayGiao.getDate()}/${ngayGiao.getMonth() + 1}/${ngayGiao.getFullYear()}`}</h2>

        </div>
        <div class="xcg13_body-table">
          <table class="formatTable">
          <tr style="border-bottom-style: hidden !important">
          <td>
            <div>
              <h2 class="formatTitle">Sản phẩm</h2>
            </div>
          </td>
          <td>
            <div>
              <h2 class="formatTitle" style = "width: 10rem">Giá</h2>
            </div>
          </td>
          <td>
            <div>
              <h2 class="formatTitle" style = "width: 5rem">Size</h2>
            </div>
          </td>
          <td>
            <div>
              <h2 class="formatTitle" style = "width: 5rem">Số lượng</h2>
            </div>
          </td>
          <td>
            <div>
              <h2 class="formatTitle" style = "width: 10rem">Thành tiền</h2>
            </div>
          </td>
        </tr>
        ${list?.map(x => {
          tong+= x.gia *x.soLuong
          return `
          <tr>
            <td>
            <div>
              <h2 class="formatline" style="text-align:center">${x.tenSP}</h2>
            </div>
          </td>
          <td>
            <div>
              <h2 class="formatline" style="text-align:center">${addCommas(x.gia)}</h2>
            </div>
          </td>
          <td>
            <div>
              <h2 class="formatline" style="text-align:center">${mappingSize[x.maSize]}</h2>
            </div>
          </td>
          <td>
            <div>
              <h2 class="formatline" style="text-align:center">${addCommas(x.soLuong)}</h2>
            </div>
          </td>
          <td>
            <div>
              <h2 class="formatline" style="text-align:center">${addCommas(x.gia* x.soLuong)}</h2>
            </div>
          </td>
            </tr>
          `
        })}

          </table>
        
        </div>
      </div>
      <h2 style="display:block; position: relative; left: 40rem">Tổng tiền: ${addCommas(removeNonNumeric(tong))} </h2>
      <h2 class="formatline" style="display:block; position: relative; top: 3rem; left: 35rem"> ${`Ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`}</h2>
      <div>
        <div style="padding-bottom: 10rem;">
          <h2 style="display:block; position: relative; top: 3rem; left: 38rem">Người nhận hàng </h2>
        </div>
      </div>
    </div>
  </body>
</html>
`
}