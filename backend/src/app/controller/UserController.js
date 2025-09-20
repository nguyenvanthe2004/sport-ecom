const Users = require("../models/Users");

class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await Users.find();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
module.exports = new UserController();