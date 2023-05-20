class AuthController{
    async login(req,res){
        res.send("handle login...")
    }
    async signup(req,res){
        res.send("handle signup..")
    }
}

export default AuthController