const { Contact } = require("../services/contactServices");
const { Reports } = require("../services/reportServices");

const contact = async (req, res) => {
  const { subject, message } = req.body;
  const user = req.session.user.id;

  if (!subject || !message) {
    return res.json({
      success: false,
      message: "Please enter all fields!",
    });
  }

  try {
    await Contact.insert({userId: user, subject: subject, message: message});
    res.status(200).json({
        success: true,
        message: "We will contact you shortly!"
    })
  } catch (e){
    console.log(e);
    res.status(500).json({
        success: false,
        message: "Something went wrong!"
    })
  }
};

const report = async (req, res) => {
    const { itemId, subject, message } = req.body;
    const user = req.session.user.id;
  
    if (!user) {
      return res.status(401).json({ error: "Unauthorized!" });
    }
  
    if (!itemId || !subject || !message) {
      return res.json({
        success: false,
        message: "Please enter all fields!",
      });
    }
  
    try {
      await Reports.insert({userId: user, productId: itemId, subject: subject, message: message});
      res.status(200).json({
          success: true,
          message: "We will contact you shortly!"
      })
    } catch (e){
      console.log(e);
      res.status(500).json({
          success: false,
          message: "Something went wrong!"
      })
    }
  };

module.exports = { contact, report };
