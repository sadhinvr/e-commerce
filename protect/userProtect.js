const isAuth = (req, res, next)=>{
    if(req.session.userId) { next() }
    else {
        console.log(`it is not user`)
        res.redirect('/login')
    }
}
const isNotAuth = (req, res, next) => {
    if (!req.session.userId) { next() }
    else {
        console.log('you are login ')
        res.redirect('/')
    }
}

module.exports = { isAuth, isNotAuth}