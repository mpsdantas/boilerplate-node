
module.exports = (application) => {
  application.get('/', (req, res) => { res.send('Welcome to your application node :)')})
}
