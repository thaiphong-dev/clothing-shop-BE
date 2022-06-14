const sendEmailConfig = require("../config/sendEmail.config")
const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(sendEmailConfig.sendgrid_api_key);

const sendEmail = (receiver, source, subject, content) => {
  const data = {
    to: receiver,
    from: source,
    subject,
    html: content,
  };

  sgMail
    .send(data, function (error, result){
      console.log("data", data);
      if (error.response) {
        const {response} = error;
        const {body} = response;
        console.error(body);
      }
    })
}

module.exports = sendEmail
