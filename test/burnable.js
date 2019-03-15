let TokenContract = artifacts.require('ERC721BasicBurnable');

const truffleAssert = require('truffle-assertions');

contract("ERC721BasicBurnable Token", async (accounts) => {
  let myContract, currentOwner, spender, user1;

  before(() => {
    currentOwner = accounts[0];
    operator = accounts[1];
    user1 = accounts[2];
    minter = accounts[3];
    user2 = accounts[4];
  });

  describe("constructor", async() => {
    it("initialized with the correct metadata and designates the deployer as a minter", async() => {
      myContract = await TokenContract.new("Sample ERC721 Burnable Token", "KLD721B");

      const transactionHash = myContract.transactionHash;
    
      const transactionReceipt = web3.eth.getTransactionReceipt(transactionHash);
      const blockNumber = transactionReceipt.blockNumber;

      const eventList = await myContract.getPastEvents("allEvents", {fromBlock: blockNumber, toBlock: blockNumber});
      const events = eventList.filter(ev => ev.transactionHash === transactionHash);
      expect(events.length).to.equal(1); // deployer/currentOwner is designated as a minter
      expect(events[0].event).to.equal('MinterAdded');
      expect(events[0].args.account).to.equal(currentOwner);
    });

    it("check the contract deployer balance is 0", async () => {
      let ownerBalance = await myContract.balanceOf(currentOwner);
      expect(ownerBalance.toString()).to.equal('0');
    });
  });

  describe('minting tokens', () => {
    it('current owner can mint new tokens for themselves', async () => {
      let result = await myContract.mintWithTokenURI(currentOwner, '1', 'Unique Token #1');

      truffleAssert.eventEmitted(result, 'Transfer', ev => {
        return ev.to === currentOwner && ev.tokenId.toString() === '1';
      }, `Issue a new token to ${currentOwner}`);

      let balance = await myContract.balanceOf(currentOwner);
      expect(balance.toString()).to.equal('1');

      let owner = await myContract.ownerOf('1');
      expect(owner).to.equal(currentOwner);

      // mint another one for burning later
      await myContract.mintWithTokenURI(currentOwner, '2', 'Unique Token #2');
    });

    it('current owner can mint new tokens for user1', async () => {
      let result = await myContract.mintWithTokenURI(user1, '3', 'Unique Token #3');

      truffleAssert.eventEmitted(result, 'Transfer', ev => {
        return ev.to === user1 && ev.tokenId.toString() === '3';
      }, `Issue a new token to ${user1}`);

      let balance = await myContract.balanceOf(user1);
      expect(balance.toString()).to.equal('1');

      let owner = await myContract.ownerOf('3');
      expect(owner).to.equal(user1);

      // mint another one for user1 for burning
      await myContract.mintWithTokenURI(user1, '4', 'Unique Token #4');
    });
  });

  describe('designating token operators to burn stuff up!', () => {
    it('curent owner can designate an operator to manage their tokens', async () => {
      let result = await myContract.approve(operator, '1');
      // now the operator has management privilege over token #1
      truffleAssert.eventEmitted(result, 'Approval', ev => {
        return ev.owner === currentOwner && ev.approved === operator && ev.tokenId.toString() === '1';
      }, `Designate token #1 to operator ${operator}`);
    });

    it('checking the approved operator on token 1', async () => {
      let result = await myContract.getApproved('1');
      expect(result).to.equal(operator);
    });

    it('blanket approval for operator to manager user1 assets', async () => {
      // user1 trust the operator completely with all of her assets
      let result = await myContract.setApprovalForAll(operator, true, {from: user1});
      truffleAssert.eventEmitted(result, 'ApprovalForAll', ev => {
        return ev.owner === user1 && ev.operator === operator && ev.approved === true;
      }, `Designate operator ${operator} to manage all assets of user1`);
    });

    it('checking the approved operator', async () => {
      let result = await myContract.isApprovedForAll(user1, operator);
      expect(result).to.equal(true);
    });

    it('user1 can burn his own token', async () => {
      let result = await myContract.burn('3', { from: user1 });
      truffleAssert.eventEmitted(result, 'Transfer', ev => {
        return ev.from === user1 && ev.to === '0x0000000000000000000000000000000000000000' && ev.tokenId.toString() === '3';
      }, `user1 ${user1} can burn his own token`);
    })

    it('operator now can burn on behalf of currentOwner from specific approval', async () => {
      let result = await myContract.burn('1', { from: operator });
      truffleAssert.eventEmitted(result, 'Transfer', ev => {
        return ev.from === currentOwner && ev.to === '0x0000000000000000000000000000000000000000' && ev.tokenId.toString() === '1';
      }, `operator ${operator} to burn token #1 on behalf of currentOwner`);
    });

    it('operator now can burn on behalf of user1 from blanket approval', async () => {
      let result = await myContract.burn('4', { from: operator });
      truffleAssert.eventEmitted(result, 'Transfer', ev => {
        return ev.from === user1 && ev.to === '0x0000000000000000000000000000000000000000' && ev.tokenId.toString() === '4';
      }, `operator ${operator} to transfer token #2 to user2 on behalf of user1`);
    });
  });
});