const config = {
  user: "sa",
  password: "123",
  server: "localhost",
  database: "ThuongMai",
  options: {
    cryptoCredentialsDetails: {
        minVersion: 'TLSv1'
    },
    trustedConnection: true,
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,
    instancename: "MSSQLSERVER1",
  },
//   port: 56686,
};
module.exports = config;
