
const userController = {
    fetchUser: async (req, res) => {
        const user = req.user._doc
        return res.status(200).json({ user })
    }
}

export default userController