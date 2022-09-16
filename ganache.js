const ganache = require("ganache");

const options = {
  default_balance_ether: 1000000,
  total_accounts: 10,
  hardfork: 'petersburg' 
};
const server = ganache.server(options);
const PORT = 7545;

process.once('SIGTERM', () => process.exit(0))

server.listen(PORT, async err => {
  if (err) throw err;

  console.log(`ganache listening on port ${PORT}...`);
});

