import AuthService from "../services/auth";
import checkRole from "../middlewares/checkRole";
import isAuth from "../middlewares/isAuth";
import attachCurrentUser from "../middlewares/attachCurrentUser";
import { UserAccount } from "../models/userAccount";
import { Channels } from "../models/channel";
import { Services } from "../models/services";

const plans = {
  packs: {
    silver: {
      channels: ["Zee", "Sony", "Star Plus"],
      amount: 50,
    },
    gold: {
      channels: ["Zee", "Sony", "Star Plus", "Discovery", "NatGeo"],
      amount: 100,
    },
  },
  channels: {
    Zee: 10,
    Sony: 15,
    "Star Plus": 20,
    Discovery: 10,
    NatGeo: 20,
  },
  services: {
    LearnEnglish: 200,
    LearnCooking: 100,
  },
};

export default (app) => {
  app.post("/user/login", async (req, res) => {
    const email = req.body.user.email;
    const password = req.body.user.password;
    try {
      const authServiceInstance = new AuthService();
      const { user, token } = await authServiceInstance.Login(email, password);
      return res.status(200).json({ user, token }).end();
    } catch (e) {
      return res.json(e).status(500).end();
    }
  });

  app.get("/user/checkbalance", isAuth, attachCurrentUser, async (req, res) => {
    try {
      const user = req.currentUser;
      console.log("asdas", user);
      UserAccount.get("" + user._id, (err, result) => {
        if (err) {
          return res.json(err).status(500);
        } else {
          console.log("sasdasad", result);
          return res.json(result[0].balance).status(200);
        }
      });
    } catch (e) {
      return res.json(e).status(500);
    }
  });

  app.get("/plans", isAuth, attachCurrentUser, async (req, res) => {
    try {
      const user = req.currentUser;
      console.log("asdas", user);
      return res.json(plans).status(200);
    } catch (e) {
      return res.json(e).status(500);
    }
  });

  app.post("/user/recharge", isAuth, attachCurrentUser, async (req, res) => {
    try {
      const user = req.currentUser;
      const balance = req.body.amount;
      console.log("asdas", user);
      UserAccount.updateBalance(
        { balance: balance, userid: user._id.toString() },
        (err, result) => {
          if (err) {
            return res.json(err).status(500);
          } else {
            console.log("sasdasad", result);
            return res.send("amound added!!").status(200);
          }
        }
      );
    } catch (e) {
      return res.json(e).status(500);
    }
  });

  app.post(
    "/user/subscribepack",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
      try {
        const user = req.currentUser;
        const pack = req.body.pack;
        const month = req.body.month;
        var constamount =
          pack == "S" ? plans.packs.silver.amount : plans.packs.gold.amount;
        const name = pack == "S" ? "silver" : "gold";
        constamount =
          month < 3
            ? constamount * month
            : constamount * month - constamount * month * 0.1;
        console.log("email send successfull!");
        console.log("sms send successfull!");
        UserAccount.subscribepack(
          {
            pack: pack,
            balance: constamount,
            userid: user._id.toString(),
          },
          (err, result) => {
            if (err) {
              return res.json(err).status(500);
            } else {
              console.log("sasdasad", result);
              return res.send("sub scribepack!!").status(200);
            }
          }
        );
      } catch (e) {
        return res.json(e).status(500);
      }
    }
  );

  app.post(
    "/user/subscribechannel",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
      try {
        const user = req.currentUser;
        var channels = req.body.channels;
        const month = req.body.month;
        var total = 0;
        channels = channels.map((channel: any) => {
          console.log(channel);
          console.log(plans.channels[channel]);
          total += month * plans.channels[channel];
          return {
            channelName: channel,
            channelAmount: month * plans.channels[channel],
          };
        });
        UserAccount.removeBalance(
          { balance: total, userid: user._id.toString() },
          (err, result) => {
            if (err) {
              return res.json(err).status(500);
            } else {
              Channels.create(
                {
                  channels: channels,
                  userId: user._id.toString(),
                },
                (err, result) => {
                  if (err) {
                    return res.json(err).status(500);
                  } else {
                    console.log("sasdasad", result);
                    return res.send("sub channel!!").status(200);
                  }
                }
              );
            }
          }
        );
      } catch (e) {
        return res.json(e).status(500);
      }
    }
  );

  app.post(
    "/user/subscribeservices",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
      try {
        const user = req.currentUser;
        var services = req.body.services;
        const month = req.body.month;
        var total = 0;
        services = services.map((service: any) => {
          console.log(service);
          console.log(plans.services[service]);
          total += month * plans.services[service];
          return {
            servicesName: service,
            servicesAmount: month * plans.services[service],
          };
        });
        UserAccount.removeBalance(
          { balance: total, userid: user._id.toString() },
          (err, result) => {
            if (err) {
              return res.json(err).status(500);
            } else {
              Services.create(
                {
                  services: services,
                  userId: user._id.toString(),
                },
                (err, result) => {
                  if (err) {
                    return res.json(err).status(500);
                  } else {
                    console.log("sasdasad", result);
                    return res.send("sub services!!").status(200);
                  }
                }
              );
            }
          }
        );
      } catch (e) {
        return res.json(e).status(500);
      }
    }
  );

  app.get("/user/getallplans", isAuth, attachCurrentUser, async (req, res) => {
    try {
      const user = req.currentUser;
      console.log("asdas", user);
      UserAccount.get("" + user._id, (err, result1) => {
        if (err) {
          return res.json(err).status(500);
        } else {
          // console.log("ssasdasad", result1);
          Services.get(user._id.toString(), (err, result2) => {
            if (err) {
              return res.json(err).status(500);
            } else {
              // console.log("ssasdasad", result2);
              Channels.get(user._id.toString(), (err, result3) => {
                if (err) {
                  return res.json(err).status(500);
                } else {
                  // console.log("sasdasad", result3);
                  var channels = result3.map((r) => r.channelname);
                  channels = channels.join(" + ");
                  var services = result2.map((s) => s.servicename);
                  services = services.join(" + ");
                  return res
                    .send(
                      `Currently subscribe packs and channels : ${
                        result1[0].package == "S" ? "Silver" : "Gold"
                      } + ${channels} \n Currently subscribe services : ${services}`
                    )
                    .status(200);
                }
              });
            }
          });
        }
      });
    } catch (e) {
      return res.json(e).status(500);
    }
  });

  // The middlewares need to be placed this way because they depend upong each other
  app.post(
    "/user/login-as",
    isAuth,
    attachCurrentUser,
    checkRole("admin"),
    async (req, res) => {
      try {
        const email = req.body.user.email;
        const authServiceInstance = new AuthService();
        const { user, token } = await authServiceInstance.LoginAs(email);
        return res.status(200).json({ user, token }).end();
      } catch (e) {
        console.log("Error in login as user: ", e);
        return res.json(e).status(500).end();
      }
    }
  );

  // app.get("/user/checkAcount", async (req, res) => {
  //   try {
  //     const { name, email, password } = req.body;

  //     const authServiceInstance = new AuthService();

  //     const { user, token } = await authServiceInstance.SignUp(
  //       email,
  //       password,
  //       name
  //     );

  //     return res.json({ user, token }).status(200).end();
  //   } catch (e) {
  //     return res.json(e).status(500).end();
  //   }
  // });
  app.post("/user/signup", async (req, res) => {
    try {
      const { name, email, password, mobilenumber } = req.body;

      const authServiceInstance = new AuthService();

      const { user, token } = await authServiceInstance.SignUp(
        email,
        password,
        name,
        mobilenumber
      );
      console.log("user", user);
      UserAccount.create({ userid: user.id }, (err, res1) => {
        if (err) {
          return res.json(err).status(500).end();
        } else {
          return res.json({ user, token }).status(200).end();
        }
      });
    } catch (e) {
      return res.json(e).status(500).end();
    }
  });
  app.post("/user/edit", isAuth, attachCurrentUser, async (req, res) => {
    try {
      const { email, mobilenumber } = req.body;
      const user1 = req.currentUser;

      const authServiceInstance = new AuthService();

      const { user } = await authServiceInstance.EditUser(
        user1._id,
        email,
        mobilenumber
      );
      console.log("user", user);

      return res
        .json("email and phone number updated successfully!!")
        .status(200)
        .end();
    } catch (e) {
      return res.json(e).status(500).end();
    }
  });
};
